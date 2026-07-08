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
    const payload = {
      job_description: job_description || ""
    };
    
    if (typeof fileOrUrl === 'string' && fileOrUrl.startsWith('http')) {
      payload.resume_url = fileOrUrl;
    } else {
      console.warn("File buffer sent to JSON payload is not fully supported yet in this implementation.");
      return null;
    }

    const response = await fetch(`${PYTHON_API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
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
    const payload = {
      job_description: jobDescription || ""
    };
    
    if (typeof fileOrUrl === 'string' && fileOrUrl.startsWith('http')) {
      payload.resume_url = fileOrUrl;
    } else {
      console.warn("File buffer sent to JSON payload is not fully supported yet in this implementation.");
      return null;
    }

    const response = await fetch(`${PYTHON_API_BASE_URL}/extract-keywords`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
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