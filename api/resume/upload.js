// Import necessary modules
import formidable from 'formidable';
import fs from 'fs';
import { uploadResume } from '../../backend/controllers/resumeController';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Handle file upload using formidable
    const form = new formidable.IncomingForm();
    form.uploadDir = './uploads';
    form.keepExtensions = true;
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed' });
      }
      
      // Create a mock req object for the controller
      const mockReq = {
        file: files.resume ? {
          path: files.resume.filepath,
          filename: files.resume.originalFilename,
          mimetype: files.resume.mimetype
        } : null,
        body: fields
      };
      
      // Create a mock res object
      const mockRes = {
        status: (code) => ({
          json: (data) => {
            res.status(code).json(data);
          }
        })
      };
      
      try {
        await uploadResume(mockReq, mockRes);
      } catch (error) {
        res.status(500).json({ error: error.message });
      } finally {
        // Clean up uploaded file
        if (files.resume && fs.existsSync(files.resume.filepath)) {
          fs.unlinkSync(files.resume.filepath);
        }
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}