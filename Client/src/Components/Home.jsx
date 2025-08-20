import React, { useContext, useState } from "react";
import FileUpload from "./FileUpload";
import { AppContext } from "../Context/AppContext";

const Home = () => {
  const { IsProcessed, uploadedFile,question, setIsquestion,answer, setAnswer } = useContext(AppContext);



  const handleSubmit = async (e) => {
    setAnswer('')
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("question", question);

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setAnswer(data.answer);
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className=" p-10 flex justify-center items-center min-h-screen px-4 h-full">
      <div className="flex flex-col gap-6 w-full max-w-3xl">

        <h1 className="text-3xl font-bold text-center text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]">
           RAG Document Q&A System
        </h1>

   
        <p className="text-gray-300 text-center leading-relaxed">
          Upload a document (<strong>PDF</strong>) and ask
          questions about its content. Queries are automatically corrected for
          grammar and spelling. <p className="font-medium text-xl">Please Wait for few Seconds for Answer</p>
        </p>


        <div className="rounded-xl border border-cyan-400 p-4 bg-gray-900/40 shadow-md">
          <FileUpload />
        </div>

 
        {IsProcessed && (
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-center font-medium shadow-md">
            ✅ Document processed successfully! Ready for your questions.
          </div>
        )}

    
        {IsProcessed && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <label className="text-gray-200 font-medium">
              Ask a question about your document:
            </label>
            <input
              value={question}
              onChange={(e) => setIsquestion(e.target.value)}
              className="border border-cyan-400 w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              type="text"
              placeholder="e.g., What is the main topic?"
            />
            <button
              type="submit"
              className="bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition font-semibold shadow-lg cursor-pointer"
            >
              Ask
            </button>
          </form>
        )}

       

        {/* Answer */}
        {answer && (
          <div className="mt-4 p-4 rounded-xl bg-gray-900 border border-cyan-500 shadow-lg">
            <h2 className="text-xl font-bold text-cyan-400 mb-2">Answer:</h2>
            <p className="text-gray-200">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
