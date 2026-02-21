import { getJobMatch } from '../../backend/controllers/resumeController';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return await getJobMatch(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}