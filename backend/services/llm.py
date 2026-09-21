import os
import asyncio
import json
from typing import AsyncGenerator, List, Dict, Any, Optional
from config import settings

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

def get_llm(provider: Optional[str] = None, model_name: Optional[str] = None):
    """Instantiate and return the appropriate LangChain Chat Model."""
    provider = (provider or settings.DEFAULT_LLM_PROVIDER).lower()
    
    if provider == "gemini" and settings.GEMINI_API_KEY:
        from langchain_google_genai import ChatGoogleGenerativeAI
        m_name = model_name or "gemini-2.5-flash"
        return ChatGoogleGenerativeAI(
            model=m_name,
            google_api_key=settings.GEMINI_API_KEY,
            streaming=True,
            temperature=0.7,
        )
    elif provider == "openai" and settings.OPENAI_API_KEY:
        from langchain_openai import ChatOpenAI
        m_name = model_name or "gpt-4o-mini"
        return ChatOpenAI(
            model=m_name,
            api_key=settings.OPENAI_API_KEY,
            streaming=True,
            temperature=0.7,
        )
    
    # Fallback to Gemini if key exists without explicit provider
    if settings.GEMINI_API_KEY:
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=settings.GEMINI_API_KEY,
            streaming=True,
            temperature=0.7,
        )
    elif settings.OPENAI_API_KEY:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model="gpt-4o-mini",
            api_key=settings.OPENAI_API_KEY,
            streaming=True,
            temperature=0.7,
        )

    # If no API key is configured, return None (will trigger simulated intelligent streaming)
    return None

def build_messages(
    query: str,
    file_context: Optional[str] = None,
    history: Optional[List[Dict[str, str]]] = None,
    think_mode: bool = False
) -> List[BaseMessage]:
    """Construct prompt messages for LangChain."""
    system_instruction = (
        "You are a helpful, highly capable, and friendly AI Assistant. "
        "Provide detailed, accurate, and markdown-formatted answers."
    )
    if think_mode:
        system_instruction += (
            "\n\nTHINK MODE IS ACTIVE:\n"
            "First, perform step-by-step reasoning enclosed in a '**Deep Thought Analysis:**' section. "
            "Examine the user's intent, cross-reference concepts, and structure your thought process. "
            "Then, present your final response clearly."
        )

    messages: List[BaseMessage] = [SystemMessage(content=system_instruction)]

    # Add historical messages if provided
    if history:
        for msg in history:
            role = msg.get("role", "user")
            text = msg.get("text", "")
            if role == "user":
                messages.append(HumanMessage(content=text))
            elif role == "assistant":
                messages.append(AIMessage(content=text))

    # Combine query with file context if available
    full_user_content = query
    if file_context:
        full_user_content = f"{file_context}\n\nUser Question:\n{query}"

    messages.append(HumanMessage(content=full_user_content))
    return messages

async def stream_chat_response(
    query: str,
    file_context: Optional[str] = None,
    history: Optional[List[Dict[str, str]]] = None,
    think_mode: bool = False,
    provider: Optional[str] = None,
    model_name: Optional[str] = None
) -> AsyncGenerator[str, None]:
    """Yield SSE data events containing token chunks for streaming responses."""
    llm = get_llm(provider, model_name)

    if llm is not None:
        messages = build_messages(query, file_context, history, think_mode)
        try:
            async for chunk in llm.astream(messages):
                token = chunk.content
                if token:
                    data = json.dumps({"token": token, "done": False})
                    yield f"data: {data}\n\n"
            
            # Send completion signal
            done_data = json.dumps({"token": "", "done": True})
            yield f"data: {done_data}\n\n"
            return
        except Exception as e:
            err_data = json.dumps({"token": f"\n\n[Error generating response: {str(e)}]", "done": True})
            yield f"data: {err_data}\n\n"
            return

    # Fallback simulated response if no API Key is set in .env yet
    response_text = ""
    if file_context:
        response_text = (
            f"I have received your document context.\n\n"
            f"Here is my analysis based on **\"{query}\"**:\n"
            f"The uploaded contents have been parsed successfully. "
            f"*(Note: Add your `GEMINI_API_KEY` or `OPENAI_API_KEY` in `backend/.env` to connect live LLM models)*"
        )
    elif think_mode:
        response_text = (
            f"**Deep Thought Analysis:**\n"
            f"1. Examining query: \"{query}\"\n"
            f"2. Evaluation step: Identifying user requirements and constraints.\n"
            f"3. Synthesizing response pipeline.\n\n"
            f"Here is the detailed response for **{query}** with deep thinking mode active.\n"
            f"*(Connect your `GEMINI_API_KEY` or `OPENAI_API_KEY` in `backend/.env` for real-time AI capabilities)*"
        )
    else:
        response_text = (
            f"Here is what I found regarding **\"{query}\"**.\n\n"
            f"Backend system is live! *(To use real LLMs, add `GEMINI_API_KEY` or `OPENAI_API_KEY` to `backend/.env`)*"
        )

    # Stream fallback text word by word
    words = response_text.split(" ")
    for i, word in enumerate(words):
        chunk_text = word + (" " if i < len(words) - 1 else "")
        data = json.dumps({"token": chunk_text, "done": False})
        yield f"data: {data}\n\n"
        await asyncio.sleep(0.04)

    done_data = json.dumps({"token": "", "done": True})
    yield f"data: {done_data}\n\n"
