import asyncio
from _winapi import CREATE_NEW_CONSOLE
from common.common import extract_pdf_text, prepare_prompt, prepare_keyword_match_prompt, get_gemini_response, get_openrouter_response
from common.prompts import job_post_prompts
from fastapi.responses import JSONResponse
import os
import json
from dotenv import load_dotenv
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient


# Always load Backend/.env regardless of current working directory.
ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=ENV_PATH)
MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["Airesume"]
resume_collection = db["resumes"]

router = APIRouter()



@router.post("/analyze")
async def analyze_resume(resume: UploadFile = File(...), job_description: str = Form(...)):
    # print("Python analyze endpoint called ", resume)
    # print(f"Received job description: {job_description}")
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    try:
        resume_text = await asyncio.to_thread(extract_pdf_text, resume.file)
        prompt = await prepare_prompt(resume_text, job_description)
        try:
            ai_response = await get_gemini_response(prompt)
        except Exception as gemini_error:
            ai_response = await get_openrouter_response(prompt)
        response_json = json.loads(ai_response)
        return JSONResponse(content=response_json)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-pdf-text")
async def extract_pdf_text_api(resume: UploadFile = File(...)):
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        resume_text = extract_pdf_text(resume.file)
        return JSONResponse(content={"text": resume_text})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-keywords")
async def extract_keywords(resume: UploadFile = File(...), job_description: str = Form(...)):
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        resume_text = await asyncio.to_thread(extract_pdf_text, resume.file)
        prompt = await prepare_keyword_match_prompt(resume_text, job_description)

        try:
            ai_response = await get_gemini_response(prompt)
        except Exception:
            ai_response = await get_openrouter_response(prompt)

        response_json = json.loads(ai_response)
        return JSONResponse(content=response_json)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-job-description")
async def generate_job_description(request: Request):
    try:
        payload = await request.json()
        job_title = (payload.get("job_title") or payload.get("jobTitle") or "").strip()

        if not job_title:
            raise HTTPException(status_code=400, detail="job_title is required")

        prompt = await job_post_prompts({
            "job_title": job_title,
            "department": str(payload.get("department") or ""),
            "employment_type": str(payload.get("employment_type") or payload.get("employmentType") or ""),
            "location": str(payload.get("location") or ""),
            "salary_range": str(payload.get("salary_range") or payload.get("salaryRange") or ""),
            "required_skills": ", ".join(payload.get("required_skills") or payload.get("requiredSkills") or []) if isinstance(payload.get("required_skills") or payload.get("requiredSkills"), list) else str(payload.get("required_skills") or payload.get("requiredSkills") or ""),
            "additional_notes": str(payload.get("additional_notes") or payload.get("additionalNotes") or ""),
        })

        try:
            ai_response = await get_gemini_response(prompt)
        except Exception:
            ai_response = await get_openrouter_response(prompt)

        response_json = json.loads(ai_response)
        
        if "jobDescription" in response_json:
            response_json = {"jobDescription": response_json["jobDescription"]}
            
        return JSONResponse(content=response_json)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
