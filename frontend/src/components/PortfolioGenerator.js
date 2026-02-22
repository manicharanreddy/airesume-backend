import React, { useState } from 'react';
import { generatePortfolio } from '../services/api';
import './PortfolioGenerator.css';

const PortfolioGenerator = ({ resumeData: propResumeData }) => {
  const [file, setFile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadError(null);
    
    if (selectedFile) {
      // Upload and parse the resume file
      const formData = new FormData();
      formData.append('resume', selectedFile);
      
      // Upload the file to get parsed content
      fetch('http://localhost:5000/api/resume/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        if (data.extractedInfo) {
          setExtractedData(data.extractedInfo);
          setIsFileUploaded(true);
        } else {
          setUploadError(data.error || 'Failed to extract resume data');
        }
      })
      .catch(error => {
        console.error('Upload error:', error);
        setUploadError('Failed to upload and parse resume: ' + error.message);
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      
      if (selectedFile) {
        // Upload and parse the resume file
        const formData = new FormData();
        formData.append('resume', selectedFile);
        
        // Upload the file to get parsed content
        fetch('http://localhost:5000/api/resume/upload', {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(data => {
          if (data.extractedInfo) {
            setExtractedData(data.extractedInfo);
            setIsFileUploaded(true);
          } else {
            setUploadError(data.error || 'Failed to extract resume data');
          }
        })
        .catch(error => {
          console.error('Upload error:', error);
          setUploadError('Failed to upload and parse resume: ' + error.message);
        });
      }
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!isFileUploaded) {
      alert('Please upload a resume file first');
      return;
    }

    setGenerating(true);
    
    try {
      // Use extracted data from uploaded resume
      let dataToUse = {};
      
      if (extractedData) {
        // Extract data from parsed resume
        const contactInfo = extractedData.contact_info || {};
        const skills = extractedData.skills || [];
        const experience = extractedData.experience || "Experience details would be extracted from resume";
        const education = extractedData.education || "Education details would be extracted from resume";
        const projects = extractedData.projects || "Project details would be extracted from resume";
        
        dataToUse = {
          name: contactInfo.name || "Unknown",
          email: (contactInfo.emails && contactInfo.emails[0]) || "unknown@example.com",
          phone: (contactInfo.phones && contactInfo.phones[0]) || "N/A",
          skills: skills.join(', '),
          experience: experience,
          education: education,
          projects: projects
        };
      } else if (propResumeData) {
        // Fallback to prop data
        const contactInfo = propResumeData.contact_info || {};
        const skills = propResumeData.skills || [];
        
        dataToUse = {
          name: contactInfo.name || "Unknown",
          email: (contactInfo.emails && contactInfo.emails[0]) || "unknown@example.com",
          phone: (contactInfo.phones && contactInfo.phones[0]) || "N/A",
          skills: skills.join(', '),
          experience: propResumeData.experience || "Experience details would be extracted from resume",
          education: propResumeData.education || "Education details would be extracted from resume",
          projects: propResumeData.projects || "Project details would be extracted from resume"
        };
      } else {
        // Default fallback
        dataToUse = {
          name: "Default Name",
          email: "default@example.com",
          phone: "N/A",
          skills: "JavaScript, HTML, CSS",
          experience: "Web development experience",
          education: "Computer Science degree",
          projects: "Web application projects"
        };
      }
      
      const response = await generatePortfolio(dataToUse);
      setPortfolio(response.data);
    } catch (error) {
      console.error('Portfolio generation error:', error);
      setPortfolio({ error: 'Failed to generate portfolio: ' + error.message });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="portfolio-generator">
      <h2>AI Portfolio Generator</h2>
      <form onSubmit={handleGenerate}>
        <div 
          className={`file-upload-area ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="file-upload-icon">📁</div>
          <div className="file-upload-text">
            {file ? file.name : 'Drag & Drop your resume here'}
          </div>
          <div className="file-upload-hint">
            {file ? 'File selected' : 'Supports PDF, DOC, DOCX files (Max 5MB)'}
          </div>
          <input 
            type="file"
            id="resumeFile"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="file-upload-input"
          />
        </div>
        {isFileUploaded && <p>Resume parsed successfully. Click "Generate Portfolio" to create your portfolio.</p>}
        {uploadError && <p className="error">Error: {uploadError}</p>}
        
        <button type="submit" disabled={generating || !isFileUploaded}>
          {generating ? 'Generating Portfolio...' : 'Generate Portfolio'}
        </button>
      </form>
      
      {portfolio && (
        <div className="generated-portfolio">
          <h3>Generated Portfolio</h3>
          <div className="portfolio-content">
            <div className="portfolio-header">
              <div className="profile-section">
                <h4 className="profile-name">{portfolio.name}</h4>
                <div className="contact-info">
                  <p className="contact-item">📧 {portfolio.email}</p>
                  <p className="contact-item">📞 {portfolio.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="portfolio-section">
              <h5>🛠 Skills</h5>
              <div className="skills-container">
                {portfolio.skills.map((skill, index) => (
                  <span key={index} className="skill-badge">{skill}</span>
                ))}
              </div>
            </div>
            
            <div className="portfolio-section">
              <h5>💼 Experience</h5>
              <div className="experience-content">
                <p>{portfolio.experience}</p>
              </div>
            </div>
            
            <div className="portfolio-section">
              <h5>🎓 Education</h5>
              <div className="education-content">
                <p>{portfolio.education}</p>
              </div>
            </div>
            
            <div className="portfolio-section">
              <h5>🚀 Projects</h5>
              <div className="projects-grid">
                {portfolio.projects.map((project, index) => (
                  <div key={index} className="project-card">
                    <h6 className="project-title">{project.title}</h6>
                    <p className="project-description">{project.description}</p>
                    <div className="technologies-tags">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="portfolio-link-section">
              <h5>🌐 Portfolio Information</h5>
              {portfolio.note && (
                <div className="portfolio-note">
                  <h6>💡 Note:</h6>
                  <p>{portfolio.note}</p>
                </div>
              )}
              <div className="portfolio-url-card">
                <p><strong>Generated Portfolio URL (Demo):</strong></p>
                <div className="url-display">
                  <span className="url-text">{portfolio.portfolioUrl}</span>
                  <button 
                    className="copy-button"
                    onClick={() => {
                      navigator.clipboard.writeText(portfolio.portfolioUrl);
                      alert('URL copied to clipboard!');
                    }}
                  >
                    Copy
                  </button>
                </div>
                <button 
                  className="view-portfolio-button"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('This is a demo URL. In a real implementation, this would link to your generated portfolio website.');
                  }}
                >
                  👁️ View Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGenerator;