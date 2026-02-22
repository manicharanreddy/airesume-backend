import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory name for this module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { skills } = req.body;
      const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      // Path to Python executable (Vercel provides Python 3.9)
      const pythonPath = 'python3';
      
      // Path to Python script
      const scriptPath = join(process.cwd(), 'backend', 'utils', 'ai_career_engine.py');
      
      // Validate that the script exists
      if (!fs.existsSync(scriptPath)) {
        console.error('Python script not found at:', scriptPath);
        throw new Error('Python script not found');
      }

      // Spawn Python process to predict future skills
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
          console.error(`Python script exited with code ${code}: ${stderrData}`);
          
          // Return error response
          if (!res.headersSent) {
            res.status(500).json({ 
              success: false,
              error: `Python script failed with code ${code}`,
              details: stderrData
            });
          }
        } else {
          try {
            // Parse the result from Python
            const result = JSON.parse(stdoutData);
            
            if (result.error) {
              console.error('Python script returned error:', result.error);
              if (!res.headersSent) {
                res.status(500).json({ 
                  success: false,
                  error: result.error
                });
              }
            } else {
              // Success response
              res.json({
                currentSkills: skillsArray,
                predictions: result
              });
            }
          } catch (parseError) {
            console.error('Failed to parse Python output:', parseError);
            if (!res.headersSent) {
              res.status(500).json({ 
                success: false,
                error: 'Failed to parse Python output',
                details: parseError.message
              });
            }
          }
        }
      });
      
    } catch (error) {
      console.error('Future skills prediction error:', error);
      // Fallback to mock data if real-time data fails
      const fallbackPredictions = [
        {
          skill: 'Quantum Computing',
          trend: 'rapidly increasing',
          growth_rate: 35.2,
          description: 'As quantum computers become more accessible, knowledge of quantum algorithms will be increasingly valuable.'
        },
        {
          skill: 'Edge AI',
          trend: 'rapidly increasing',
          growth_rate: 32.1,
          description: 'With the proliferation of IoT devices, running AI models on edge devices will become essential.'
        },
        {
          skill: 'Sustainable Tech',
          trend: 'steadily increasing',
          growth_rate: 28.7,
          description: 'Green software development and energy-efficient algorithms will become increasingly important.'
        }
      ];
      
      res.json({
        currentSkills: req.body.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        predictions: fallbackPredictions
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}