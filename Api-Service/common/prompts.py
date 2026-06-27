async def prompts(resume_text, job_description):
    prompt = f"""
You are a professional ATS (Applicant Tracking System) and technical recruiter.

Analyze the resume against the job description and return a **strict JSON response only**.

Focus on:
- Skills match (technical + soft skills)
- Experience level (Junior / Mid / Senior)
- Relevance of past work
- Missing requirements
- Overall candidate strength

Resume:
{resume_text.strip()}

Job Description:
{job_description.strip()}

Respond ONLY in this JSON format:

{{
  "JD Match": "percentage between 0-100",

  "Skills Analysis": {{
    "Matched Skills": ["skill1", "skill2"],
    "Missing Skills": ["skill1", "skill2"],
    "Skill Match Score": "percentage between 0-100"
  }},

  "Experience Analysis": {{
    "Experience Level": "Fresher / Junior / Mid-Level / Senior",
    "Years of Experience": "estimated number",
    "Relevant Experience Summary": "brief explanation",
    "Experience Match Score": "percentage between 0-100"
  }},

  "Keyword Analysis": {{
    "Matched Keywords": ["keyword1"],
    "Missing Keywords": ["keyword1"]
  }},

  "Strengths": [
    "strength1",
    "strength2"
  ],

  "Weaknesses": [
    "weakness1",
    "weakness2"
  ],

  "Improvement Suggestions": [
    "suggestion1",
    "suggestion2"
  ]
}}

"""
    return prompt


async def keyword_match_prompt(resume_text, job_description):
  prompt = f"""
You are an ATS keyword matching engine.

Compare the resume against the job description and return strict JSON only.

Rules:
- Extract the most important keywords from the job description.
- Match them against the resume.
- Use exact or close semantic matches only when supported by the resume.
- Keep the output simple and machine-readable.

Resume:
{resume_text.strip()}   

Job Description:
{job_description.strip()}

Return ONLY this JSON format:

{{
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "match_score": "percentage between 0-100"
}}

"""
  return prompt


async def job_post_prompts(job_details):
    prompt = f"""
You are a senior technical recruiter and hiring manager.

Generate a professional job post in strict JSON only.

Use the provided details to write a clear and concise job description, requirements, and benefits.

Job Title:
{job_details.get('job_title', '').strip()}

Department:
{job_details.get('department', '').strip()}

Employment Type:
{job_details.get('employment_type', '').strip()}

Location:
{job_details.get('location', '').strip()}

Salary Range:
{job_details.get('salary_range', '').strip()}

Required Skills:
{job_details.get('required_skills', '').strip()}

Additional Notes:
{job_details.get('additional_notes', '').strip()}

Return ONLY this JSON format:

{{
  "jobDescription": {{
    "description": "A polished 3-5 sentence overview of the role.",
    "requirements": "A detailed paragraph or bullet-style text covering qualifications and responsibilities.",
    "benefits": "A detailed paragraph or bullet-style text covering perks and compensation highlights."
  }}
}}

"""
    return prompt
