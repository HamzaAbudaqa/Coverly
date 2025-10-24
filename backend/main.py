from fastapi import FastAPI, Request, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import os
import json
from dotenv import load_dotenv
from openai import OpenAI
import psycopg2

load_dotenv()

# --- OpenAI client (once) ---
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Models ----------
class DOMField(BaseModel):
    id: str
    label: str
    placeholder: str
    name: str
    classList: List[str]

class AutofillPayload(BaseModel):
    instruction: str
    dom_snapshot: List[DOMField]
    user_data: Dict[str, Any]   # <— accept nested data (arrays/objects)

# ---------- (Your DB config + /template endpoints unchanged) ----------
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

class TemplateData(BaseModel):
    user_id: str
    fullName: str
    address: str
    phoneNumber: str
    email: str
    resume: str
    pastWorkExperience: str
    skills: str
    pastProjects: str

@app.post("/template")
def save_template(data: TemplateData):
    try:
        conn = psycopg2.connect(host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO templates (user_id, full_name, address, phone_number, email, resume, experience, skills, projects)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (user_id) DO UPDATE SET
                full_name = EXCLUDED.full_name,
                address = EXCLUDED.address,
                phone_number = EXCLUDED.phone_number,
                email = EXCLUDED.email,
                resume = EXCLUDED.resume,
                experience = EXCLUDED.experience,
                skills = EXCLUDED.skills,
                projects = EXCLUDED.projects;
        """, (
            data.user_id, data.fullName, data.address, data.phoneNumber, data.email,
            data.resume, data.pastWorkExperience, data.skills, data.pastProjects
        ))
        conn.commit()
        cur.close(); conn.close()
        return {"message": "Template saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/template/{user_id}")
def get_template(user_id: str):
    try:
        conn = psycopg2.connect(host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()
        cur.execute("SELECT * FROM templates WHERE user_id = %s", (user_id,))
        row = cur.fetchone()
        cur.close(); conn.close()
        if not row:
            raise HTTPException(status_code=404, detail="Template not found")
        return {
            "user_id": row[0],
            "fullName": row[1],
            "address": row[2],
            "phoneNumber": row[3],
            "email": row[4],
            "resume": row[5],
            "pastWorkExperience": row[6],
            "skills": row[7],
            "pastProjects": row[8],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------- Autofill planner ----------
@app.post("/autofill-plan")
async def autofill_plan(payload: AutofillPayload) -> Dict[str, Any]:
    """
    Accepts DOM snapshot + user_data and returns a mapping:
      { "#inputId": "value", ... }
    """
    try:
        messages = [
            {
                "role": "system",
                "content": (
                    "You map user data to form fields. "
                    "Given DOM snapshot + user data, return ONLY a JSON object "
                    "where each key is an input ID prefixed with '#', and each value is the autofill value."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Instruction: {payload.instruction}\n\n"
                    f"DOM: {payload.dom_snapshot}\n\n"
                    f"User data: {payload.user_data}"
                ),
            },
        ]

        resp = client.chat.completions.create(
            model="gpt-4o-mini",  # or "gpt-4", depending on your access
            messages=messages,
            temperature=0.2,
        )

        reply = resp.choices[0].message.content.strip()

        # Handle code fences or non-pure JSON
        if reply.startswith("```"):
            reply = reply.strip("`")
            # remove possible language hint like ```json
            if "\n" in reply:
                reply = reply.split("\n", 1)[1]

        try:
            mapping = json.loads(reply)
        except Exception:
            # fallback: try to find {...} substring
            start = reply.find("{"); end = reply.rfind("}")
            if start != -1 and end != -1 and end > start:
                mapping = json.loads(reply[start:end+1])
            else:
                raise

        # Sanitize: only #id keys
        if not isinstance(mapping, dict):
            raise ValueError("Planner returned non-object JSON")
        mapping = {k: v for k, v in mapping.items() if isinstance(k, str) and k.startswith("#")}

        return mapping

    except Exception as e:
        print("❌ Error in /autofill-plan:", e)
        raise HTTPException(status_code=500, detail=str(e))
