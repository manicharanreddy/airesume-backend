export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { jobRole, resumeSkills } = req.body;
      
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
      
      const matchResult = {
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
        ],
        job_title: jobRole,
        match_score: matchScore,
        matching_skills: relevantSkills,
        missing_skills: targetSkills.filter(skill => !skillsArray.some(userSkill => 
          userSkill.toLowerCase().includes(skill) || skill.includes(userSkill.toLowerCase())
        )).slice(0, 5),
        salary_data: {
          avg: 85000 + (matchScore * 500),
          min: 60000 + (matchScore * 200),
          max: 120000 + (matchScore * 400)
        }
      };
      
      res.json(matchResult);
    } catch (error) {
      console.error('Job matching error:', error);
      res.status(500).json({ error: 'Failed to calculate job match: ' + error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}