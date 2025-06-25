import React from 'react';

interface ResetButtonProps {
  onReset: () => void;
  className?: string;
  label?: string;
  title?: string;
}

const ResetButton: React.FC<ResetButtonProps> = ({
  onReset,
  className = '',
  label = 'Reset',
  title = 'Reset all filters',
}) => {
  const resetIcon = (
    <svg
      className="w-5 h-5 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );

  return (
    <button
      onClick={onReset}
      title={title}
      aria-label={title}
      className={`flex items-center justify-center px-3 py-3 bg-gray-100 text-secondary rounded-xl hover:bg-red-100 hover:text-red-600 transition-all duration-300 transform hover:scale-105 min-w-[50px] ${className}`}
    >
      {label === 'Reset' ? resetIcon : label}
    </button>
  );
};

export default ResetButton;
