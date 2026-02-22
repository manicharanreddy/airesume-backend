export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const resumeData = req.body;
      
      // Fallback: Generate mock interview questions based on skills
      const skills = resumeData.skills || [];
      const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
      
      // Sample interview questions based on common skills
      const skillBasedQuestions = {
        'javascript': [
          'Explain the difference between let, const, and var.',
          'What are closures in JavaScript?',
          'How does the event loop work in JavaScript?'
        ],
        'react': [
          'What are React hooks and how do they work?',
          'Explain the virtual DOM concept.',
          'How do you optimize React component performance?'
        ],
        'python': [
          'What are Python decorators?',
          'Explain the difference between lists and tuples.',
          'What is the Global Interpreter Lock (GIL)?'
        ],
        'node.js': [
          'How does Node.js handle asynchronous operations?',
          'What are streams in Node.js?',
          'Explain the event-driven architecture in Node.js.'
        ],
        'database': [
          'What is the difference between SQL and NoSQL databases?',
          'Explain ACID properties in database transactions.',
          'What are database indexes and how do they work?'
        ]
      };
      
      // Generate questions based on provided skills
      let questions = [];
      skillsArray.forEach(skill => {
        const skillKey = skill.toLowerCase().trim();
        if (skillBasedQuestions[skillKey]) {
          questions = questions.concat(skillBasedQuestions[skillKey]);
        }
      });
      
      // Add some general questions if no skill-specific ones were found
      if (questions.length === 0) {
        questions = [
          'Tell us about yourself and your background.',
          'Why are you interested in this position?',
          'What are your strengths and weaknesses?',
          'Describe a challenging project you worked on.',
          'How do you stay updated with the latest technology trends?'
        ];
      }
      
      // Limit to 10 questions max
      questions = questions.slice(0, 10);
      
      // Add categories and difficulty levels
      const categorizedQuestions = questions.map((question, index) => {
        return {
          id: index + 1,
          question: question,
          category: skillsArray.length > 0 ? skillsArray[0] : 'General',
          difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)]
        };
      });
      
      res.json({
        questions: categorizedQuestions
      });
    } catch (error) {
      console.error('Interview question prediction error:', error);
      res.status(500).json({ error: 'Failed to predict interview questions: ' + error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}