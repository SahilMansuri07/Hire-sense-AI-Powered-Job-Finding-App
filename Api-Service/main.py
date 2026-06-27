from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from pathlib import Path
from analyzer.function import router as function
from common.common import Configure_genai
 
# Load Api-Service/.env regardless of current working directory.
ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)
openrouter_key = os.getenv("OPENROUTER_API_KEY")
google_key = os.getenv("GOOGLE_API_KEY")

if not (openrouter_key or google_key):
    raise RuntimeError("No API key configured. Set OPENROUTER_API_KEY or GOOGLE_API_KEY in Api-Service/.env")

if google_key:
    try:
        Configure_genai(google_key)
    except Exception as e:
        print(f"Warning: Gemini configuration failed, OpenRouter fallback will still work: {e}")

app = FastAPI()

# Explicitly allow local frontend dev origins.
# allowed_origins = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173/*", 
#     "*"
# ]

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Backend is running!"}



app.include_router(function)
