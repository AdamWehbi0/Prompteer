from fastapi import Depends, FastAPI, Request
from contextlib import asynccontextmanager
from app.util.init_db import create_tables
import asyncio
from app.routers.auth import authRouter
from app.util.protectRoute import get_current_user
from app.db.schemas.user import UserOutput
from fastapi.middleware.cors import CORSMiddleware




@asynccontextmanager
async def lifespan(app: FastAPI):
    #initalize DB at Start
    try:
        print("created")
        create_tables()
        yield
    except asyncio.CancelledError:
        print("Shutdown Signal Recieved. Cleaning Up...")
        raise
    
app = FastAPI(lifespan=lifespan)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],  # React's local dev server (Vite default)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["Authorization", "Content-Type"],  # Allow JWT tokens in headers

)


app.include_router(router=authRouter,tags=["auth"],prefix="/auth")

@app.get("/health")
def health_check():
    return{"staus":"Running..."}

@app.get("/protected")
def read_protected(user: UserOutput = Depends(get_current_user)):
    return {"message": f"Welcome {user.first_name} {user.last_name}!"}



