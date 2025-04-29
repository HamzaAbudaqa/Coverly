from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pdfminer.high_level import extract_text
import openai

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup your OpenAI API key
OPENAI_API_KEY = "Hi"

@app.post("/generate-cover-letter")
async def generate_cover_letter(resume: UploadFile, job_description: str = Form(...)):
    resume_content = await resume.read()
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
- It must be professional but not sound Ai generated.
- If the resume does not have the qualifications, then don't create fake experience, only use whats on the resume.
- Formal tone but confident.
"""

    client = openai.OpenAI(api_key=OPENAI_API_KEY)  # <----- Pass it here

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600,
    )

    generated_letter = response.choices[0].message.content
    return {"cover_letter": generated_letter}
