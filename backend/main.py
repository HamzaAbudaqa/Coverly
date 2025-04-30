# main.py
from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pdfminer.high_level import extract_text
import openai
import os
import json
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
COUNTER_FILE = Path("cover_letter_counter.json")

def increment_counter():
    if COUNTER_FILE.exists():
        with open(COUNTER_FILE, "r") as f:
            data = json.load(f)
    else:
        data = {"count": 0}
    data["count"] += 1
    with open(COUNTER_FILE, "w") as f:
        json.dump(data, f)

def get_counter():
    if COUNTER_FILE.exists():
        with open(COUNTER_FILE, "r") as f:
            data = json.load(f)
            return data.get("count", 0)
    return 0

@app.post("/generate-cover-letter")
async def generate_cover_letter(resume: UploadFile, job_description: str = Form(...)):
    resume_text = extract_text(resume.file)

    prompt = f"""You are an expert resume writer.
Write a personalized cover letter based on the following resume and job description:

Resume:
{resume_text}

Job Description:
{job_description}

Requirements:
- About 250-300 words
- Mention specific skills that match the job
- The cover letter must relate the skills used in the resume experience to what is looked for in the job description.
- It must be professional but not sound Ai generated, do not use words such as Keen.
- If the resume does not have the qualifications, then don't create fake experience, only use whats on the resume.
- Formal tone but confident.
"""

    client = openai.OpenAI(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600,
    )
    increment_counter()
    generated_letter = response.choices[0].message.content
    return {"cover_letter": generated_letter}

@app.get("/count")
def count_generated():
    return {"count": get_counter()}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
