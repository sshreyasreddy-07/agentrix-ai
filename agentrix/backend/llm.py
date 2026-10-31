import os
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "qwen3:0.6b"

def create_llm(temperature: float = 0.2):
    """Factory function to initialize local ChatOllama instance."""
    return ChatOllama(
        model=MODEL_NAME,
        temperature=temperature,
        num_predict=1024,
    )

def create_ai_mentor_chain():
    """AI Mentor Persona with structured, pedagogical guidance."""
    llm = create_llm(temperature=0.3)
    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            "You are Agentrix AI Mentor — an empathetic, sharp academic and career guide. "
            "Help students bridge classroom theory with exam mastery and technical interviews. "
            "Give clear, structured, and actionable guidance without unnecessary fluff."
        ),
        ("human", "{question}")
    ])
    return prompt | llm

def create_research_agent_chain():
    """Deep Academic & Technical Research Agent synthesizing live web data with grounded analysis."""
    llm = create_llm(temperature=0.2)
    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            "You are the Agentrix AI Research Agent — an academic research and technical intelligence assistant. "
            "Your objective is to provide comprehensive, citation-rich research synthesis. "
            "Structure your research report using the following standard template:\n"
            "1. 🎯 Executive Overview & State-of-the-Art\n"
            "2. 🔬 Theoretical Foundations & Architecture / Core Mechanisms\n"
            "3. ⚡ Comparative Analysis & Trade-offs (Pros, Cons, Benchmarks)\n"
            "4. 💼 Industry & Practical Applications\n"
            "5. 📚 Key Research Takeaways & Future Directions\n\n"
            "Ground your synthesis in the provided context and live information."
        ),
        ("human", "Research Topic / Question: {topic}\n\nLive Research Context:\n{context}")
    ])
    return prompt | llm
