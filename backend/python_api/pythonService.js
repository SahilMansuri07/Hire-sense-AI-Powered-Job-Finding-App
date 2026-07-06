import fs from "fs/promises";

const PYTHON_API_BASE_URL = (process.env.PYTHON_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

async function readUploadBuffer(file) {
  if (file?.buffer) {
    return file.buffer;
  }

  if (file?.path) {
    return fs.readFile(file.path);
  }

  return null;
}

export async function extractPdfTextFromPython(fileOrUrl, job_description) {
  try {
    const formData = new FormData();
    
    if (typeof fileOrUrl === 'string' && fileOrUrl.startsWith('http')) {
      formData.append("resume_url", fileOrUrl);
    } else {
      const fileBuffer = await readUploadBuffer(fileOrUrl);
      if (!fileBuffer) return null;
      const resumeBlob = new Blob([fileBuffer], { type: fileOrUrl.mimetype || "application/pdf" });
      formData.append("resume", resumeBlob, fileOrUrl.originalname || "resume.pdf");
    }
    
    formData.append("job_description", job_description || "");

    const response = await fetch(`${PYTHON_API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Python analyze endpoint failed (${response.status}): ${errorBody}`);
    }

    const result = await response.json();
    return result || null;
  } catch (error) {
    console.error("extractPdfTextFromPython error:", error);
    return null;
  }
}

export async function getAiJobDescription(payload) {
  const response = await fetch(`${PYTHON_API_BASE_URL}/generate-job-description`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AI job generation failed (${response.status}): ${errorBody}`);
  }

  return response.json();
}

export async function extractKeywordsFromPython(fileOrUrl, jobDescription = "") {
  try {
    const formData = new FormData();
    
    if (typeof fileOrUrl === 'string' && fileOrUrl.startsWith('http')) {
      formData.append("resume_url", fileOrUrl);
    } else {
      const fileBuffer = await readUploadBuffer(fileOrUrl);
      if (!fileBuffer) return null;
      const resumeBlob = new Blob([fileBuffer], { type: fileOrUrl.mimetype || "application/pdf" });
      formData.append("resume", resumeBlob, fileOrUrl.originalname || "resume.pdf");
    }
    
    formData.append("job_description", jobDescription || "");

    const response = await fetch(`${PYTHON_API_BASE_URL}/extract-keywords`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Python keyword extraction failed (${response.status}): ${errorBody}`);
    }

    const result = await response.json();
    return result || null;
  } catch (error) {
    console.error("extractKeywordsFromPython error:", error);
    return null;
  }
}