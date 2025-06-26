import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TemplateForm from "./pages/TemplateForm"; // your new form page
import HomePage from "./pages/Homepage";
import Signin from "./pages/Signin";
import "./App.css";
import LoginPage from "./pages/Login";

function App() {
  return (
    <Router>
      <div className="full-layout">
        <div className="main-content">
          <div className="container">
            <Routes>
              <Route path="/template" element={<TemplateForm />} />
              <Route path="/" element={<HomePage/>}/>
              <Route path="/signup" element={<Signin />}/>
              <Route path="/login" element={<LoginPage/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
