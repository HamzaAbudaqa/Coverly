import React, { useState } from "react";
import axios from "axios";

function UploadForm({ onLetterGenerated }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false); // <-- NEW

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) {
      alert("Please upload your resume and paste a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jobDescription);

    setLoading(true); // start loading

    try {
      const response = await axios.post("https://coverly-production.up.railway.app/generate-cover-letter", formData, {

        headers: { "Content-Type": "multipart/form-data" },
      });
      onLetterGenerated(response.data.cover_letter, resumeFile, jobDescription);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      alert("Something went wrong while generating the letter.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => setResumeFile(e.target.files[0])}
      />
      <textarea
        rows="8"
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      {loading ? (
        <div className="spinner" />
      ) : (
        <button type="submit">Generate Cover Letter</button>
      )}
    </form>
  );
}

export default UploadForm;
