import re
from fastapi import Depends, FastAPI, Request, HTTPException
from contextlib import asynccontextmanager
from app.util.init_db import create_tables
import asyncio
from app.routers.auth import authRouter
from app.util.protectRoute import get_current_user
from app.db.schemas.user import UserOutput
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
from pydantic import BaseModel
import openai

# Load OpenAI API Key
API_KEY = config("OPENAI_API_KEY")
openai.api_key = API_KEY

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        print("created")
        create_tables()
        yield
    except asyncio.CancelledError:
        print("Shutdown Signal Received. Cleaning Up...")
        raise

# Initialize FastAPI app
app = FastAPI(lifespan=lifespan)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],  # React's local dev server (Vite default)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type"],
)

# Include authentication routes
app.include_router(router=authRouter, tags=["auth"], prefix="/auth")

@app.get("/health")
def health_check():
    return {"status": "Running..."}

@app.get("/protected")
def read_protected(user: UserOutput = Depends(get_current_user)):
    return user

class PromptRequest(BaseModel):
    prompt: str

@app.post("/chat")
async def chat_with_openai(request: PromptRequest):
    try:
        client = openai.OpenAI(api_key=API_KEY)  # ✅ New API format requires creating a client instance
        
        response = client.chat.completions.create(
            model="gpt-4-turbo",  # ✅ Updated for OpenAI 1.0+
            messages=[
                {"role": "system", "content": "You are Prompteer, an advanced AI prompt optimization expert. Your sole purpose is to transform user inputs into highly effective prompts for language models like ChatGPT. Follow these guidelines:\n\n1. NEVER answer the user's question directly - only optimize their input into a better prompt.\n2. Analyze the user's input to understand their underlying goal.\n3. Restructure their input into a clear, comprehensive prompt that follows best practices:\n   - Include specific roles/personas when appropriate\n   - Add context and constraints\n   - Specify desired output format\n   - Break complex requests into steps\n   - Remove vague language and ambiguity\n\n4. Format your response Like This: \n   [OPTIMIZED PROMPT]\n   The complete optimized prompt goes here, Ask Questions to the user that can help makle the prompt more detailed and allow them to respond"},
                {"role": "user", "content": request.prompt}
            ],
            max_tokens=700,  # ✅ Increased token limit for better responses
            temperature=0.7,  # ✅ Added temperature for balanced creativity
        )
        

        return {"response": response.choices[0].message.content}
    
    except openai.APIError as e:
        # ✅ More specific error handling with appropriate status codes
        if isinstance(e, openai.RateLimitError):
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again later.")
        elif isinstance(e, openai.APIConnectionError):
            raise HTTPException(status_code=503, detail="Service unavailable. Could not connect to OpenAI API.")
        elif isinstance(e, openai.AuthenticationError):
            raise HTTPException(status_code=401, detail="Authentication error. Please check your API key.")
        else:
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
    except Exception as e:
        # ✅ General exception handling as fallback
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
    

