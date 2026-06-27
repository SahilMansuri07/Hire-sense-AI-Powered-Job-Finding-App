import asyncio
import json
import os
import re
from urllib import error, request

import PyPDF2 as pdf
import google.generativeai as genai
from common.prompts import prompts, keyword_match_prompt


def Configure_genai(api_key):
    try:
        genai.configure(api_key=api_key)
    except Exception as e:
        raise Exception(f"Error configuring Google Generative AI: {str(e)}")


def extract_pdf_text(uploaded_file):
    try:
        reader = pdf.PdfReader(uploaded_file)
        if len(reader.pages) == 0:
            raise Exception("The PDF file is empty or has no pages.")
        text = [page.extract_text() for page in reader.pages if page.extract_text()]
        if not text:
            raise Exception("No text found in the PDF file.")
        return "".join(text)
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")


async def prepare_prompt(resume_text, job_description):
    if not resume_text or not job_description:
        raise ValueError("Resume text and job description cannot be empty.")

    return await prompts(resume_text, job_description)


async def prepare_keyword_match_prompt(resume_text, job_description):
    if not resume_text or not job_description:
        raise ValueError("Resume text and job description cannot be empty.")

    return await keyword_match_prompt(resume_text, job_description)


def _get_gemini_response_sync(prompt):
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)

        if not response or not response.text:
            raise Exception("No response received from the Google Generative AI API.")

        raw_text = response.text.strip()
        json_pattern = r"\{(?:[^{}]|(?:\{[^{}]*\}))*\}"
        match = re.search(json_pattern, raw_text)

        if not match:
            json_pattern_simple = r"\{[\s\S]*?\}"
            match = re.search(json_pattern_simple, raw_text)
            if not match:
                raise ValueError("Could not find a valid JSON object in the response.")

        json_str = match.group()
        response_json = json.loads(json_str)

        return json_str

    except Exception as e:
        raise Exception(f"Error getting response from Google Generative AI: {str(e)}")


async def get_gemini_response(prompt):
    return await asyncio.to_thread(_get_gemini_response_sync, prompt)


def _extract_json_from_text(raw_text):
    cleaned_text = raw_text.strip()
    json_pattern = r"\{(?:[^{}]|(?:\{[^{}]*\}))*\}"
    match = re.search(json_pattern, cleaned_text)

    if not match:
        json_pattern_simple = r"\{[\s\S]*?\}"
        match = re.search(json_pattern_simple, cleaned_text)
        if not match:
            raise ValueError("Could not find a valid JSON object in the response.")

    json_str = match.group()
    response_json = json.loads(json_str)

    normalized_json = _normalize_analysis_json(response_json)
    return json.dumps(normalized_json)


def _normalize_analysis_json(response_json):
    if not isinstance(response_json, dict):
        raise ValueError("Response JSON must be an object.")

    normalized_json = dict(response_json)

    missing_keywords = normalized_json.get("Missing Keywords")
    if missing_keywords is None:
        keyword_analysis = normalized_json.get("Keyword Analysis")
        if isinstance(keyword_analysis, dict):
            missing_keywords = keyword_analysis.get("Missing Keywords")

    if missing_keywords is None:
        missing_keywords = []

    jd_match = normalized_json.get("JD Match")
    if jd_match is None:
        jd_match = "0"

    normalized_json["JD Match"] = jd_match
    normalized_json["Missing Keywords"] = missing_keywords

    return normalized_json


def _get_openrouter_response_sync(prompt):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise Exception("OPENROUTER_API_KEY is not configured.")

    model = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You are a professional resume reviewer. Respond strictly in JSON only with the keys JD Match, Missing Keywords.",
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.2,
    }

    api_request = request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )

    try:
        with request.urlopen(api_request, timeout=60) as response:
            response_text = response.read().decode("utf-8")
            response_data = json.loads(response_text)
            choices = response_data.get("choices", [])
            if not choices:
                raise Exception("No choices received from OpenRouter.")

            message = choices[0].get("message", {})
            content = message.get("content", "")
            if not content:
                raise Exception("OpenRouter response did not contain message content.")

            return _extract_json_from_text(content)
    except error.HTTPError as http_error:
        error_body = http_error.read().decode("utf-8", errors="ignore")
        raise Exception(f"OpenRouter request failed with status {http_error.code}: {error_body}")
    except Exception as e:
        raise Exception(f"Error getting response from OpenRouter: {str(e)}")


async def get_openrouter_response(prompt):
    return await asyncio.to_thread(_get_openrouter_response_sync, prompt)
