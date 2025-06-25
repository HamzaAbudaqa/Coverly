import React from 'react';
import './Homepage.css';
import {useNavigate} from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="homepage">
      <div className="hero">
        <div className="hero-text">
          <img src="/cctrans.png" alt="Coverly Logo" className="hero-logo" />
          <h1><span>Simplify Job Applications</span><br /> With Coverly</h1>
          <p>Coverly writes cover letters and applies to jobs for you. Save time. Land interviews. It’s that simple.</p>
          <button className="cta-button">Try Coverly</button>
        </div>

        <div className="hero-preview">
          <div className="mockup-card">
            <h3>Profile Template</h3>
            <p>Fill out your application template once an application cycle and never think about it again</p>
            <button onClick={() => navigate('/template')} className="mock-button">Let's Get Filling</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
