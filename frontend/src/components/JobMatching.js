import React, { useState, useEffect } from 'react';
import { getJobMatch } from '../services/api';
import './JobMatching.css';

const JobMatching = ({ resumeSkills = [] }) => {
  const [jobRole, setJobRole] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableJobs, setAvailableJobs] = useState([]);

  // Fetch available jobs when component mounts
  useEffect(() => {
    // In a real implementation, this would fetch from the backend
    // For now, we'll use the simulated data from the backend
    const jobs = [
      "Senior Python Developer",
      "Machine Learning Engineer",
      "Frontend Developer",
      "DevOps Engineer",
      "Data Scientist",
      "Full Stack Developer",
      "Cybersecurity Analyst",
      "Backend Engineer"
    ];
    setAvailableJobs(jobs);
    
    // Set default job role if available
    if (jobs.length > 0 && !jobRole) {
      setJobRole(jobs[0]);
    }
  }, [jobRole]);

  const handleMatch = async (e) => {
    e.preventDefault();
    
    if (resumeSkills.length === 0) {
      alert('Please upload a resume first to extract skills');
      return;
    }
    
    if (!jobRole) {
      alert('Please select a job role');
      return;
    }

    setLoading(true);
    try {
      const response = await getJobMatch({
        jobRole: jobRole,
        resumeSkills: resumeSkills
      });
      setMatchResult(response.data);
    } catch (error) {
      console.error('Match error:', error);
      setMatchResult({ error: 'Failed to get match results: ' + (error.response?.data?.error || error.message) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-matching">
      <h2>Job Matching</h2>
      <form onSubmit={handleMatch}>
        <div>
          <label htmlFor="jobRole">Select Job Role:</label>
          <select
            id="jobRole"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a job role...</option>
            {availableJobs.map((job, index) => (
              <option key={index} value={job}>{job}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading || resumeSkills.length === 0}>
          {loading ? 'Calculating...' : 'Get Match Score'}
        </button>
      </form>
      
      {resumeSkills.length === 0 && (
        <p className="info">Please upload a resume first to see job matching results</p>
      )}
      
      {matchResult && (
        <div className="match-result">
          {matchResult.error ? (
            <p className="error">Error: {matchResult.error}</p>
          ) : (
            <>
              <h3>Match Result for: {matchResult.job_title}</h3>
              <div className="match-score-container">
                <div className="match-score-visual">
                  <div className="score-circle" style={{
                    background: `conic-gradient(
                      ${matchResult.match_score >= 70 ? 'var(--success-color)' : matchResult.match_score >= 50 ? 'var(--warning-color)' : 'var(--danger-color)'} 0% ${matchResult.match_score}%,
                      #e2e8f0 ${matchResult.match_score}% 100%
                    )`
                  }}>
                    <div className="score-inner">
                      <span className="score-value">{matchResult.match_score}%</span>
                      <span className="score-label">Match</span>
                    </div>
                  </div>
                </div>
                <div className="match-score-info">
                  <h4>Match Analysis</h4>
                  <p className="match-description">
                    {matchResult.match_score >= 80 
                      ? 'Excellent match! Your skills align very well with this role.'
                      : matchResult.match_score >= 60 
                      ? 'Good match with some areas for improvement.'
                      : matchResult.match_score >= 40 
                      ? 'Moderate match. Consider developing more relevant skills.'
                      : 'Low match. Significant skill development needed for this role.'}
                  </p>
                </div>
              </div>
              
              <div className="skills-section">
                {matchResult.matching_skills && matchResult.matching_skills.length > 0 && (
                  <div className="skills-container matching-skills">
                    <h4>✅ Matching Skills ({matchResult.matching_skills.length})</h4>
                    <div className="skills-grid">
                      {matchResult.matching_skills.map((skill, index) => (
                        <div key={index} className="skill-tag matched">
                          <span className="skill-name">{skill}</span>
                          <span className="skill-icon">✓</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {matchResult.missing_skills && matchResult.missing_skills.length > 0 && (
                  <div className="skills-container missing-skills">
                    <h4>⚠️ Skills to Develop ({matchResult.missing_skills.length})</h4>
                    <div className="skills-grid">
                      {matchResult.missing_skills.map((skill, index) => (
                        <div key={index} className="skill-tag missing">
                          <span className="skill-name">{skill}</span>
                          <span className="skill-icon">+</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {matchResult.salary_data && (
                <div className="salary-info">
                  <h4>💰 Salary Information</h4>
                  <div className="salary-details">
                    <p><strong>Average:</strong> ${matchResult.salary_data.avg.toLocaleString()}</p>
                    <p><strong>Range:</strong> ${matchResult.salary_data.min.toLocaleString()} - ${matchResult.salary_data.max.toLocaleString()}</p>
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

export default JobMatching;