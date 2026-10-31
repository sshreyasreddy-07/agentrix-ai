# ⚡ Agentrix AI — Multi-Agent Intelligence Platform

Autonomous academic & career platform featuring 5 specialized AI agents + modern dashboard interface.

---

### 📁 Architecture
```text
agentrix/
├── backend/
│   ├── llm.py               # Local Ollama LLM setup & mentor/research chains
│   ├── rag.py               # ChromaDB document store & 3-point distillation
│   ├── shared_tools.py      # Adzuna job search, DuckDuckGo search, research pipeline
│   ├── server.py            # FastAPI REST API (port 8001)
│   ├── requirements.txt     # Backend python dependencies
│   └── .env.example         # Adzuna API key template
└── frontend/
    ├── package.json         # React 18, Vite, Tailwind CSS, Lucide icons
    ├── vite.config.js       # Vite config (port 5173)
    ├── tailwind.config.js   # Tailored modern dashboard palette
    ├── src/
    │   ├── App.jsx          # Pixel-accurate modern dashboard layout
    │   └── components/
    │       ├── FocusTimer.jsx    # Pomodoro sprint timer with progress bar
    │       ├── SmartExamNotes.jsx# 3-point revision extractor
    │       ├── ResearchAgent.jsx # Autonomous web + vector synthesis agent
    │       ├── DocumentRag.jsx   # ChromaDB semantic Q&A chat
    │       ├── JobFinder.jsx     # Live Adzuna job search cards
    │       └── AiMentor.jsx      # AI Viva & technical interview mentor
```

---

### 🚀 Running the Project

#### 1. Backend (FastAPI - Port 8001)
```bash
cd agentrix/backend
pip install -r requirements.txt
python server.py
```
*API documentation available at `http://127.0.0.1:8001/docs`*

#### 2. Frontend (React + Vite)
```bash
cd agentrix/frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*
