import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './components/ResumeUpload';
import JobMatching from './components/JobMatching';
import CareerPathSimulator from './components/CareerPathSimulator';
import FutureSkillPredictor from './components/FutureSkillPredictor';
import BiasChecker from './components/BiasChecker';
import PortfolioGenerator from './components/PortfolioGenerator';
import InterviewPractice from './components/InterviewPractice';
import Profile from './pages/Profile';
import './styles/globals.css';
import './styles/App.css';

function App() {
  const [resumeSkills, setResumeSkills] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('App component mounted - checking auth');
    // Check if user is logged in
    const checkUserAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Token:', token ? 'present' : 'missing');
      console.log('User data:', userData ? 'present' : 'missing');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    // Check authentication on initial load
    checkUserAuth();

    // Listen for storage changes (e.g., when user logs in from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkUserAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Create floating background elements
    const createFloatingShapes = () => {
      const container = document.body;
      for (let i = 0; i < 4; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        container.appendChild(shape);
      }
    };

    createFloatingShapes();

    // Cleanup function
    return () => {
      const shapes = document.querySelectorAll('.floating-shape');
      shapes.forEach(shape => shape.remove());
    };
  }, []);

  const handleUploadSuccess = (extractedInfo) => {
    if (extractedInfo.skills) {
      setResumeSkills(extractedInfo.skills);
    }
    setResumeData(extractedInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => {
    return localStorage.getItem('token') && localStorage.getItem('user');
  };

  // Function to update user state (can be called after login)
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  console.log('Rendering App with user:', user);
  return (
    <div className="App">
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login updateUser={updateUser} />} />
        <Route path="/register" element={<Register updateUser={updateUser} />} />
        <Route path="/dashboard" element={isAuthenticated() ? (
          <div className="app-layout">
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="main-content with-sidebar">
              <Dashboard />
            </main>
          </div>
        ) : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated() ? (
          <div className="app-layout">
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="main-content with-sidebar">
              <Profile user={user} />
            </main>
          </div>
        ) : <Navigate to="/login" />} />
        <Route path="/resume-upload" element={isAuthenticated() ? (
          <div className="app-layout">
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="main-content with-sidebar">
              <div className="tool-page">
                
                <ResumeUpload onUploadSuccess={handleUploadSuccess} />
              </div>
            </main>
          </div>
        ) : <Navigate to="/login" />} />
        <Route path="/job-matching" element={isAuthenticated() ? (
          <div className="app-layout">
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="main-content with-sidebar">
              <div className="tool-page">
               
                <JobMatching resumeSkills={resumeSkills} />
              </div>
            </main>
          </div>
        ) : <Navigate to="/login" />} />
        <Route path="/career-path" element={isAuthenticated() ? (
          <div className="app-layout">
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="main-content with-sidebar">
              <div className="tool-page">
                
                <CareerPathSimulator resumeSkills={resumeSkills} />
              </div>
            </main>
          </div>
        ) : <Navigate to="/login" />} />
        <Route path="/future-skills" element={isAuthenticated() ? (
          <div className="app-layout">
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="main-content with-sidebar">
              <div className="tool-page">
                
                <FutureSkillPredictor resumeSkills={resumeSkills} />
              </div>
            </main>
          </div>
        ) : <Navigate to="/login" />} />
        <Route path="/bias-checker" element={isAuthenticated() ? (
          <div className="app-layout">
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="main-content with-sidebar">
              <div className="tool-page">
               
                <BiasChecker />
              </div>
            </main>
          </div>
        ) : <Navigate to="/login" />} />
        <Route path="/portfolio-generator" element={isAuthenticated() ? (
          <div className="app-layout">
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="main-content with-sidebar">
              <div className="tool-page">
                
                <PortfolioGenerator resumeData={resumeData} />
              </div>
            </main>
          </div>
        ) : <Navigate to="/login" />} />
        <Route path="/interview-practice" element={isAuthenticated() ? (
          <div className="app-layout">
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="main-content with-sidebar">
              <div className="tool-page">
                <header className="tool-header">
                  <h1>Interview Practice</h1>
                  <p>Prepare for interviews with AI-generated questions</p>
                </header>
                <InterviewPractice resumeData={resumeData} />
              </div>
            </main>
          </div>
        ) : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;