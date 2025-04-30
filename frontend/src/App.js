
import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadForm from "./components/UploadForm";
import { jsPDF } from "jspdf";
import "./App.css";

function App() {
  const [generatedLetters, setGeneratedLetters] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [lastResume, setLastResume] = useState(null);
  const [lastJobDescription, setLastJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("coverLetterHistory");
    if (saved) {
      setGeneratedLetters(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("coverLetterHistory", JSON.stringify(generatedLetters));
  }, [generatedLetters]);

  const handleNewLetter = (newLetter, resume = null, jobDescription = "") => {
    setGeneratedLetters((prev) => [newLetter, ...prev]);
    setSelectedIndex(0);
    if (resume) setLastResume(resume);
    if (jobDescription) setLastJobDescription(jobDescription);
    setLoading(false);
  };

  const regenerateLetter = async () => {
    if (!lastResume || !lastJobDescription) {
      console.error("Missing resume or job description");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", lastResume);
    formData.append("job_description", lastJobDescription);
    try {

      const response = await axios.post(
        "https://coverly-production.up.railway.app/generate-cover-letter",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      

      if (response.data && response.data.cover_letter) {
        setGeneratedLetters((prev) => [response.data.cover_letter, ...prev]);
        setSelectedIndex(0);
      }
    } catch (error) {
      console.error("Error regenerating letter:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToPDF = (content) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(content, 170);
  
    const pageHeight = doc.internal.pageSize.height;
    lines.forEach((line) => {
      if (y + 7 > pageHeight) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 7;
    });
  
    doc.save("cover_letter.pdf");
  };
  

  const handleRestart = () => {
    setGeneratedLetters([]);
    setSelectedIndex(null);
    setLastResume(null);
    setLastJobDescription("");
    localStorage.removeItem("coverLetterHistory");
  };

  return (
    <div className="full-layout">
      <div className="sidebar">
        <h2>📂 Generated Letters</h2>
        {generatedLetters.length === 0 ? (
          <p>No letters yet.</p>
        ) : (
          <ul>
            {generatedLetters.map((letter, index) => (
              <li
                key={index}
                className={selectedIndex === index ? "active" : ""}
                onClick={() => setSelectedIndex(index)}
              >
                Version {generatedLetters.length - index}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="main-content">
        <div className="container">
          <h1>Coverly</h1>
          <h3>Boost Your Chances to Get The Job, Without Wasting Your Time ☕</h3>

          {selectedIndex === null ? (
            <UploadForm
              onLetterGenerated={(letter, resume, description) =>
                handleNewLetter(letter, resume, description)
              }
            />
          ) : (
            <>
              <div className="generated-letter">
                <h2>Here's Your Cover Letter!</h2>
                <p>{generatedLetters[selectedIndex]}</p>
              </div>

              <div className="button-stack">
                <div className="top-buttons-row">
                  <button className="pdf-button" onClick={() => handleSaveToPDF(generatedLetters[selectedIndex])}>
                    Save as PDF
                  </button>
                  <button className="restart-button" onClick={handleRestart}>
                    Home
                  </button>
                </div>
                <div className="bottom-button-row">
                  <button
                    onClick={regenerateLetter}
                    className="generate-new-button"
                    disabled={loading}
                  >
                    {loading ? <span className="loader"></span> : "Generate a New Letter"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
        <div className="page-footer">
          By AbuDaqaLabs
        </div>
    </div>
  );
}

export default App;// test change
