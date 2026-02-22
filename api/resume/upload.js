import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name for this module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Handle file upload using formidable
      const form = new formidable({
        // Use temporary directory for file uploads in Vercel
        uploadDir: '/tmp',
        keepExtensions: true,
        multiples: false,
        maxFileSize: 10 * 1024 * 1024, // 10MB limit
      });
      
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('File upload error:', err);
          return res.status(500).json({ 
            error: 'File upload failed', 
            details: err.message,
            code: err.code,
            type: 'FORMIDABLE_ERROR'
          });
        }
        
        if (!files.resume) {
          console.error('No file found in upload');
          return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const filePath = Array.isArray(files.resume) ? files.resume[0].filepath : files.resume.filepath;
        const fileName = Array.isArray(files.resume) ? files.resume[0].originalFilename : files.resume.originalFilename;
        const mimeType = Array.isArray(files.resume) ? files.resume[0].mimetype : files.resume.mimetype;
        
        console.log('File received:', {
          originalFilename: fileName,
          filepath: filePath,
          mimetype: mimeType
        });
        
        try {
          // Determine file type
          let fileType = 'text';
          if (mimeType === 'application/pdf') {
            fileType = 'pdf';
          } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            fileType = 'docx';
          } else {
            console.log('Detected file type:', mimeType);
          }
          
          console.log('Processing file as type:', fileType);
          
          // Path to Python executable (Vercel provides Python 3.9)
          const pythonPath = 'python3';
          
          // Path to Python script (relative to the API route)
          const scriptPath = join(process.cwd(), 'backend', 'utils', 'ai_career_engine.py');
          
          // Validate that the script exists
          if (!fs.existsSync(scriptPath)) {
            console.error('Python script not found at:', scriptPath);
            throw new Error('Python script not found');
          }

          // Spawn Python process to parse the resume
          const pythonProcess = spawn(pythonPath, [scriptPath, 'parse', filePath, fileType]);
          
          let stdoutData = '';
          let stderrData = '';
          
          pythonProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
          });
          
          pythonProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
          });
          
          pythonProcess.on('close', async (code) => {
            // Clean up uploaded file regardless of outcome
            if (filePath && fs.existsSync(filePath)) {
              try {
                await fsPromises.unlink(filePath);
                console.log('Cleaned up temp file:', filePath);
              } catch (cleanupErr) {
                console.error('Error cleaning up file:', cleanupErr);
              }
            }
            
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
                    success: true,
                    filename: fileName,
                    message: 'Resume uploaded and parsed successfully',
                    extractedInfo: result
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
          console.error('Resume processing error:', error);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process resume: ' + error.message });
          }
        }
      });
    } catch (generalError) {
      console.error('General upload handler error:', generalError);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Upload handler failed',
          details: generalError.message,
          type: 'HANDLER_ERROR'
        });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}