
import React, { useEffect, useState } from 'react';
import './Homepage.css';
import logo from '../components/coverly-logo-new.png';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [text, setText] = useState('');
  const [logoInCorner, setLogoInCorner] = useState(false);
  const fullText = 'Simplify Job Applications... With COVERLY';
  const navigate = useNavigate();

  useEffect(() => {
  let i = 0;
  const typing = setInterval(() => {
    if (i < fullText.length) {
      setText(fullText.slice(0, i + 1));
      i++;
    } else {
      clearInterval(typing);
      setTimeout(() => setLogoInCorner(true), 500);
    }
  }, 50);

  return () => clearInterval(typing);
}, []);


  return (
    <div className="home-container">
      <div className="home-left">
        <img
          src={logo}
          className={`animated-logo ${logoInCorner ? 'logo-corner' : ''}`}
          alt="Coverly Logo"
        />

        <h1 className="typewriter-text">{text}</h1>
{logoInCorner && (
  <>
    
    <p className="home-description">
      Coverly writes cover letters and auto-fills job applications for you.<br />
      Skip the repetitive stuff. Apply smarter.
    </p>
  </>
)}

        {logoInCorner && (
          <button onClick={() => navigate('/template')} className="cta-button left-button">
            Try Coverly
          </button>
        )}
      </div>

      <div className="home-right">
        {logoInCorner && (
          <div className="video-wrapper">
            <iframe
    className="demo-video"
    src="https://www.youtube.com/embed/bASCt3yG-Ws?autoplay=1&mute=1&loop=1&playlist=bASCt3yG-Ws"
    title="Coverly Demo"
    frameBorder="0"
    allow="autoplay; encrypted-media"
    allowFullScreen
  ></iframe>
</div>
      
        )}
      </div>
    </div>
  );
}
