<img width="1920" height="1080" alt="Screenshot (427)" src="https://github.com/user-attachments/assets/e4c6ea20-1e5c-415f-9a62-616480a2d949" />

<img width="1920" height="1080" alt="Screenshot (428)" src="https://github.com/user-attachments/assets/40a38625-e586-4c2e-8709-04cab2e0629f" />

<img width="1920" height="1080" alt="Screenshot (429)" src="https://github.com/user-attachments/assets/2551eec5-6512-4cba-948c-a471d4045d5a" />


# 📄 RAG-Based PDF Q&A App

This is a simple **Retrieval-Augmented Generation (RAG)** project that implements:

- **Fan-out Query Translation**: Expands user queries into multiple semantically diverse variations using an LLM.
- **Reciprocal Rank Fusion (RRF)**: Ranks and merges relevant document chunks based on multiple query results.

## 🚀 Features

- Upload a PDF and ask questions about its content
- Fan-out query generation using Gemini (via OpenAI client)
- Document chunking and vector storage using LangChain and Qdrant
- Contextual answer generation using top-ranked chunks

## 🛠️ Tech Stack

- **Backend**: Python,Fastapi
- **Frontend**: React + Tailwind CSS
- **Embeddings**: Ollama with `nomic-embed-text`
- **Vector Store**: Qdrant
- **LLM API**: Gemini via OpenAI-compatible client
- **Document Loader**: LangChain Community (PDF Loader & Text Splitter)
- **Dokcer**

## 🧪 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/VishvassinhVihol/Rag.git
   
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # On PowerShell
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

## 🧠 How it Works

1. User uploads a PDF and submits a query.
2. The system generates alternative queries (fan-out).
3. Retrieves document chunks using Qdrant and ranks them with RRF.
4. Sends the best context and question to the LLM.
5. Returns an accurate, context-based answer.

## 📌 Notes

- Ensure Qdrant is running locally on port `6333`
- Replace `.env` values with your actual API keys (e.g., GEMINI_API_KEY)
- Make sure you have installed docker for running vector database

