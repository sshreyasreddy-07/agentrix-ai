import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_classic.chains import RetrievalQA
from langchain_classic.chains.summarize import load_summarize_chain
from langchain_core.prompts import PromptTemplate
from llm import create_llm

load_dotenv()

PERSIST_DIR = "./vector_db"
COLLECTION_NAME = "agentrix_collection"

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_store = Chroma(
    embedding_function=embeddings,
    collection_name=COLLECTION_NAME,
    persist_directory=PERSIST_DIR
)

def process_pdf(file_path: str = "./resume.pdf"):
    loader = PyPDFLoader(file_path)
    document = loader.load()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=150
    )
    return splitter.split_documents(document)

def ingest_data(file_path: str = "./resume.pdf"):
    chunks = process_pdf(file_path)
    vector_store.add_documents(chunks)
    return len(chunks)

def rag_chain(query: str):
    llm = create_llm()
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        return_source_documents=True
    )
    return chain.invoke({"query": query})

def summarize_pdf(file_path: str, summary_type: str = "exam_3_points"):
    llm = create_llm(temperature=0.1)
    loader = PyPDFLoader(file_path)
    docs = loader.load()

    if summary_type == "exam_3_points":
        template = """You are an academic exam distillation engine. Read the document context:
{text}

Extract and output EXACTLY THREE (3) key revision points for an examination.
Format each point strictly as:
Point 1: [Core Concept Title] - [Clear explanation in simple English] - Key Cue: [Formula/Keywords]
Point 2: [Core Concept Title] - [Clear explanation in simple English] - Key Cue: [Formula/Keywords]
Point 3: [Core Concept Title] - [Clear explanation in simple English] - Key Cue: [Formula/Keywords]

Do not add greetings, disclaimers, or extra closing text.
"""
    else:
        template = """Summarize the core takeaways, methodology, and skills demonstrated in the following document:
{text}
Provide a crisp, bulleted academic and career-focused executive summary.
"""

    prompt = PromptTemplate(template=template, input_variables=["text"])
    chain = load_summarize_chain(
        llm=llm,
        chain_type="stuff",
        prompt=prompt
    )
    return chain.invoke({"input_documents": docs})
