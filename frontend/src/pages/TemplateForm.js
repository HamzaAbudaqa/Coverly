import React,{useState} from 'react';
import './TemplateForm.css';

function TemplateForm(){
    const [formData,setFormData] = useState({
        fullName:'',
        address:'',
        phoneNumber:'',
        email:'',
        resume:'',
        pastWorkExperience:'',
        skills:'',
        pastProjects:'',
    });

    const handleModifications = (e) => {
        setFormData((prev) => ({
            ...prev,// ... calls a value AND THE thing after it the "," is what to change it to 
            [e.target.name]: e.target.value,}));
        };

     const handleSubmit = async (e) => { //async function -> means that it will wait for a response from the server 
    e.preventDefault(); // prevents the page from reloading and reseting adter submitting
    try {
      const res = await fetch('http://localhost:8000/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, // tells the backend to expect a JSON as a response
        body: JSON.stringify({
          user_id: 'test-user', // replace with actual user ID if auth is implemented xx
          ...formData, //  add user_id to the JSON with the other data collected
        }),
      });


      const data = await res.json();
      alert('Saved successfully!');
      console.log(data);
    } catch (err) {
      console.error('Error saving template:', err);
    }
  };
    
  return (
    <div className="template-form-container">
      <h2>Tell me About yourself</h2>
      <form onSubmit={handleSubmit}>
        <div className="two-column-group">
        <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleModifications} required />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleModifications} required />
        <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleModifications} required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleModifications} required />
    </div>
        <textarea name="resume" placeholder="Paste your resume here" rows={5} value={formData.resume} onChange={handleModifications} required />
        <textarea name="experience" placeholder="Describe your work experience" rows={4} value={formData.experience} onChange={handleModifications} />
        <textarea name="skills" placeholder="List your key skills" rows={3} value={formData.skills} onChange={handleModifications} />
        <textarea name="projects" placeholder="Mention past projects" rows={3} value={formData.projects} onChange={handleModifications} />

        <button type="submit">Save Template</button>
      </form>
    </div>
  );
}

export default TemplateForm;
