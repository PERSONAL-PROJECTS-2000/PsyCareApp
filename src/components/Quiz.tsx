import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  isImportant: boolean;
  explanation: string;
}

const mentalHealthQuestions: Question[] = [
  {
    id: 1,
    question: "What is the most effective first step in managing anxiety?",
    options: ["Avoiding triggers", "Deep breathing exercises", "Medication", "Isolation"],
    correctAnswer: 1,
    isImportant: true,
    explanation: "Deep breathing exercises help activate the parasympathetic nervous system, reducing anxiety symptoms."
  },
  {
    id: 2,
    question: "How many hours of sleep do adults typically need for optimal mental health?",
    options: ["5-6 hours", "7-9 hours", "10-12 hours", "4-5 hours"],
    correctAnswer: 1,
    isImportant: false,
    explanation: "Adults need 7-9 hours of quality sleep for optimal mental and physical health."
  },
  {
    id: 3,
    question: "Which activity is proven to reduce symptoms of depression?",
    options: ["Watching TV", "Regular exercise", "Eating more", "Sleeping longer"],
    correctAnswer: 1,
    isImportant: true,
    explanation: "Regular exercise releases endorphins and has been proven to reduce depression symptoms."
  },
  {
    id: 4,
    question: "What is mindfulness meditation primarily focused on?",
    options: ["Past events", "Future planning", "Present moment awareness", "Problem solving"],
    correctAnswer: 2,
    isImportant: true,
    explanation: "Mindfulness meditation focuses on present moment awareness without judgment."
  },
  {
    id: 5,
    question: "Which is a healthy coping mechanism for stress?",
    options: ["Substance use", "Social isolation", "Journaling", "Overeating"],
    correctAnswer: 2,
    isImportant: false,
    explanation: "Journaling helps process emotions and thoughts in a healthy way."
  },
  {
    id: 6,
    question: "What percentage of people experience mental health issues in their lifetime?",
    options: ["10%", "25%", "50%", "75%"],
    correctAnswer: 1,
    isImportant: false,
    explanation: "Approximately 1 in 4 people experience mental health issues in their lifetime."
  },
  {
    id: 7,
    question: "Which neurotransmitter is often called the 'happiness chemical'?",
    options: ["Dopamine", "Serotonin", "Cortisol", "Adrenaline"],
    correctAnswer: 1,
    isImportant: false,
    explanation: "Serotonin is often called the happiness chemical as it regulates mood and well-being."
  },
  {
    id: 8,
    question: "What is the recommended frequency for mental health check-ins?",
    options: ["Once a year", "Monthly", "Weekly", "Daily"],
    correctAnswer: 2,
    isImportant: true,
    explanation: "Weekly mental health check-ins help maintain awareness of your emotional state."
  },
  {
    id: 9,
    question: "Which is NOT a sign of good mental health?",
    options: ["Emotional resilience", "Perfectionism", "Healthy relationships", "Self-awareness"],
    correctAnswer: 1,
    isImportant: false,
    explanation: "Perfectionism can be harmful to mental health, while the others are positive signs."
  },
  {
    id: 10,
    question: "What is the most important factor in recovery from mental health challenges?",
    options: ["Medication only", "Professional support", "Family support", "Self-care"],
    correctAnswer: 1,
    isImportant: true,
    explanation: "Professional support provides the expertise and guidance needed for effective recovery."
  }
];

const Quiz: React.FC = () => {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const generateRandomQuiz = () => {
    const questionCount = Math.floor(Math.random() * 6) + 5; // 5-10 questions
    const shuffled = [...mentalHealthQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, questionCount);
    setCurrentQuestions(selected);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleEndQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    currentQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "Excellent! You have great mental health awareness! 🌟";
    if (percentage >= 60) return "Good job! You're on the right track! 👍";
    if (percentage >= 40) return "Not bad! Keep learning about mental health! 📚";
    return "Keep exploring mental health topics to improve your knowledge! 💪";
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setShowResults(false);
    setCurrentQuestions([]);
    setSelectedAnswers([]);
    setCurrentQuestionIndex(0);
  };

  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Mental Health Quiz</h3>
          <p className="text-gray-600 mb-6">
            Test your knowledge about mental health and wellness. Each quiz contains 5-10 randomly selected questions.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateRandomQuiz}
            className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Quiz
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const total = currentQuestions.length;

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quiz Results</h3>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-pink-500 mb-2">
              {score}/{total}
            </div>
            <div className="text-lg text-gray-600 mb-4">
              {getScoreMessage(score, total)}
            </div>
          </div>

          <div className="space-y-4">
            {currentQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/40 rounded-2xl p-4 border border-white/30"
              >
                <div className="flex items-start space-x-2 mb-2">
                  {question.isImportant && (
                    <Star className="text-yellow-500 fill-current" size={20} />
                  )}
                  <h4 className="font-semibold text-gray-800 flex-1">
                    {index + 1}. {question.question}
                  </h4>
                </div>
                
                <div className="space-y-2 mb-3">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded-lg text-sm ${
                        optionIndex === question.correctAnswer
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : selectedAnswers[index] === optionIndex
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {option}
                      {optionIndex === question.correctAnswer && ' ✓'}
                      {selectedAnswers[index] === optionIndex && optionIndex !== question.correctAnswer && ' ✗'}
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex space-x-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetQuiz}
              className="flex-1 bg-gradient-to-r from-blue-400 to-indigo-400 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <RotateCcw size={20} />
              <span>Take Another Quiz</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
  const hasSelectedAnswer = selectedAnswers[currentQuestionIndex] !== undefined;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Mental Health Quiz</h3>
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {currentQuestions.length}
          </div>
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-400 to-rose-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-start space-x-3">
            {currentQuestion.isImportant && (
              <Star className="text-yellow-500 fill-current mt-1" size={24} />
            )}
            <h4 className="text-xl font-semibold text-gray-800 leading-relaxed">
              {currentQuestion.question}
            </h4>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-pink-400 bg-pink-50 text-pink-800'
                    : 'border-gray-200 bg-white/40 text-gray-700 hover:border-pink-200 hover:bg-pink-25'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-pink-400 bg-pink-400'
                      : 'border-gray-300'
                  }`} />
                  <span className="font-medium">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-between pt-6">
            <div className="text-sm text-gray-500">
              {currentQuestion.isImportant && (
                <span className="flex items-center space-x-1">
                  <Star className="text-yellow-500 fill-current" size={16} />
                  <span>Important Question</span>
                </span>
              )}
            </div>
            
            <div className="space-x-3">
              {!isLastQuestion ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  disabled={!hasSelectedAnswer}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    hasSelectedAnswer
                      ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEndQuiz}
                  disabled={!hasSelectedAnswer}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    hasSelectedAnswer
                      ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  End Quiz
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Quiz;