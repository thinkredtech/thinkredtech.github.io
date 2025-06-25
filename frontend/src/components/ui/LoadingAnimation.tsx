import React from 'react';

interface LoadingAnimationProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent1' | 'accent2';
  className?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  type = 'spinner',
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-primary',
    accent1: 'text-accent1',
    accent2: 'text-accent2',
  };

  if (type === 'spinner') {
    return (
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin ${className}`}
      >
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`${sizeClasses[size]} ${colorClasses[color]} bg-current rounded-full animate-pulse`}
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      >
        <div className="w-full h-full bg-current rounded-full animate-ping opacity-75" />
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div
        className={`skeleton rounded ${className}`}
        style={{ width: '100%', height: '20px' }}
      />
    );
  }

  return null;
};

export const PageLoader: React.FC<{ message?: string }> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingAnimation
          type="spinner"
          size="lg"
          color="primary"
          className="mx-auto mb-4"
        />
        <p className="body-1-medium text-secondary font-medium">{message}</p>
      </div>
    </div>
  );
};

export const ContentLoader: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="h-48 bg-gray-200 skeleton"></div>
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 skeleton rounded"></div>
              <div className="h-4 bg-gray-200 skeleton rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 skeleton rounded w-1/2"></div>
              <div className="flex gap-2 mt-4">
                <div className="h-6 w-16 bg-gray-200 skeleton rounded-full"></div>
                <div className="h-6 w-20 bg-gray-200 skeleton rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProgressBar: React.FC<{
  progress: number;
  color?: 'primary' | 'accent1' | 'accent2';
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}> = ({
  progress,
  color = 'primary',
  height = 'md',
  animated = true,
  className = '',
}) => {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    primary: 'bg-primary',
    accent1: 'bg-accent1',
    accent2: 'bg-accent2',
  };

  return (
    <div
      className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[height]} ${className}`}
    >
      <div
        className={`${heightClasses[height]} ${colorClasses[color]} rounded-full transition-all duration-500 ${
          animated
            ? 'bg-gradient-to-r from-current to-current bg-size-200 animate-gradient'
            : ''
        }`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

export default LoadingAnimation;
