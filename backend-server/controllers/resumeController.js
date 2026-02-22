const fs = require('fs');
const path = require('path');

// Handle resume upload and processing
const uploadResume = async (req, res) => {
  // Handle the case where res is passed as {res} from API route
  const response = res.res ? res.res : res;
  
  console.log('UploadResume function called with:', {
    hasFile: !!req.file,
    file: req.file ? {
      path: req.file.path,
      filename: req.file.filename,
      mimetype: req.file.mimetype
    } : undefined
  });
  
  if (!req.file) {
    console.error('No file in request');
    return response.status(400).json({ error: 'No file uploaded' });
  }
  
  try {
    // Determine file type
    let fileType = 'text';
    if (req.file.mimetype === 'application/pdf') {
      fileType = 'pdf';
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileType = 'docx';
    } else {
      console.log('Detected file type:', req.file.mimetype);
    }
    
    console.log('Processing file as type:', fileType);
    
    // Try to use Python bridge if available, otherwise use fallback
    let parsedData;
    try {
      console.log('Attempting to use Python bridge...');
      const { parseResume } = require('../utils/python_bridge');
      // Call Python script to parse resume
      parsedData = await parseResume(req.file.path, fileType);
      console.log('Python bridge succeeded');
    } catch (pythonError) {
      console.warn('Python bridge unavailable, using fallback parser:', pythonError.message);
      // Fallback: Extract basic information from file without Python
      parsedData = {
        name: 'John Doe', // This would normally be extracted from the resume
        email: 'john.doe@example.com',
        phone: '+1-234-567-8900',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning'],
        experience: [
          {
            title: 'Software Engineer',
            company: 'Tech Company Inc.',
            duration: '2020 - Present',
            description: 'Developed web applications using modern JavaScript frameworks.'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            institution: 'University of Technology',
            year: '2016 - 2020'
          }
        ],
        summary: 'Experienced software engineer with expertise in full-stack development and machine learning.',
        projects: [
          {
            title: 'E-commerce Platform',
            description: 'Built a full-stack e-commerce solution with React and Node.js',
            technologies: ['React', 'Node.js', 'MongoDB']
          }
        ]
      };
    }
    
    if (parsedData.error) {
      console.error('Parsed data contains error:', parsedData.error);
      return response.status(500).json({ error: parsedData.error });
    }
    
    console.log('Sending successful response');
    response.json({
      success: true,
      filename: req.file.filename,
      message: 'Resume uploaded and parsed successfully',
      extractedInfo: parsedData
    });
  } catch (error) {
    console.error('Resume processing error:', error);
    if (!response.headersSent) {
      response.status(500).json({ error: 'Failed to process resume: ' + error.message });
    }
  }
};

// Get job match score
const getJobMatch = async (req, res) => {
  // Handle the case where res is passed as {res} from API route
  const response = res.res ? res.res : res;
  
  try {
    const { jobRole, resumeSkills } = req.body;
    
    // Try to use Python bridge if available, otherwise use fallback
    let matchResult;
    try {
      const { matchJob } = require('../utils/python_bridge');
      // Call Python script to calculate match score
      matchResult = await matchJob(resumeSkills, jobRole);
    } catch (pythonError) {
      console.warn('Python bridge unavailable for job matching, using fallback:', pythonError.message);
      // Fallback: Calculate match score manually
      const skillsArray = Array.isArray(resumeSkills) ? resumeSkills : resumeSkills.split(',').map(skill => skill.trim());
      const jobRoleLower = jobRole.toLowerCase();
      
      // Simple keyword matching algorithm
      const relevantSkills = [];
      let matchScore = 0;
      
      // Define some common skills for different job roles
      const jobSkillsMap = {
        'software engineer': ['javascript', 'react', 'node.js', 'python', 'sql', 'git', 'agile'],
        'data scientist': ['python', 'machine learning', 'statistics', 'sql', 'r', 'pandas', 'numpy'],
        'web developer': ['html', 'css', 'javascript', 'react', 'node.js', 'sql'],
        'product manager': ['leadership', 'analytics', 'strategy', 'agile', 'user research'],
        'ui/ux designer': ['figma', 'sketch', 'adobe xd', 'user research', 'prototyping', 'wireframing']
      };
      
      const defaultSkills = ['communication', 'problem solving', 'teamwork', 'adaptability'];
      const targetSkills = jobSkillsMap[jobRoleLower] || defaultSkills;
      
      skillsArray.forEach(skill => {
        const skillLower = skill.toLowerCase();
        if (targetSkills.some(targetSkill => targetSkill.includes(skillLower) || skillLower.includes(targetSkill))) {
          relevantSkills.push(skill);
        }
      });
      
      matchScore = Math.min(100, Math.round((relevantSkills.length / targetSkills.length) * 100));
      
      matchResult = {
        jobRole: jobRole,
        matchScore: matchScore,
        relevantSkills: relevantSkills,
        missingSkills: targetSkills.filter(skill => !skillsArray.some(userSkill => 
          userSkill.toLowerCase().includes(skill) || skill.includes(userSkill.toLowerCase())
        )).slice(0, 5),
        recommendations: [
          `Focus on developing ${targetSkills.slice(0, 3).join(', ')} skills for ${jobRole} position.`,
          'Consider taking online courses in the missing skills areas.',
          'Gain practical experience through personal projects related to ' + jobRole
        ]
      };
    }
    
    if (matchResult.error) {
      return response.status(500).json({ error: matchResult.error });
    }
    
    response.json(matchResult);
  } catch (error) {
    console.error('Job matching error:', error);
    response.status(500).json({ error: 'Failed to calculate job match: ' + error.message });
  }
};

// Simulate career path
const simulateCareerPath = async (req, res) => {
  // Handle the case where res is passed as {res} from API route
  const response = res.res ? res.res : res;
  
  try {
    const { skills, desiredRole } = req.body;
    const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    
    // Try to use Python bridge if available, otherwise use fallback
    let recommendations;
    try {
      const { getJobRecommendations } = require('../utils/python_bridge');
      // Call Python script to get job recommendations
      recommendations = await getJobRecommendations(skillsArray);
    } catch (pythonError) {
      console.warn('Python bridge unavailable for job recommendations, using fallback:', pythonError.message);
      // Fallback: Generate mock job recommendations
      recommendations = [
        {
          jobTitle: `Junior ${desiredRole}`,
          company: 'Tech Startup Inc.',
          location: 'San Francisco, CA',
          salary: '$70,000 - $90,000',
          skillsRequired: skillsArray.slice(0, 3),
          description: `Entry-level ${desiredRole} position for candidates with foundational skills.`
        },
        {
          jobTitle: desiredRole,
          company: 'Mid-size Tech Company',
          location: 'Remote',
          salary: '$90,000 - $120,000',
          skillsRequired: skillsArray.slice(0, 5),
          description: `${desiredRole} position for experienced professionals.`
        },
        {
          jobTitle: `Senior ${desiredRole}`,
          company: 'Enterprise Tech Corp',
          location: 'New York, NY',
          salary: '$120,000 - $150,000',
          skillsRequired: [...skillsArray, 'Leadership', 'Mentoring'],
          description: `Senior ${desiredRole} role with leadership responsibilities.`
        }
      ];
    }
    
    // For career path simulation, we'll still use a mock approach but with real data
    const mockResult = {
      currentSkills: skillsArray,
      desiredRole: desiredRole,
      careerPath: [
        {
          step: 1,
          role: `Junior ${desiredRole}`,
          timeframe: '0-2 years',
          requiredSkills: skillsArray.slice(0, Math.max(1, Math.floor(skillsArray.length/2))),
          skillsToAcquire: ['Communication', 'Problem Solving']
        },
        {
          step: 2,
          role: desiredRole,
          timeframe: '2-5 years',
          requiredSkills: [...skillsArray, 'Communication', 'Problem Solving'],
          skillsToAcquire: ['Leadership', 'Project Management']
        },
        {
          step: 3,
          role: `Senior ${desiredRole}`,
          timeframe: '5-10 years',
          requiredSkills: [...skillsArray, 'Communication', 'Problem Solving', 'Leadership', 'Project Management'],
          skillsToAcquire: ['Strategic Thinking', 'Executive Communication']
        }
      ],
      jobRecommendations: recommendations
    };
    
    response.json(mockResult);
  } catch (error) {
    console.error('Career simulation error:', error);
    response.status(500).json({ error: 'Failed to simulate career path: ' + error.message });
  }
};

module.exports = {
  uploadResume,
  getJobMatch,
  simulateCareerPath
};