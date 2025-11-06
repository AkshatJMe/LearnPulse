import React, { useState } from 'react';
import { Card, Button, Badge } from '../ui';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface QuizQuestion {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

interface QuizQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: string, selectedOption: number) => void;
  selectedAnswer?: number;
  showCorrect?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  selectedAnswer,
  showCorrect = false,
}) => {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Question {questionNumber} of {totalQuestions}
        </h3>
        <Badge variant="primary">{Math.round((questionNumber / totalQuestions) * 100)}%</Badge>
      </div>

      <p className="text-gray-800 dark:text-gray-200 mb-4">{question.questionText}</p>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showCheck = showCorrect && isCorrect;
          const showX = showCorrect && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => onAnswer(question._id, index)}
              disabled={showCorrect}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all duration-200
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }
                ${showCorrect && isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
                ${showCorrect && showX ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                ${showCorrect ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">{option}</span>
                {showCheck && <CheckCircle className="text-green-500" size={20} />}
                {showX && <XCircle className="text-red-500" size={20} />}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuizQuestion;
