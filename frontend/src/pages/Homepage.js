import React from 'react';
import './Homepage.css';

function HomePage() {
  return (
    <div className="homepage">
      <div className="hero">
        <div className="hero-text">
          <h1><span>Simplify Job Applications</span><br /> With Coverly</h1>
          <p>Coverly writes cover letters and applies to jobs for you. Save time. Land interviews. It’s that simple.</p>
          <button className="cta-button">Try Coverly</button>
        </div>

        <div className="hero-preview">
          <div className="mockup-card">
            <h3>Sample Cover Letter</h3>
            <p>Dear Hiring Manager, I’m excited to apply for the Software Developer Intern role...</p>
            <button className="mock-button">Regenerate</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
