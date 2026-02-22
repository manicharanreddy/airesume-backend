export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { resumeText } = req.body;
      const wordCount = resumeText.split(/\s+/).length;
      
      // More comprehensive bias detection
      const biasPatterns = [
        {
          category: 'Gendered Language',
          patterns: [
            { term: 'manpower', suggestion: 'workforce or personnel' },
            { term: 'chairman', suggestion: 'chairperson' },
            { term: 'fireman', suggestion: 'firefighter' },
            { term: 'policeman', suggestion: 'police officer' },
            { term: 'stewardess', suggestion: 'flight attendant' },
            { term: 'housewife', suggestion: 'homemaker' },
            { term: 'businessman', suggestion: 'business person' }
          ]
        },
        {
          category: 'Age-Based Language',
          patterns: [
            { term: 'young', suggestion: 'early in career' },
            { term: 'old', suggestion: 'experienced' },
            { term: 'recent graduate', suggestion: 'new graduate' }
          ]
        },
        {
          category: 'Cultural Bias',
          patterns: [
            { term: 'native speaker', suggestion: 'fluent speaker' },
            { term: 'American', suggestion: 'US-based (when referring to location)' }
          ]
        }
      ];
      
      const foundBiasIssues = [];
      let correctedText = resumeText;
      
      biasPatterns.forEach(category => {
        category.patterns.forEach(pattern => {
          const regex = new RegExp(`\\b${pattern.term}\\b`, 'gi');
          const matches = resumeText.match(regex);
          if (matches) {
            foundBiasIssues.push({
              category: category.category,
              term: pattern.term,
              suggestion: pattern.suggestion,
              count: matches.length
            });
            
            // Apply correction to text
            correctedText = correctedText.replace(regex, pattern.suggestion);
          }
        });
      });
      
      // Gendered pronouns check
      const masculinePronouns = (resumeText.match(/\b(he|him|his)\b/gi) || []).length;
      const femininePronouns = (resumeText.match(/\b(she|her|hers)\b/gi) || []).length;
      
      const result = {
        wordCount: wordCount,
        biasIssues: foundBiasIssues,
        genderPronouns: {
          masculine: masculinePronouns,
          feminine: femininePronouns
        },
        suggestions: foundBiasIssues.map(issue => 
          `Replace "${issue.term}" with "${issue.suggestion}" (${issue.count} occurrence${issue.count > 1 ? 's' : ''})`
        ),
        correctedText: correctedText
      };
      
      res.json(result);
    } catch (error) {
      console.error('Bias check error:', error);
      res.status(500).json({ error: 'Failed to check bias: ' + error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}