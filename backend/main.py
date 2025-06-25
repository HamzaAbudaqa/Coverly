# main.py
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

# Pydantic model for request body
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
        conn = psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
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
        """,
        (
            data.user_id,
            data.fullName,
            data.address,
            data.phoneNumber,
            data.email,
            data.resume,
            data.pastWorkExperience,
            data.skills,
            data.pastProjects
        ))

        conn.commit()
        cur.close()
        conn.close()
        return {"message": "Template saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/template/{user_id}")
def get_template(user_id: str):
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        cur = conn.cursor()
        cur.execute("SELECT * FROM templates WHERE user_id = %s", (user_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()

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
