import React from 'react';
import { Card, Button, Rating } from '../ui';

interface QuizResultProps {
  score: number;
  totalPoints: number;
  timeSpent?: number;
  passingScore?: number;
  onRetake?: () => void;
  onExit?: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({
  score,
  totalPoints,
  timeSpent,
  passingScore = totalPoints * 0.6,
  onRetake,
  onExit,
}) => {
  const percentage = (score / totalPoints) * 100;
  const passed = score >= passingScore;

  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 70) return { grade: 'C', color: 'text-yellow-600' };
    if (percentage >= 60) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const { grade, color } = getGrade();

  return (
    <Card className="max-w-md mx-auto text-center space-y-6">
      {/* Status */}
      <div>
        <h2 className="text-2xl font-bold mb-2">
          {passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {passed ? 'You passed the quiz!' : 'You did not pass this time.'}
        </p>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${(percentage / 100) * (2 * Math.PI * 60)} ${2 * Math.PI * 60}`}
              className={passed ? 'text-green-500' : 'text-orange-500'}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${color}`}>{grade}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{percentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Score Details */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Your Score:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {score} / {totalPoints}
          </span>
        </div>
        {timeSpent && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Time Spent:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Passing Score:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {passingScore} / {totalPoints}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onRetake && (
          <Button variant="secondary" className="flex-1" onClick={onRetake}>
            Retake Quiz
          </Button>
        )}
        {onExit && (
          <Button variant="primary" className="flex-1" onClick={onExit}>
            Exit
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QuizResult;
