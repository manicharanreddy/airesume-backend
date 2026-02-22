import React, { useState, useEffect } from 'react';
import { simulateCareerPath } from '../services/api';
import './CareerPathSimulator.css';

const CareerPathSimulator = ({ resumeSkills = [] }) => {
  const [skills, setSkills] = useState('');
  const [desiredRole, setDesiredRole] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);

  // Fetch available roles when component mounts
  useEffect(() => {
    // In a real implementation, this would fetch from the backend
    // For now, we'll use the simulated data from the backend
    const roles = [
      "Senior Python Developer",
      "Machine Learning Engineer",
      "Frontend Developer",
      "DevOps Engineer",
      "Data Scientist",
      "Full Stack Developer",
      "Cybersecurity Analyst",
      "Backend Engineer"
    ];
    setAvailableRoles(roles);
    
    // Set default desired role if available
    if (roles.length > 0 && !desiredRole) {
      setDesiredRole(roles[0]);
    }
  }, [desiredRole]);

  // Update skills when resume skills change
  useEffect(() => {
    if (resumeSkills.length > 0) {
      setSkills(resumeSkills.join(', '));
    }
  }, [resumeSkills]);

  const handleSimulate = async (e) => {
    e.preventDefault();
    
    if (!skills.trim()) {
      alert('Please enter your skills');
      return;
    }
    
    if (!desiredRole) {
      alert('Please select a desired role');
      return;
    }

    setLoading(true);
    try {
      const response = await simulateCareerPath({
        skills: skills,
        desiredRole: desiredRole
      });
      setSimulationResult(response.data);
    } catch (error) {
      console.error('Simulation error:', error);
      setSimulationResult({ error: 'Failed to simulate career path: ' + (error.response?.data?.error || error.message) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-path-simulator">
      <h2>AI Career Path Simulator</h2>
      <form onSubmit={handleSimulate}>
        <div>
          <label htmlFor="skills">Current Skills (comma separated):</label>
          <input
            type="text"
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g., JavaScript, React, Node.js"
          />
        </div>
        <div>
          <label htmlFor="desiredRole">Desired Role:</label>
          <select
            id="desiredRole"
            value={desiredRole}
            onChange={(e) => setDesiredRole(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a desired role...</option>
            {availableRoles.map((role, index) => (
              <option key={index} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Simulating...' : 'Simulate Career Path'}
        </button>
      </form>
      
      {simulationResult && (
        <div className="simulation-result">
          {simulationResult.error ? (
            <p className="error">Error: {simulationResult.error}</p>
          ) : (
            <>
              <h3>Career Path for: {simulationResult.desiredRole}</h3>
              <p>Current Skills: {simulationResult.currentSkills.join(', ')}</p>
              
              <div className="career-progression-container">
                <h4>📈 Career Progression Roadmap</h4>
                <div className="career-timeline">
                  {simulationResult.careerPath.map((step, index) => (
                    <div key={step.step} className="career-step-card">
                      <div className="step-indicator">
                        <div className="step-number">{step.step}</div>
                        <div className="step-connector" />
                      </div>
                      <div className="step-content">
                        <h5 className="step-role">{step.role}</h5>
                        <div className="step-timeframe">⏱ {step.timeframe}</div>
                        <div className="skills-section">
                          <div className="skills-container">
                            <h6>Required Skills:</h6>
                            <div className="skills-tags">
                              {step.requiredSkills.map((skill, skillIndex) => (
                                <span key={skillIndex} className="skill-tag required">{skill}</span>
                              ))}
                            </div>
                          </div>
                          <div className="skills-container">
                            <h6>Skills to Acquire:</h6>
                            <div className="skills-tags">
                              {step.skillsToAcquire.map((skill, skillIndex) => (
                                <span key={skillIndex} className="skill-tag to-acquire">{skill}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {simulationResult.jobRecommendations && simulationResult.jobRecommendations.length > 0 && (
                <div className="job-recommendations-section">
                  <h4>💼 Job Recommendations Based on Your Skills:</h4>
                  <div className="job-cards-container">
                    {simulationResult.jobRecommendations.map((job) => (
                      <div key={job.id} className="job-card">
                        <div className="job-header">
                          <h6 className="job-title">{job.title}</h6>
                          <div className="match-score-badge" style={{
                            backgroundColor: job.match_score >= 80 ? 'var(--success-color)' : 
                                          job.match_score >= 60 ? 'var(--warning-color)' : 'var(--danger-color)'
                          }}>
                            {job.match_score}% Match
                          </div>
                        </div>
                        <div className="job-details">
                          <p className="similarity-score">Similarity: {job.similarity_score}%</p>
                          {job.company && <p className="company">🏢 {job.company}</p>}
                          {job.location && <p className="location">📍 {job.location}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerPathSimulator;