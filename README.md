# 🤖 Full-Stack AI Chatbot

A state-of-the-art, real-time AI Chatbot web application built with **Next.js 16 (React 19)** on the frontend and **FastAPI + LangChain** on the backend. Supports **real-time token streaming (SSE)**, **document upload context parsing**, **Deep Thought analysis mode**, and multi-provider LLM integration (**Google Gemini** & **OpenAI**).

---

## ✨ Features

- **⚡ Real-Time Streaming**: Token-by-token streaming using Server-Sent Events (SSE) for zero-latency user responses.
- **📄 Document & File Context**: Upload files (`.pdf`, `.doc`, `.docx`, `.txt`, `.csv`, images) to include extracted context directly into LLM reasoning.
- **🧠 Deep Thought Mode**: Toggleable reasoning step that encourages step-by-step analytical reasoning before returning the final response.
- **🔌 Multi-LLM Provider Support**: Easily switch between **Google Gemini** (`gemini-2.5-flash`) and **OpenAI** (`gpt-4o-mini`) via environment configuration.
- **🎨 Premium Dark UI**: Modern UI powered by Next.js 16, TailwindCSS v4, smooth animations, and Lucide icons.
- **🌐 Production-Ready CORS & Deployment Config**: Pre-configured for seamless deployment on **Vercel** (Frontend) and **Render / Railway** (Backend).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: React 19, [TailwindCSS v4](https://tailwindcss.com/), Lucide React Icons
- **Language**: TypeScript

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **ASGI Server**: Uvicorn
- **AI Orchestration**: [LangChain](https://www.langchain.com/) (`langchain-google-genai`, `langchain-openai`)
- **Data Validation**: Pydantic v2 & `pydantic-settings`
- **Language**: Python 3.10+

---

## 📂 Project Structure

```text
Our AI Chatbot/
├── backend/
│   ├── main.py              # FastAPI application entry point & CORS configuration
│   ├── config.py            # Pydantic Settings & environment variable handler
│   ├── Procfile             # Production deployment start command (Render/Railway)
│   ├── requirements.txt     # Python package dependencies
│   ├── routers/
│   │   └── chat.py          # API Endpoints (/api/chat, /api/chat/stream, /api/upload)
│   └── services/
│       ├── llm.py           # LangChain model instantiation & streaming logic
│       └── file_processor.py# PDF & text file parsing logic
└── frontend/
    ├── app/
    │   ├── page.tsx         # Main chat interface component
    │   ├── layout.tsx       # Root layout & theme configuration
    │   └── globals.css      # Custom styles & Tailwind CSS setup
    ├── components/          # Reusable UI components (Header, MessageList, FileChips, etc.)
    ├── types/               # TypeScript interfaces & type definitions
    └── package.json         # Frontend scripts & dependencies
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher
- **Python**: `v3.10` or higher
- **npm** or **yarn**

---

### 1. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file inside the `backend/` directory:
   ```env
   # Server Configuration
   PORT=8001
   HOST=0.0.0.0
   CORS_ORIGINS=["http://localhost:3001","http://127.0.0.1:3001","http://localhost:3000"]

   # API Keys (Provide at least one)
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here

   # Default LLM Provider ('gemini' or 'openai')
   DEFAULT_LLM_PROVIDER=gemini
   DEFAULT_MODEL_NAME=gemini-2.5-flash
   ```

5. **Start the Backend Server**:
   ```bash
   python main.py
   ```
   The backend API will run locally at **`http://localhost:8001`**. You can view the interactive Swagger documentation at `http://localhost:8001/docs`.

---

### 2. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **(Optional) Configure Environment Variables**:
   If you want your local frontend to point to a custom or deployed backend URL, create a `.env.local` file inside the `frontend/` directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
   ```
   *(If omitted, it defaults automatically to `http://localhost:8001`)*.

4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   The frontend application will be running at **`http://localhost:3001`**.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/chat/stream` | Server-Sent Events (SSE) token-by-token streaming chat response. |
| `POST` | `/api/chat` | Non-streaming JSON chat response. |
| `POST` | `/api/upload` | Upload document/file attachments and extract text context. |
| `GET` | `/health` | Health check endpoint returning server status. |
| `GET` | `/` | API status and link to `/docs`. |

### Example Streaming Payload (`POST /api/chat/stream`):
```json
{
  "query": "Explain quantum computing in simple terms",
  "file_context": "Optional extracted document text...",
  "history": [
    { "role": "user", "text": "Hello" },
    { "role": "assistant", "text": "Hi! How can I help you today?" }
  ],
  "think_mode": false,
  "provider": "gemini",
  "model_name": "gemini-2.5-flash"
}
```

---

## 🌐 Production Deployment Guide

### Deploying Backend (e.g. Render)
1. Push your code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com/).
3. Set the **Root Directory** to `backend`.
4. Set **Build Command**: `pip install -r requirements.txt`.
5. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
6. Add your environment variables (`OPENAI_API_KEY`, `GEMINI_API_KEY`, `DEFAULT_LLM_PROVIDER`) under Service Settings.

### Deploying Frontend (Vercel)
1. Import your project repository into [Vercel](https://vercel.com/).
2. Set the **Root Directory** to `frontend`.
3. Add Environment Variable:
   - **Key**: `NEXT_PUBLIC_BACKEND_URL`
   - **Value**: `https://your-backend-service.onrender.com`
4. Deploy!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to fork the repository and submit a pull request.

---

## 📝 License

This project is open-source under the [MIT License](LICENSE).
