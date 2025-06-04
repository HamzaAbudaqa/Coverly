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

  const BACKEND_URL = "https://coverly-production.up.railway.app/generate-cover-letter";

  try {
    const response = await axios.post(BACKEND_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    onLetterGenerated(response.data.cover_letter, resumeFile, jobDescription);
  } catch (error) {
    console.warn("⚠️ First attempt failed. Retrying in 2 seconds...", error);

    // Retry after 2 seconds
    setTimeout(async () => {
      try {
        const retryResponse = await axios.post(BACKEND_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onLetterGenerated(
          retryResponse.data.cover_letter,
          resumeFile,
          jobDescription
        );
      } catch (retryError) {
        console.error("❌ Retry also failed:", retryError);
        alert("Cover letter generation failed. Please try again in a few seconds.");
      } finally {
        setLoading(false); // stop loading after retry
      }
    }, 2000);

    return; // Prevent reaching final `setLoading(false)` too early
  }

  setLoading(false); // stop loading if first attempt succeeded
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
