import { getUserProfile } from '../../backend/controllers/authController';
import { protect } from '../../backend/middleware/authMiddleware';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Apply authentication middleware
    const authResult = await new Promise((resolve) => {
      const mockReq = { ...req };
      const mockRes = {
        status: (code) => ({ json: (data) => resolve({ error: data, status: code }) })
      };
      protect(mockReq, mockRes, () => resolve({ success: true }));
    });
    
    if (authResult.error) {
      return res.status(authResult.status).json(authResult.error);
    }
    
    return await getUserProfile(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}