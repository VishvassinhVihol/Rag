# Reciprocal rank fusion: 
#steps : 
#1. Generate multiple queries based on the user query.
#2. Retrieve relevant documents for each query.
#3. Merge documents intelligently based on their ranks (using the RRF formula).
#4. Select top-scoring documents for context or generation.

import os
import json
from dotenv import load_dotenv
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_qdrant import QdrantVectorStore
from groq import Groq
from collections import defaultdict

from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil

app = FastAPI()

# CORS so React can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in prod, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from openai import OpenAI

load_dotenv()
client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

# client = Groq(
#     api_key=os.getenv("GROQ_API_KEY")
# )

def generate_relevant_documents(queries,k=60):
    print(f"Generating relevant documents for queries: {queries}")

    document_scores = defaultdict(float) 
    doc_rank_map = {} 

    for query in queries:
        relevant_chunks = retriver.similarity_search(query = query,k=10)

        for rank,chunk in enumerate(relevant_chunks):
            doc = chunk.page_content.strip()
            score = 1 /(k+rank+1)
            document_scores[doc] += score 

            if doc not in doc_rank_map:
                doc_rank_map[doc] = chunk #page_content => chunk


    ranked_documents = sorted(document_scores.items(),key=lambda x: x[1], reverse=True) 

    top_documents = [doc_rank_map[doc] for doc, _ in ranked_documents[:5]] 
    return top_documents

@app.post('/ask')
async def ask(file:UploadFile,question:str=Form(...)):
    
    pdf_path = Path('uploaded.pdf')
    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    loader = PyPDFLoader(str(pdf_path))
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splitted_docs = text_splitter.split_documents(documents=docs)

    print(splitted_docs)

    embedder = OllamaEmbeddings(model = "nomic-embed-text")

    global vector_store,retriver
    vector_store = QdrantVectorStore.from_documents(
        documents=splitted_docs,
        collection_name = "Reciprocal Rank Fuison",
        url="http://localhost:6333",
        embedding=embedder
    )

    retriver = QdrantVectorStore.from_existing_collection(
        url="http://localhost:6333",
        embedding=embedder,
        collection_name = "Reciprocal Rank Fuison",
    )

    user_query = question
    system_prompt = """
        You are a query rewriter. 

        Your task:
        - Take the user’s query and generate 3–5 alternative queries that capture different ways the question might be asked.
        - These queries will be used to retrieve documents from a database.

        Rules:
        1. ONLY return a valid JSON array of strings.
        2. Do not include explanations, comments, or extra text.
        3. Ensure the queries are semantically diverse but still relevant to the original question.
        4. If you cannot generate queries, return an empty array: []

        Example:
        Input: "What are the steps for parallel query retrieval in RAG?"
        Output: ["steps of parallel query retrieval in RAG", 
                "how to perform parallel query retrieval in rag", 
                "rag parallel query process", 
                "rag query retrieval techniques"]
    """


    messages = [{"role":"system","content": system_prompt}]
    messages.append({"role":"user","content":user_query})

    response = client.chat.completions.create(
        model="gemini-2.5-flash",
        messages=messages
    )


    queries_text = response.choices[0].message.content.strip()

    try:
        queries = json.loads(queries_text)
    except json.JSONDecodeError:
        print("Failed to parse JSON:", queries_text)
        # fallback: treat the whole text as one query
        queries = [queries_text] if queries_text else []

    relavent_documents = generate_relevant_documents(queries)

    # final anwer generation
    context = "\n\n".join([doc.page_content for doc in relavent_documents]) 

    
    final_prompt = f"""
    You are a helpful assistant.

    Based on the context below, answer the user query.
    don't bind to anything outof context.

    Context:
    {context}

    Question:
    {user_query}
"""
    
    final_response = client.chat.completions.create(
        model="gemini-2.5-flash",
        messages=[{"role": "user", "content": final_prompt}]
    )

    return {"answer": final_response.choices[0].message.content}
