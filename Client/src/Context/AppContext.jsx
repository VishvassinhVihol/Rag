import React, { createContext } from 'react'
import { useState } from 'react'

export const AppContext = createContext()

const AppContextProvider = ({children}) => {
    const [IsProcessed, setIsProcessed] = useState(false)
      const [uploadedFile, setUploadedFile] = useState(null);
      const [question, setIsquestion] = useState("");
      const [answer, setAnswer] = useState("");

    let value = {IsProcessed,setIsProcessed,uploadedFile, setUploadedFile,question, setIsquestion,answer, setAnswer}

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  )
}

export default AppContextProvider