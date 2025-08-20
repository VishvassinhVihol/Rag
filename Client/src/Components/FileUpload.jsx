import { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AppContext } from "../Context/AppContext";

export default function FileUpload() {

    const {setIsProcessed,uploadedFile, setUploadedFile, setIsquestion, setAnswer} = useContext(AppContext)

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploadedFile(file); // save uploaded file in state
        setIsProcessed(true)

        console.log("Uploaded file:", file);

        // 🚀 You can now send the file to FastAPI backend here
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],

        },
        maxSize: 200 * 1024 * 1024, // 200MB
    });
    const removeFile = () => {
        setUploadedFile(null);
        setIsProcessed(false);
        setIsquestion('')
        setAnswer('')


    };
    return (
        <div
            {...getRootProps()}
            className="border-2 border-dashed border-blue-400 p-6 rounded-xl cursor-pointer text-center bg-slate-800 text-white"
        >
            <input {...getInputProps()} />

            {!uploadedFile ? (
                isDragActive ? (
                    <p>Drop your file here...</p>
                ) : (
                    <>
                        <p>Drag and drop file here, or click to browse</p>
                        <p className="text-sm text-gray-400">
                            Limit 200MB • PDF
                        </p>
                    </>
                )
            ) : (
                <div>
                    <p className="text-green-400 font-semibold">✅ File uploaded!</p>
                    <p className="mt-2 text-gray-300">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">
                        Size: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>

                    <div className="flex flex-row justify-center gap-3 mt-1">
                        <p>Click to Cancle</p>
                        <button onClick={removeFile} className="text-red-400 font-bold cursor-pointer">
                            X
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
