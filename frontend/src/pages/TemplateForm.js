import React, { useState } from 'react';
import './TemplateForm.css';
import { FiUploadCloud } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const questions = [
  { name: 'fullName', label: "What's your full name?", type: 'text' },
  { name: 'email', label: "What's your email address?", type: 'text' },
  { name: 'resume', label: "Upload your resume (PDF)", type: 'file' },
  { name: 'address', label: "What's your address?", type: 'text' },
  { name: 'phoneNumber', label: "What's your phone number?", type: 'text' },
  { name: 'pastWorkExperience', label: "Tell us about your work experience.", type: 'experience' },
  { name: 'skills', label: "List your key skills.", type: 'text' },
  { name: 'pastProjects', label: "Mention past projects.", type: 'text' },
];

export default function TemplateForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [experienceEntries, setExperienceEntries] = useState([
    { company: '', location: '', dates: '', description: '' }
  ]);
  const navigate = useNavigate();

  const current = questions[step];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: current.type === 'file' ? files[0] : value,
    }));
  };

  const handleContinue = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (!formData[current.name]) return;
      setStep((prev) => prev + 1);
    }
  };

  const handleExpChange = (index, field, value) => {
    const updated = [...experienceEntries];
    updated[index][field] = value;
    setExperienceEntries(updated);
  };

  const addExperience = () => {
    setExperienceEntries([...experienceEntries, { company: '', location: '', dates: '', description: '' }]);
  };

  const continueWithExperience = () => {
    setFormData((prev) => ({ ...prev, pastWorkExperience: experienceEntries }));
    setStep((prev) => prev + 1);
  };

  return (
    <div className="coverly-gradient-bg">
      {step < questions.length ? (
        <div className="form-card-animated">
          <div className="meta-ring-container" style={{ marginBottom: '4%' }}>
            <div className="meta-ring"></div>
          </div>

          <label className="form-label">{current.label}</label>

          {current.type === 'file' ? (
            <>
              <label htmlFor="file-upload" className="upload-button">
                <FiUploadCloud size={24} style={{ marginRight: '10px' }} />
                Upload File
              </label>
              <input
                id="file-upload"
                type="file"
                name={current.name}
                accept=".pdf"
                onChange={handleChange}
                className="hidden-input"
              />
              <button onClick={handleContinue} className="next-button">Next →</button>
            </>
          ) : current.type === 'experience' ? (
            <>
              {experienceEntries.map((entry, idx) => (
                <div className="experience-block" key={idx}>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={entry.company}
                    onChange={(e) => handleExpChange(idx, 'company', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={entry.location}
                    onChange={(e) => handleExpChange(idx, 'location', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Dates (e.g. Jan 2021 - Dec 2023)"
                    value={entry.dates}
                    onChange={(e) => handleExpChange(idx, 'dates', e.target.value)}
                  />
                  <textarea
                    placeholder="Job Description"
                    value={entry.description}
                    onChange={(e) => handleExpChange(idx, 'description', e.target.value)}
                  />
                </div>
              ))}
              <div className="experience-actions">
                <button onClick={addExperience} className="add-more">➕ Add Another</button>
                <button onClick={continueWithExperience} className="next-button">Next →</button>
              </div>
            </>
          ) : (
            <input
              type="text"
              name={current.name}
              value={formData[current.name] || ''}
              onChange={handleChange}
              onKeyDown={handleContinue}
              placeholder="Type your answer here..."
              autoFocus
              className="form-input"
            />
          )}
        </div>
      ) : (
        <div className="form-card-animated done-screen">
          <h2>✅ Your info was updated.</h2>
          <p className="done-subtext">You can now autofill job applications with Coverly.</p>
          <button onClick={() => navigate('/account-info')} className="edit-button">
            ✏️ Edit Info
          </button>
        </div>
      )}
    </div>
  );
}
