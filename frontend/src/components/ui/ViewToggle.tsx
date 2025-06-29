import React from 'react';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onToggle: () => void;
  className?: string;
  label?: string;
  title?: string; // Added title prop
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onToggle,
  className = '',
  label = 'Toggle View',
  title, // Destructure title
}) => {
  const gridIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );

  const listIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );

  return (
    <button
      onClick={onToggle}
      title={title || label} // Use title prop, fallback to label
      aria-label={title || label} // Use title prop, fallback to label
      className={`flex items-center justify-center px-3 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 min-w-[50px] ${className}`}
    >
      {viewMode === 'grid' ? listIcon : gridIcon}
    </button>
  );
};

export default ViewToggle;
