const { spawn } = require('child_process');
const path = require('path');

// Function to call Python script for resume parsing
const parseResume = (filePath, fileType) => {
  return new Promise((resolve, reject) => {
    // Path to Python executable in virtual environment
    const pythonPath = path.join(__dirname, '..', 'ai_career_venv', 'Scripts', 'python.exe');
    
    // Path to Python script
    const scriptPath = path.join(__dirname, 'ai_career_engine.py');
    
    // Spawn Python process
    const pythonProcess = spawn(pythonPath, [scriptPath, 'parse', filePath, fileType]);
    
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
      } else {
        try {
          const result = JSON.parse(stdoutData);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      }
    });
  });
};

// Function to call Python script for job matching
const matchJob = (resumeSkills, jobTitle) => {
  return new Promise((resolve, reject) => {
    // Path to Python executable in virtual environment
    const pythonPath = path.join(__dirname, '..', 'ai_career_venv', 'Scripts', 'python.exe');
    
    // Path to Python script
    const scriptPath = path.join(__dirname, 'ai_career_engine.py');
    
    // Spawn Python process
    const pythonProcess = spawn(pythonPath, [scriptPath, 'match', JSON.stringify(resumeSkills), jobTitle]);
    
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
      } else {
        try {
          const result = JSON.parse(stdoutData);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      }
    });
  });
};

// Function to call Python script for job recommendations
const getJobRecommendations = (resumeSkills) => {
  return new Promise((resolve, reject) => {
    // Path to Python executable in virtual environment
    const pythonPath = path.join(__dirname, '..', 'ai_career_venv', 'Scripts', 'python.exe');
    
    // Path to Python script
    const scriptPath = path.join(__dirname, 'ai_career_engine.py');
    
    // Spawn Python process
    const pythonProcess = spawn(pythonPath, [scriptPath, 'recommend', JSON.stringify(resumeSkills)]);
    
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
      } else {
        try {
          const result = JSON.parse(stdoutData);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      }
    });
  });
};

// Function to call Python script for trending skills
const getTrendingSkills = () => {
  return new Promise((resolve, reject) => {
    // Path to Python executable in virtual environment
    const pythonPath = path.join(__dirname, '..', 'ai_career_venv', 'Scripts', 'python.exe');
    
    // Path to Python script
    const scriptPath = path.join(__dirname, 'ai_career_engine.py');
    
    // Spawn Python process
    const pythonProcess = spawn(pythonPath, [scriptPath, 'trending']);
    
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
      } else {
        try {
          const result = JSON.parse(stdoutData);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      }
    });
  });
};

// Function to call Python script for ML-based future skills prediction
const predictFutureSkillsML = (skillsArray) => {
  return new Promise((resolve, reject) => {
    // Path to Python executable in virtual environment
    const pythonPath = path.join(__dirname, '..', 'ai_career_venv', 'Scripts', 'python.exe');
    
    // Path to Python script
    const scriptPath = path.join(__dirname, 'ai_career_engine.py');
    
    // Spawn Python process
    const pythonProcess = spawn(pythonPath, [scriptPath, 'predict_future', JSON.stringify(skillsArray)]);
    
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
      } else {
        try {
          const result = JSON.parse(stdoutData);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      }
    });
  });
};

// Function to call Python script for interview question prediction
const predictInterviewQuestions = (resumeData) => {
  return new Promise((resolve, reject) => {
    // Path to Python executable in virtual environment
    const pythonPath = path.join(__dirname, '..', 'ai_career_venv', 'Scripts', 'python.exe');
    
    // Path to Python script
    const scriptPath = path.join(__dirname, 'ai_career_engine.py');
    
    // Spawn Python process
    const pythonProcess = spawn(pythonPath, [scriptPath, 'predict_questions', JSON.stringify(resumeData)]);
    
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
      } else {
        try {
          const result = JSON.parse(stdoutData);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      }
    });
  });
};

module.exports = {
  parseResume,
  matchJob,
  getJobRecommendations,
  getTrendingSkills,
  predictFutureSkillsML,
  predictInterviewQuestions
};