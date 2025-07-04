/* global chrome */
import React, { useState } from 'react';
import './TemplateForm.css';
import { useNavigate } from 'react-router-dom';

function TemplateForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    email: '',
    resume: '',
    pastWorkExperience: '',
    skills: '',
    pastProjects: '',
  });

  const navigate = useNavigate();

  const handleModifications = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3002/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'test-user', ...formData }),
      });

      if (!res.ok) throw new Error('Failed to save template');

      const result = await res.json();
      console.log(result);
      alert('Template saved successfully!');
      navigate('/');

      // ✅ Instead of using chrome.runtime, use window.postMessage to send to extension
      window.postMessage({
        source: "coverly-template",
        type: "SAVE_TEMPLATE",
        payload: formData,
      }, "*");

    } catch (error) {
      console.error('❌ Error saving template:', error);
      alert('Something went wrong. Try again.');
    }
  };

  return (
    <div className="template-form-container">
      <h2>Tell me About Yourself</h2>
      <form onSubmit={handleSubmit}>
        <div className="two-column-group">
          <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleModifications} required />
          <input name="address" placeholder="Address" value={formData.address} onChange={handleModifications} required />
          <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleModifications} required />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleModifications} required />
        </div>
        <textarea name="resume" placeholder="Paste your resume here" rows={5} value={formData.resume} onChange={handleModifications} required />
        <textarea name="pastWorkExperience" placeholder="Describe your work experience" rows={4} value={formData.pastWorkExperience} onChange={handleModifications} />
        <textarea name="skills" placeholder="List your key skills" rows={3} value={formData.skills} onChange={handleModifications} />
        <textarea name="pastProjects" placeholder="Mention past projects" rows={3} value={formData.pastProjects} onChange={handleModifications} />

        <button type="submit">Save Template</button>
      </form>
    </div>
  );
}

export default TemplateForm;
