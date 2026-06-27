# Backend API Documentation

This document provides a comprehensive overview of the available APIs in the system, broken down by modules. It includes the API paths, request methods, required request bodies, and expected response patterns.

---

## 1. Auth Module
These APIs manage user authentication, onboarding, and profile details.

### 1.1. Validate User
Check if email/mobile/social ID is already registered.
- **URL**: `/api/v1/auth/validate-user`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string (optional)",
    "mobile_number": "string (optional)",
    "country_code": "string (optional)",
    "social_id": "string (optional)",
    "login_type": "string"
  }
  ```
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "User_created_successfully",
    "data": { 
      "token": "...",
      "...userDetails": "..."
    }
  }
  ```

### 1.2. Signup
Register a new user.
- **URL**: `/api/v1/auth/signup`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string (required if login_type is 's')",
    "mobile_number": "string",
    "country_code": "string",
    "login_type": "string ('s' for standard, else social)",
    "social_id": "string (optional)",
    "role": "string ('user', 'admin', 'recruiter')"
  }
  ```
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "User_created_successfully",
    "data": { "token": "...", "...userDetails": "..." }
  }
  ```

### 1.3. Login
Authenticate a user.
- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string (required for local login)",
    "password": "string (required for local login)",
    "social_id": "string (required for social login)",
    "login_type": "string ('s' for local, else social)"
  }
  ```
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Login_success",
    "data": {
      "token": "...",
      "user": { "...userDetails" },
      "role": "user | recruiter | admin"
    }
  }
  ```

### 1.4. Upload Resume
Upload and parse user resume.
- **URL**: `/api/v1/auth/upload-resume`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body** (FormData):
  - `resume` or `file`: File
  - `job_description`: "string (optional)"
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Resume_uploaded_successfully",
    "data": { "parsed_python_response": "..." }
  }
  ```

### 1.5. Skills Listing
Get a list of available skills.
- **URL**: `/api/v1/auth/skills`
- **Method**: `GET`
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Skills_listed",
    "data": [
      { "_id": "...", "name": "...", "is_active": true }
    ]
  }
  ```

### 1.6. Set Up Preferences
Set job role and skills preferences.
- **URL**: `/api/v1/auth/set-up-preferences`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "jobRoleId": "string",
    "experienceLevel": "string ('Fresher', 'Junior', 'Mid', 'Senior')",
    "skills_id": ["string"]
  }
  ```
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Preferences_set_up_successfully",
    "data": {
      "userId": "...",
      "jobRole": "...",
      "experience": "...",
      "skills": ["..."]
    }
  }
  ```

### 1.7. Get User Profile
Fetch the current logged-in user's profile details.
- **URL**: `/api/v1/auth/user-profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Profile fetched",
    "data": {
      "userId": "...",
      "jobRole": "...",
      "experience": "...",
      "skills": ["..."]
    }
  }
  ```

---

## 2. Recruiter Module
These APIs are for recruiters to manage jobs. **Note**: The user role must be `recruiter`.

### 2.1. Generate Job Description
Use AI to generate a detailed job description.
- **URL**: `/api/v1/recruiter/generate-job-description`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "jobTitle": "string",
    "department": "string",
    "employmentType": "string",
    "location": "string",
    "salaryRange": "string or object",
    "requiredSkills": ["string"],
    "additionalNotes": "string (optional)"
  }
  ```
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Job_generated_successfully",
    "data": { "ai_generated_job_description": "..." }
  }
  ```

### 2.2. Post Job
Create a new job posting.
- **URL**: `/api/v1/recruiter/post-job`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "jobTitle": "string",
    "department": "string",
    "location": "string (optional)",
    "latitude": "number (optional)",
    "longitude": "number (optional)",
    "employmentType": "string",
    "jobType": "string",
    "salaryRange": "string or object",
    "requiredSkills": ["string"],
    "jobDescription": "object (optional)",
    "description": "string (optional)",
    "requirements": "string (optional)",
    "benefits": "string (optional)",
    "status": "string (draft/published)",
    "generateWithAI": "boolean",
    "additionalNotes": "string (optional)"
  }
  ```
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Job_posted_successfully",
    "data": { "_id": "...", "...jobDetails": "..." }
  }
  ```

### 2.3. Edit Job
Update an existing job posting.
- **URL**: `/api/v1/recruiter/edit-job`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "jobId": "string (required)",
    "jobTitle": "string (optional)",
    "department": "string (optional)",
    "...otherFields": "optional",
    "generateWithAI": "boolean (optional)",
    "additionalNotes": "string (optional)"
  }
  ```
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Job_updated_successfully",
    "data": { "_id": "...", "...updatedJobDetails": "..." }
  }
  ```

### 2.4. Delete Job
Soft delete a job posting.
- **URL**: `/api/v1/recruiter/delete-job`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "jobId": "string (required)"
  }
  ```
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Job_deleted_successfully",
    "data": { "_id": "...", "is_delete": true }
  }
  ```

---

## 3. User Module
These APIs relate to job listing, applying, and user dashboard features.

### 3.1. Fetch Jobs
List jobs with optional filters. (Allowed: user, recruiter, admin)
- **URL**: `/api/v1/user/fetch-jobs`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "location": "string (optional)",
    "job_type": "string (optional)",
    "experience_level": "string (optional)",
    "min_salary": "number (optional)",
    "is_remote": "boolean (optional)",
    "skills": ["string"] (optional),
    "search": "string (optional)"
  }
  ```
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Jobs fetched successfully",
    "data": [ { "_id": "...", "jobTitle": "..." } ]
  }
  ```

### 3.2. Fetch Single Job
Get details of a specific job by ID.
- **URL**: `/api/v1/user/fetch-single-job/:id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Job fetched successfully",
    "data": { "_id": "...", "jobTitle": "...", "description": "..." }
  }
  ```

### 3.3. Apply for Job
Submit a job application for a given job. (Allowed: user)
- **URL**: `/api/v1/user/apply-job/:id`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body** (FormData):
  - `resume` or `file`: File
  - `portfolio_link`: "string (optional)"
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Resume_uploaded_successfully",
    "data": { "_id": "...", "jobId": "...", "userId": "..." }
  }
  ```

### 3.4. My Applications
List all applications submitted by the user.
- **URL**: `/api/v1/user/my-applications`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Job_applications_fetched_successfully",
    "data": [ { "_id": "...", "jobId": "...", "status": "..." } ]
  }
  ```

### 3.5. Resume Score
Get analysis metrics for the user's latest uploaded resume.
- **URL**: `/api/v1/user/resume-score`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Resume_score_fetched_successfully",
    "data": {
      "stats": {
        "atsScore": "number",
        "skillAlignment": "number",
        "experienceMatch": "number"
      },
      "resumeInsights": {
        "matchedSkills": ["..."],
        "missingSkills": ["..."],
        "strengths": ["..."],
        "weaknesses": ["..."],
        "suggestions": ["..."]
      }
    }
  }
  ```

### 3.6. Applied Jobs (Detailed)
Get detailed info about jobs the user has applied for.
- **URL**: `/api/v1/user/applied-jobs`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Applied_jobs_fetched_successfully",
    "data": [
      {
        "applicationId": "...",
        "jobId": "...",
        "companyName": "...",
        "jobTitle": "...",
        "location": "...",
        "employmentType": "...",
        "status": "...",
        "appliedAt": "...",
        "timeAgo": "..."
      }
    ]
  }
  ```

### 3.7. Application Status
Get high-level summary/counts of job applications.
- **URL**: `/api/v1/user/application-status`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Application_status_fetched_successfully",
    "data": {
      "totalApplications": "number",
      "appliedCount": "number",
      "acceptedCount": "number",
      "rejectedCount": "number",
      "totalResumes": "number"
    }
  }
  ```

### 3.8. User Dashboard
Aggregate data API combining user profile, resume score, applied jobs, and application status.
- **URL**: `/api/v1/user/dashboard`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response Pattern**:
  ```json
  {
    "code": 1,
    "message": "Dashboard_fetched_successfully",
    "data": {
      "userProfile": { "name": "...", "email": "...", "skills": ["..."], "jobRoles": ["..."] },
      "stats": { "atsScore": "...", "skillAlignment": "...", "experienceMatch": "..." },
      "resumeInsights": { "resumeId": "...", "fileName": "...", "uploadedAt": "..." },
      "appliedJobs": [ { "jobTitle": "...", "status": "..." } ],
      "summary": { "totalApplications": "...", "acceptedCount": "..." }
    }
  }
  ```
