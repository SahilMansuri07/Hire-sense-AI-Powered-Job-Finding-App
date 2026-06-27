# Hire Sense - AI Powered Job Finding App & Resume Maker

Welcome to the **Hire Sense** project! This repository contains a full-stack AI-powered application designed to streamline the job finding process, help users create professional resumes, and leverage Artificial Intelligence for powerful text and document analysis.

## 🚀 Application Flow

The application consists of three main parts working harmoniously:

1. **Frontend**: The user-facing application built with React, offering a seamless and dynamic UI for interacting with resumes, job boards, and authentication flows.
2. **Backend (Node.js/Express)**: The core server handling user management, authentication, secure file uploads, data persistence, and acting as a bridge to the AI services.
3. **Api-Service (Python)**: A dedicated Python microservice handling AI-driven tasks, such as resume parsing, keyword extraction, and advanced text analytics.

### Data Flow
- **User Action**: The user interactively creates a resume or uploads one via the Frontend.
- **Backend Processing**: The Node.js backend handles secure routing, validates the user data, and persists information into MongoDB.
- **AI Analytics**: For AI operations, the Node.js server securely communicates with the Python Api-Service. The Python service processes the request (e.g., scoring a resume against a job description) and returns the insights.
- **Delivery**: The insights are fed back to the Frontend and displayed to the user via dynamic charts and responsive UI components.

## 🛠️ Technology Stack

### Frontend
- **React.js & Vite**: Lightning-fast build tool and frontend library.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Redux Toolkit**: Predictable state container for managing application state.
- **Radix UI & Material-UI**: Accessible, high-quality unstyled and styled components.
- **Framer Motion**: For rich animations and micro-interactions.

### Backend
- **Node.js & Express.js**: Fast, unopinionated web framework for building the core REST API.
- **MongoDB & Mongoose**: NoSQL database for flexible and scalable data persistence.
- **JSON Web Tokens (JWT) & Bcrypt**: Secure user authentication and robust password hashing.
- **Multer & Cloudinary**: For handling and storing user-uploaded files (like profile pictures and resume PDFs).
- **Swagger UI**: Comprehensive API documentation.

### AI / Python Api-Service
- **Python 3**: The industry standard language for machine learning and data science.
- **Advanced Text Processing**: Integrates various NLP pipelines and analyzer tools to parse and evaluate resume contents.

## 🔒 Security Best Practices
- Environment variables (`.env`) containing API keys and database credentials are fully ignored from version control to prevent leaks.
- Project-specific cryptography (`crypto-js`) and hashing algorithm client-side implementations are deliberately excluded from public exposure for security reasons.
- Authentication payloads are strictly validated, keeping routes safe from injection attacks.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB (Atlas or local)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SahilMansuri07/Hire-sense-AI-Powered-Job-Finding-App.git
   cd Hire-sense-AI-Powered-Job-Finding-App
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create a .env file from .env.example
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   # Create a .env file from .env.example
   npm run dev
   ```

4. **Setup Python Api-Service:**
   ```bash
   cd Api-Service
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   pip install -r requirements.txt
   # Start the python server
   python main.py
   ```

## 🤝 Contributing
Feel free to fork this project, create a feature branch, and submit a pull request!
