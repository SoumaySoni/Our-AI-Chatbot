import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers.chat import router as chat_router

app = FastAPI(
    title="AI Chatbot Backend",
    description="FastAPI + LangChain Backend for AI Chatbot",
    version="1.0.0"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(chat_router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "AI Chatbot Backend API is running.",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
