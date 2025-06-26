import React, { useEffect, useState } from 'react';
import './Login.css';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const backgroundImages = [
  '/images/coverly-logo.png',
  '/images/coverly-logo.png'
];

function SignupPage() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Signed up UID:", user.uid);

      sessionStorage.setItem("uid", user.uid);
      navigate('/'); // or '/' if you prefer
    } catch (error) {
      console.error("❌ Signup error:", error.message);
      alert("Signup failed. Try another email.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="background-carousel">
        <img className="bg-img" src={backgroundImages[index]} alt="Background Slide" />
      </div>

      <div className="auth-container">
        <h1>Sign Up</h1>
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>

        <form onSubmit={handleSignup}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          <button type="submit">Create Account</button>

          <div className="divider"><span>or sign up with</span></div>

          <div className="social-buttons">
            <button className="google">Google</button>
            <button className="apple">Apple</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
