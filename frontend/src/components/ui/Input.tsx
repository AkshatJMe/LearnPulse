import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helpText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helpText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-900
              placeholder-gray-400 transition-all duration-200
              focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
              disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
              dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500
              dark:focus:ring-blue-900
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-900' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {helpText && !error && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
