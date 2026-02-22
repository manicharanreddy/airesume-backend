import React, { useState, useEffect, useCallback } from 'react';
import { predictInterviewQuestions } from '../services/api';
import './InterviewPractice.css';

const InterviewPractice = ({ resumeData }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const fetchInterviewQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await predictInterviewQuestions(resumeData);
      setQuestions(response.data.questions || []);
      setTotalScore(response.data.questions ? response.data.questions.length * 10 : 0);
    } catch (error) {
      console.error('Error fetching interview questions:', error);
    } finally {
      setLoading(false);
    }
  }, [resumeData]);

  // Fetch interview questions when resume data is available
  useEffect(() => {
    if (resumeData) {
      fetchInterviewQuestions();
    }
  }, [resumeData, fetchInterviewQuestions]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startPractice = () => {
    if (questions.length > 0) {
      setPracticeMode(true);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setFeedback('');
      setScore(0);
      setTimer(0);
      setIsActive(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setFeedback('');
    } else {
      // End of practice
      setIsActive(false);
      setFeedback('Practice completed! Great job!');
    }
  };

  const submitAnswer = () => {
    // In a real implementation, this would use AI to analyze the answer
    // For now, we'll provide simulated feedback
    const simulatedFeedback = [
      "Great answer! You demonstrated strong knowledge of the subject.",
      "Good response, but consider providing more specific examples.",
      "Your answer shows understanding, but try to be more concise.",
      "Excellent point! That's exactly what interviewers look for.",
      "Good start, but you might want to elaborate on that further."
    ];
    
    const randomFeedback = simulatedFeedback[Math.floor(Math.random() * simulatedFeedback.length)];
    setFeedback(randomFeedback);
    setScore(score + 10); // Simulate scoring
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#10b981'; // green
      case 'medium': return '#f59e0b'; // yellow
      case 'hard': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'technical': return '💻';
      case 'behavioral': return '👥';
      case 'experience': return '💼';
      case 'project': return '🚀';
      case 'general': return '❓';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div className="interview-practice">
        <h2>Interview Practice</h2>
        <p>Loading interview questions based on your resume...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="interview-practice">
        <h2>Interview Practice</h2>
        <p>No interview questions available. Please upload a resume first.</p>
      </div>
    );
  }

  if (!practiceMode) {
    return (
      <div className="interview-practice">
        <h2>Interview Practice</h2>
        <p>Get ready to practice interview questions tailored to your resume!</p>
        
        <div className="questions-overview">
          <h3>📋 Questions Overview</h3>
          <div className="overview-stats">
            <div className="stat-card">
              <div className="stat-icon">❓</div>
              <div className="stat-value">{questions.length}</div>
              <div className="stat-label">Total Questions</div>
            </div>
          </div>
          <div className="question-categories">
            <h4>Categories Distribution:</h4>
            <div className="categories-grid">
              {['Technical', 'Behavioral', 'Experience', 'Project', 'General'].map(category => {
                const count = questions.filter(q => q.category === category).length;
                return count > 0 ? (
                  <div key={category} className="category-card">
                    <span className="category-icon">{getCategoryIcon(category)}</span>
                    <span className="category-name">{category}</span>
                    <span className="category-count">{count}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
        
        <button onClick={startPractice} className="start-practice-btn">
          Start Practice Session
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="interview-practice">
      <h2>Interview Practice</h2>
      
      <div className="practice-header">
        <div className="header-section">
          <div className="question-counter">
            <span className="current-question">{currentQuestionIndex + 1}</span>
            <span className="total-questions">/{questions.length}</span>
          </div>
          <div className="progress-container">
            <div className="progress-label">Progress</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="score-timer">
          <div className="score-card">
            <div className="score-value">{score}<span className="score-max">/{totalScore}</span></div>
            <div className="score-label">Score</div>
          </div>
          <div className="timer-card">
            <div className="timer-value">⏱️ {formatTime(timer)}</div>
            <div className="timer-label">Time</div>
          </div>
        </div>
      </div>
      
      {currentQuestion && (
        <div className="question-card">
          <div className="question-header">
            <div className="question-tags">
              <span className="category-tag" style={{ 
                backgroundColor: `rgba(${getDifficultyColor(currentQuestion.difficulty).replace('#', '')}, 0.1)`, 
                color: getDifficultyColor(currentQuestion.difficulty),
                border: `1px solid ${getDifficultyColor(currentQuestion.difficulty)}`
              }}>
                {getCategoryIcon(currentQuestion.category)} {currentQuestion.category}
              </span>
              <span className="difficulty-tag" style={{ 
                backgroundColor: `rgba(${getDifficultyColor(currentQuestion.difficulty).replace('#', '')}, 0.1)`, 
                color: getDifficultyColor(currentQuestion.difficulty),
                border: `1px solid ${getDifficultyColor(currentQuestion.difficulty)}`
              }}>
                {currentQuestion.difficulty}
              </span>
            </div>
          </div>
          <h3>{currentQuestion.question}</h3>
          
          <div className="answer-section">
            <label htmlFor="userAnswer">Your Answer:</label>
            <textarea
              id="userAnswer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows="6"
            />
            
            <div className="answer-actions">
              <button onClick={submitAnswer} disabled={!userAnswer.trim()}>
                Submit Answer
              </button>
              <button onClick={nextQuestion}>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Practice'}
              </button>
            </div>
          </div>
          
          {feedback && (
            <div className="feedback">
              <div className="feedback-header">
                <h4>💬 AI Feedback:</h4>
                <div className="feedback-score">
                  <span className="score-value">{Math.floor(Math.random() * 30) + 70}/100</span>
                </div>
              </div>
              <div className="feedback-content">
                <p>{feedback}</p>
                <div className="feedback-tips">
                  <h5>💡 Improvement Tips:</h5>
                  <ul>
                    <li>Consider providing more specific examples</li>
                    <li>Structure your response using the STAR method</li>
                    <li>Highlight your achievements and impact</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="practice-stats">
        <h4>Practice Statistics</h4>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{questions.length}</span>
            <span className="stat-label">Total Questions</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{currentQuestionIndex + 1}</span>
            <span className="stat-label">Answered</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{score}</span>
            <span className="stat-label">Points Earned</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{formatTime(timer)}</span>
            <span className="stat-label">Time Spent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPractice;