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
    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 32 32">
      <path d="M22.5,9A7.4522,7.4522,0,0,0,16,12.792V8H14v8h8V14H17.6167A5.4941,5.4941,0,1,1,22.5,22H22v2h.5a7.5,7.5,0,0,0,0-15Z" />
      <path d="M26,6H4V9.171l7.4142,7.4143L12,17.171V26h4V24h2v2a2,2,0,0,1-2,2H12a2,2,0,0,1-2-2V18L2.5858,10.5853A2,2,0,0,1,2,9.171V6A2,2,0,0,1,4,4H26Z" />
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
