import os
import requests
from dotenv import load_dotenv
from langchain_core.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun
from rag import vector_store

load_dotenv()

web_search_tool = DuckDuckGoSearchRun()

@tool
def get_job_recommendation(what: str, location: str = "India", salary_min: int = 0) -> dict:
    """
    Searches live job listings from Adzuna by keyword, location, and optional minimum salary.
    """
    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("ADZUNA_API_KEY")

    if not app_id or not app_key:
        return {"error": "Missing ADZUNA_APP_ID or ADZUNA_API_KEY in .env"}

    url = f"https://api.adzuna.com/v1/api/jobs/in/search/1?app_id={app_id}&app_key={app_key}&what={what}"

    if location and location.lower() != "remote":
        url += f"&where={location}"

    if salary_min and salary_min > 0:
        url += f"&salary_min={salary_min}"

    try:
        response = requests.get(url, timeout=10)
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@tool
def get_resume_data(query: str) -> list:
    """
    Retrieves matching semantic chunks from the candidate document or resume in ChromaDB.
    """
    try:
        return vector_store.similarity_search(query, k=3)
    except Exception as e:
        return [f"Error searching vector store: {str(e)}"]

def execute_deep_research(topic: str) -> dict:
    """
    Orchestrates multi-query DuckDuckGo live search with local ChromaDB vectors.
    """
    search_queries = [
        f"{topic} state of the art architecture overview",
        f"{topic} technical benchmarks advantages limitations"
    ]
    aggregated_web_info = []
    for q in search_queries:
        try:
            res = web_search_tool.invoke(q)
            if res:
                aggregated_web_info.append(res)
        except Exception:
            pass

    combined_web_context = "\n\n".join(aggregated_web_info) if aggregated_web_info else "No external web data retrieved."

    local_context_snippets = []
    try:
        docs = vector_store.similarity_search(topic, k=2)
        for d in docs:
            local_context_snippets.append(d.page_content)
    except Exception:
        pass

    combined_local_context = "\n".join(local_context_snippets) if local_context_snippets else "No local document matches."

    full_context = f"=== WEB INTELLIGENCE ===\n{combined_web_context}\n\n=== LOCAL KNOWLEDGE BASE ===\n{combined_local_context}"

    return {
        "context": full_context,
        "web_snippets": aggregated_web_info,
        "local_snippets": local_context_snippets
    }

tools = [web_search_tool, get_job_recommendation, get_resume_data]