import asyncio
from common.common import extract_pdf_text, prepare_prompt, prepare_keyword_match_prompt, get_gemini_response, get_openrouter_response
from common.prompts import job_post_prompts
from fastapi.responses import JSONResponse
import json
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
import urllib.request
import io
import os
import socket
import ipaddress
from urllib.parse import urlparse

MAX_RESUME_BYTES = int(os.getenv("MAX_RESUME_BYTES", "10485760"))
RESUME_FETCH_TIMEOUT = int(os.getenv("RESUME_FETCH_TIMEOUT", "10"))
ALLOWED_RESUME_HOSTS = {
    host.strip().lower()
    for host in os.getenv("RESUME_URL_ALLOWED_HOSTS", "res.cloudinary.com").split(",")
    if host.strip()
}


def _host_is_allowed(hostname: str) -> bool:
    return any(hostname == allowed or hostname.endswith(f".{allowed}") for allowed in ALLOWED_RESUME_HOSTS)


def _resolve_and_validate_host(hostname: str) -> None:
    try:
        addr_info = socket.getaddrinfo(hostname, 443, proto=socket.IPPROTO_TCP)
    except socket.gaierror as exc:
        raise HTTPException(status_code=400, detail=f"Unable to resolve hostname: {exc}") from exc

    for item in addr_info:
        resolved_ip = item[4][0]
        ip_obj = ipaddress.ip_address(resolved_ip)
        if (
            ip_obj.is_private
            or ip_obj.is_loopback
            or ip_obj.is_link_local
            or ip_obj.is_reserved
            or ip_obj.is_multicast
            or ip_obj.is_unspecified
        ):
            raise HTTPException(status_code=400, detail="Resolved IP is not allowed")


class _NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def secure_fetch_resume(resume_url: str) -> io.BytesIO:
    parsed = urlparse(resume_url)
    if parsed.scheme != "https":
        raise HTTPException(status_code=400, detail="Only https resume URLs are allowed")

    hostname = (parsed.hostname or "").lower().strip()
    if not hostname:
        raise HTTPException(status_code=400, detail="Invalid resume URL hostname")

    if not _host_is_allowed(hostname):
        raise HTTPException(status_code=400, detail="Resume URL host is not allow-listed")

    _resolve_and_validate_host(hostname)

    request = urllib.request.Request(resume_url, headers={"User-Agent": "HireSense/1.0"})
    opener = urllib.request.build_opener(_NoRedirectHandler())

    try:
        with opener.open(request, timeout=RESUME_FETCH_TIMEOUT) as response:
            if 300 <= getattr(response, "status", 200) < 400:
                raise HTTPException(status_code=400, detail="Redirects are not allowed")

            content_length = response.headers.get("Content-Length")
            if content_length and int(content_length) > MAX_RESUME_BYTES:
                raise HTTPException(status_code=400, detail="Resume file too large")

            buffer = io.BytesIO()
            total_read = 0
            while True:
                chunk = response.read(64 * 1024)
                if not chunk:
                    break
                total_read += len(chunk)
                if total_read > MAX_RESUME_BYTES:
                    raise HTTPException(status_code=400, detail="Resume file too large")
                buffer.write(chunk)
            buffer.seek(0)
            return buffer
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to fetch resume from URL: {exc}") from exc


async def require_internal_service_key(x_internal_service_key: Optional[str] = Header(default=None, alias="X-Internal-Service-Key")):
    expected_key = os.getenv("PYTHON_INTERNAL_SERVICE_KEY")
    if not expected_key:
        raise HTTPException(status_code=500, detail="Internal service key is not configured")
    if not x_internal_service_key or x_internal_service_key != expected_key:
        raise HTTPException(status_code=401, detail="Unauthorized")

router = APIRouter(dependencies=[Depends(require_internal_service_key)])

class AnalyzeRequest(BaseModel):
    job_description: str = ""
    resume_url: str

class ExtractTextRequest(BaseModel):
    resume_url: str

class ExtractKeywordsRequest(BaseModel):
    job_description: str = ""
    resume_url: str



@router.post("/analyze")
async def analyze_resume(request: Request):
    print("request-->",request)
    payload = await request.json()
    job_description = payload.get("job_description")
    resume_url = payload.get("resume_url")

    if not resume_url:
        raise HTTPException(status_code=400, detail="resume_url must be provided.")
        
    print("job description:",job_description , "resume url:", resume_url)
    file_obj = secure_fetch_resume(resume_url)

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
async def extract_pdf_text_api(payload: ExtractTextRequest):
    resume_url = payload.resume_url
    
    if not resume_url:
        raise HTTPException(status_code=400, detail="resume_url must be provided.")
        
    file_obj = secure_fetch_resume(resume_url)

    try:
        resume_text = extract_pdf_text(file_obj)
        return JSONResponse(content={"text": resume_text})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-keywords")
async def extract_keywords(payload: ExtractKeywordsRequest):
    job_description = payload.job_description
    resume_url = payload.resume_url

    if not resume_url:
        raise HTTPException(status_code=400, detail="resume_url must be provided.")
        
    file_obj = secure_fetch_resume(resume_url)

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
