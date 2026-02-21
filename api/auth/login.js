import { loginUser } from '../../backend/controllers/authController';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return await loginUser(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}