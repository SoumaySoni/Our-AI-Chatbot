import io
from typing import Optional, List, Dict, Any
from fastapi import UploadFile

async def extract_text_from_file(file: UploadFile) -> str:
    """Extract plain text from an uploaded file."""
    filename = file.filename or ""
    content = await file.read()
    
    # Try decoding plain text / code / json / md files
    try:
        text = content.decode("utf-8")
        return f"--- File Content ({filename}) ---\n{text}\n--- End of File ---"
    except UnicodeDecodeError:
        try:
            text = content.decode("latin-1")
            return f"--- File Content ({filename}) ---\n{text}\n--- End of File ---"
        except Exception:
            return f"[Binary file uploaded: {filename} ({len(content)} bytes)]"

async def process_attached_files(files: List[UploadFile]) -> str:
    """Process multiple attached files and combine their text contents."""
    extracted_texts = []
    for file in files:
        extracted = await extract_text_from_file(file)
        extracted_texts.append(extracted)
    
    return "\n\n".join(extracted_texts)
