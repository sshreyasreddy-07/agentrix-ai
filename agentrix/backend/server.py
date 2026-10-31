import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from llm import create_ai_mentor_chain, create_research_agent_chain
from rag import ingest_data, rag_chain, summarize_pdf
from shared_tools import get_job_recommendation, execute_deep_research

app = FastAPI(title="Agentrix AI Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str

class ResearchRequest(BaseModel):
    topic: str

class JobSearchRequest(BaseModel):
    what: str
    location: str = "India"
    salary_min: int = 0

class SummaryRequest(BaseModel):
    mode: str = "exam_3_points"

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
LATEST_PDF_PATH = "./resume.pdf"

@app.get("/")
def root():
    return {"status": "ok", "message": "Agentrix AI Backend running on port 8001"}

@app.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global LATEST_PDF_PATH
    save_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    LATEST_PDF_PATH = save_path
    
    chunks_count = ingest_data(save_path)
    return {"message": "Document ingested successfully", "filename": file.filename, "chunks": chunks_count}

@app.post("/api/summarize")
def get_summary(req: SummaryRequest):
    if not os.path.exists(LATEST_PDF_PATH):
        raise HTTPException(status_code=400, detail="No document found. Please upload a PDF first.")
    res = summarize_pdf(LATEST_PDF_PATH, summary_type=req.mode)
    return {"summary": res.get("output_text", "")}

@app.post("/api/rag")
def query_rag(req: ChatRequest):
    res = rag_chain(req.query)
    sources = [doc.page_content for doc in res.get("source_documents", [])]
    return {"answer": res.get("result", ""), "sources": sources}

@app.post("/api/mentor")
def ask_mentor(req: ChatRequest):
    chain = create_ai_mentor_chain()
    resp = chain.invoke({"question": req.query})
    return {"reply": resp.content}

@app.post("/api/research")
def conduct_research(req: ResearchRequest):
    gathered = execute_deep_research(req.topic)
    chain = create_research_agent_chain()
    report = chain.invoke({
        "topic": req.topic,
        "context": gathered["context"]
    })
    return {
        "topic": req.topic,
        "report": report.content,
        "web_sources_count": len(gathered["web_snippets"]),
        "local_sources_count": len(gathered["local_snippets"])
    }

@app.post("/api/jobs")
def search_jobs(req: JobSearchRequest):
    data = get_job_recommendation.invoke({
        "what": req.what,
        "location": req.location,
        "salary_min": req.salary_min
    })
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8001, reload=True)
