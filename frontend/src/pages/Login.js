import React, { useEffect, useState } from 'react';
import './Login.css';
import { auth, googleProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const backgroundImages = [
  '/coverly-logo.png',
  '/coverly-logo.png'
];


function LoginPage() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Logged in UID:", user.uid);

      sessionStorage.setItem("uid", user.uid);
      navigate('/template');
    } catch (error) {
      console.error("❌ Login error:", error.message);
      alert("Login failed. Check credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("✅ Google UID:", user.uid);

      sessionStorage.setItem("uid", user.uid);
      navigate('/template-form');
    } catch (err) {
      console.error("❌ Google login error:", err.message);
      alert("Google login failed.");
    }
  };

  return (
  <div className="login-wrapper">
    <div className="background-carousel">
      <img className="bg-img" src={backgroundImages[index]} alt="Background Slide" />
    </div>

    <div className="auth-container">
      <h1>Log in</h1>
      <p className="login-link">
        Don’t have an account? <a href="/signup">Create one</a>
      </p>

      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />

        <button type="submit">Log In</button>

        <div className="divider"><span>or log in with</span></div>

        <div className="social-buttons">
          <button type="button" className="google" onClick={handleGoogleLogin}>Google</button>
          <button type="button" className="apple" disabled>Apple</button>
        </div>
      </form>
    </div>
  </div>
);


}

export default LoginPage;
