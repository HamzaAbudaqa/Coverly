from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pdfminer.high_level import extract_text
from io import BytesIO
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://coverly-seven.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI API Key
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# In-memory counter
counter = {"total": 130} #this is hardcoded because the count went to zero after Railway crashed, this is where it was at

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/count")
def get_count():
    return {"count": counter["total"]}

@app.post("/generate-cover-letter")
async def generate_cover_letter(resume: UploadFile, job_description: str = Form(...)):
    try:
        resume_content = await resume.read()
        resume_text = extract_text(BytesIO(resume_content))

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
- It must be professional but not sound AI generated.
- If the resume does not have the qualifications, then don't create fake experience, only use what's on the resume.
- Formal tone but confident.
"""

        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=600,
        )

        generated_letter = response.choices[0].message.content
        counter["total"] += 1  # increment the global count
        return {"cover_letter": generated_letter}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
