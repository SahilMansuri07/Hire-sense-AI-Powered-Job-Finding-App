# HireSense - AI-Powered Job Finding & Applicant Tracking Platform

Welcome to **HireSense**! This repository contains a comprehensive full-stack platform designed to revolutionize the hiring ecosystem. It serves as both an intelligent job search portal for candidates and a powerful Applicant Tracking System (ATS) for recruiters, driven by Artificial Intelligence.

## 🚀 Core Application Flow

HireSense is split into two primary experiences, seamlessly connected by a unified backend and AI analytics engine:

### 🧑‍💻 For Candidates
1. **Intelligent Onboarding**: Candidates create profiles and specify their preferences (Role, Experience, Skills).
2. **AI Resume Parsing & Matching**: Candidates upload their existing resumes. The AI engine parses the document, scores it against industry standards, and extracts key skills.
3. **Smart Job Search**: Candidates browse job listings dynamically matched to their profile, complete with AI-generated match percentages.
4. **Application Tracking**: Candidates can apply with one click and track their application progress (Pending, Shortlisted, Rejected) through a dynamic, real-time timeline.
5. **Interview & Skill Analysis**: Candidates can prepare for interviews with AI-driven gap analysis and live mock technical/HR interviews.

### 🏢 For Recruiters
1. **AI Job Posting**: Recruiters can instantly generate high-quality, structured job descriptions using AI by providing minimal inputs.
2. **Talent Pipeline Management**: A Kanban-style or list-based dashboard allows recruiters to manage their open jobs and review all applicants.
3. **Automated ATS Scoring**: Every candidate application is automatically analyzed and scored against the job description (Keyword Matching, Missing Skills, Match Percentage).
4. **Application Processing**: Recruiters can update candidate statuses (e.g., Shortlist or Reject), triggering real-time updates and automated email notifications to the candidates.

## 🏗️ System Architecture

The platform operates through a robust three-tier architecture:

1. **Frontend (React.js)**: A dynamic, dark-themed, highly responsive UI built with Vite, Tailwind CSS, and Redux Toolkit. It features rich dashboards and intuitive data visualizations for both user types.
2. **Backend (Node.js/Express.js)**: The core RESTful API server. It manages secure JWT authentication, data validation, database interactions, role-based access control, and SMTP email services.
3. **AI Service (Python/FastAPI)**: A dedicated microservice dedicated to NLP and machine learning tasks. It handles PDF text extraction, resume parsing, ATS scoring algorithms, and job description generation.

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Redux Toolkit, Lucide React (Icons), Date-fns.
- **Backend**: Node.js, Express.js, MongoDB & Mongoose, JWT, Bcrypt, Nodemailer.
- **AI Microservice**: Python 3, FastAPI, Uvicorn, NLP parsing libraries.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB (Atlas or local instance)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SahilMansuri07/Hire-sense-AI-Powered-Job-Finding-App.git
   cd Hire-sense-AI-Powered-Job-Finding-App
   ```

2. **Setup Node.js Backend:**
   ```bash
   cd backend
   npm install
   # Ensure your .env file is configured (PORT, MONGO_URI, JWT_SECRET, SMTP credentials, etc.)
   npm run dev
   ```

3. **Setup React Frontend:**
   ```bash
   cd frontend
   npm install
   # Ensure your .env file is configured (VITE_API_URL)
   npm run dev
   ```

4. **Setup Python AI Service:**
   ```bash
   cd Api-Service
   python -m venv .venv
   
   # Activate virtual environment (Windows):
   .venv\Scripts\activate
   # Or on Mac/Linux: source .venv/bin/activate
   
   pip install -r requirements.txt
   # Ensure .env is configured (PYTHON_INTERNAL_SERVICE_KEY)
   python -m uvicorn main:app --reload
   ```

## 🔒 Security & Best Practices
- **Role-Based Routing**: The frontend and backend strictly enforce role boundaries (Candidate vs. Recruiter) ensuring data privacy.
- **Environment Secrets**: All sensitive API keys, database URIs, and service tokens are securely managed via `.env` files and excluded from version control.
- **Request Validation**: Backend routes are strictly validated using Joi schemas to prevent malformed data and injection attacks.

## 🤝 Contributing
Feel free to fork this project, create a feature branch, and submit a pull request!
