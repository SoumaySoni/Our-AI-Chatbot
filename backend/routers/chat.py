import json
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from services.llm import stream_chat_response, build_messages, get_llm
from services.file_processor import process_attached_files

router = APIRouter(prefix="/api", tags=["chat"])

class ChatRequest(BaseModel):
    query: str
    file_context: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = None
    think_mode: bool = False
    provider: Optional[str] = None
    model_name: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    think_mode: bool

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Non-streaming chat endpoint."""
    llm = get_llm(request.provider, request.model_name)
    if llm is not None:
        messages = build_messages(
            query=request.query,
            file_context=request.file_context,
            history=request.history,
            think_mode=request.think_mode
        )
        try:
            res = await llm.ainvoke(messages)
            return ChatResponse(response=res.content, think_mode=request.think_mode)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    # Fallback if no API key is provided
    return ChatResponse(
        response=f"Received: '{request.query}'. Please configure your API key in backend/.env for AI responses.",
        think_mode=request.think_mode
    )

@router.post("/chat/stream")
async def chat_stream_endpoint(request: ChatRequest):
    """Server-Sent Events (SSE) token streaming chat endpoint."""
    return StreamingResponse(
        stream_chat_response(
            query=request.query,
            file_context=request.file_context,
            history=request.history,
            think_mode=request.think_mode,
            provider=request.provider,
            model_name=request.model_name
        ),
        media_type="text/event-stream"
    )

@router.post("/upload")
async def upload_files_endpoint(files: List[UploadFile] = File(...)):
    """Upload documents/files and extract text content."""
    try:
        file_context = await process_attached_files(files)
        return {"success": True, "file_context": file_context, "file_count": len(files)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process uploaded files: {str(e)}")
