import asyncio
from common.common import extract_pdf_text, prepare_prompt, prepare_keyword_match_prompt, get_gemini_response, get_openrouter_response
from common.prompts import job_post_prompts
from fastapi.responses import JSONResponse
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
import urllib.request
import io

router = APIRouter()



@router.post("/analyze")
async def analyze_resume(job_description: str = Form(...), resume: UploadFile = File(None), resume_url: str = Form(None)):
    if not resume and not resume_url:
        raise HTTPException(status_code=400, detail="Either resume file or resume_url must be provided.")
        
    file_obj = None
    print("job description:",job_description , "resule url:", resume_url , "resume:",resume)
    if resume_url:
        try:
            req = urllib.request.Request(resume_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                file_obj = io.BytesIO(response.read())
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to fetch resume from URL: {str(e)}")
    else:
        if resume.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        file_obj = resume.file

    try:
        resume_text = await asyncio.to_thread(extract_pdf_text, file_obj)
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
async def extract_pdf_text_api(resume: UploadFile = File(None), resume_url: str = Form(None)):
    if not resume and not resume_url:
        raise HTTPException(status_code=400, detail="Either resume file or resume_url must be provided.")
        
    file_obj = None
    if resume_url:
        try:
            req = urllib.request.Request(resume_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                file_obj = io.BytesIO(response.read())
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to fetch resume from URL: {str(e)}")
    else:
        if resume.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        file_obj = resume.file

    try:
        resume_text = extract_pdf_text(file_obj)
        return JSONResponse(content={"text": resume_text})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-keywords")
async def extract_keywords(job_description: str = Form(...), resume: UploadFile = File(None), resume_url: str = Form(None)):
    if not resume and not resume_url:
        raise HTTPException(status_code=400, detail="Either resume file or resume_url must be provided.")
        
    file_obj = None
    if resume_url:
        try:
            req = urllib.request.Request(resume_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                file_obj = io.BytesIO(response.read())
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to fetch resume from URL: {str(e)}")
    else:
        if resume.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        file_obj = resume.file

    try:
        resume_text = await asyncio.to_thread(extract_pdf_text, file_obj)
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
