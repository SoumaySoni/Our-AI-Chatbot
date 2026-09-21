import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 8001
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: List[str] = ["*"]
    
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    
    DEFAULT_LLM_PROVIDER: str = "gemini"
    DEFAULT_MODEL_NAME: str = "gemini-2.5-flash"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
