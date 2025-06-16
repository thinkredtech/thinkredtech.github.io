// Professional SVG Icons for ThinkRED Technologies
import React from 'react';

interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const getIconSize = (size?: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return 'w-4 h-4';
    case 'lg':
      return 'w-8 h-8';
    case 'md':
    default:
      return 'w-6 h-6';
  }
};

export const ContactIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export const ServicesIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

export const PortfolioIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

export const BlogIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export const CareerIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6v10a2 2 0 002 2h4a2 2 0 002-2V6"
    />
  </svg>
);

export const AboutIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

export const WebDevIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
);

export const AIIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

export const PlatformIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    />
  </svg>
);

export const DevOpsIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const TechIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

export const RocketIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

export const ArticleIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

export const InsightIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

export const QuoteIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const TargetIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 1.657-2.657 1.657-2.657A8 8 0 1017.657 18.657z"
    />
  </svg>
);

export const LearnIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

export const BuildIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

export const SparkleIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
      clipRule="evenodd"
    />
  </svg>
);

export const TheaterIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12h6m-6 4h6"
    />
  </svg>
);

export const SleepIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

// Technology Icons for About Page
export const ReactIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 13.5c-.75 0-1.5-.67-1.5-1.5s.75-1.5 1.5-1.5 1.5.67 1.5 1.5-.75 1.5-1.5 1.5zm6.03-4.97c-.42-1.74-1.18-3.18-2.16-4.16-.35-.35-.73-.64-1.13-.87C13.73 2.84 12.89 2.5 12 2.5s-1.73.34-2.74 1c-.4.23-.78.52-1.13.87-.98.98-1.74 2.42-2.16 4.16-.33 1.37-.33 2.84 0 4.21.42 1.74 1.18 3.18 2.16 4.16.35.35.73.64 1.13.87 1.01.66 1.85 1 2.74 1s1.73-.34 2.74-1c.4-.23.78-.52 1.13-.87.98-.98 1.74-2.42 2.16-4.16.33-1.37.33-2.84 0-4.21zm-1.74 7.97c-.29.29-.61.53-.95.71-.82.54-1.55.79-2.34.79s-1.52-.25-2.34-.79c-.34-.18-.66-.42-.95-.71-.75-.75-1.34-1.83-1.68-3.07-.26-1.01-.26-2.08 0-3.09.34-1.24.93-2.32 1.68-3.07.29-.29.61-.53.95-.71.82-.54 1.55-.79 2.34-.79s1.52.25 2.34.79c.34.18.66.42.95.71.75.75 1.34 1.83 1.68 3.07.26 1.01.26 2.08 0 3.09-.34 1.24-.93 2.32-1.68 3.07z" />
    <ellipse
      cx="12"
      cy="12"
      rx="8.5"
      ry="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="8.5"
      ry="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      transform="rotate(60 12 12)"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="8.5"
      ry="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      transform="rotate(-60 12 12)"
    />
  </svg>
);

export const VueIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M2 3l10 18L22 3h-4l-6 10.6L6 3H2zm18 0l-8 14.4L4 3h2l6 10.6L18 3h2z" />
  </svg>
);

export const AngularIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2.5L3 6l1.5 13 7.5 4 7.5-4L21 6l-9-3.5zm0 2.2l6.2 2.2-1.1 9.1-5.1 2.7-5.1-2.7L5.8 6.9L12 4.7zm0 2.8l-4.2 8.5h1.7l.8-2h3.4l.8 2h1.7L12 7.5zm-1.5 4.5L12 8l1.5 1.8h-3z" />
  </svg>
);

export const NodeIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l7.44 4.3c.46.26 1.04.26 1.5 0l7.44-4.3c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36L12.78 2.05c-.23-.13-.51-.2-.78-.2zm0 2.3L17.5 7.5v9L12 19.85 6.5 16.5v-9L12 4.15z" />
  </svg>
);

export const PythonIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.26-.02.21-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25c-.2 0-.37.09-.5.25-.12.16-.18.38-.18.66 0 .28.06.5.18.66.13.16.3.25.5.25.2 0 .37-.09.5-.25.12-.16.18-.38.18-.66 0-.28-.06-.5-.18-.66-.13-.16-.3-.25-.5-.25z" />
  </svg>
);

export const JavaIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.639" />
  </svg>
);

export const GoIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07H1.811zM.047 11.306c-.047 0-.058-.023-.035-.058l.245-.316c.024-.035.082-.058.129-.058H5.77c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.082-.105.082H.047zM2.828 12.394c-.047 0-.058-.024-.035-.059l.163-.292c.023-.035.070-.070.117-.070h4.095c.047 0 .070.035.070.082l-.023.245c0 .058-.047.094-.105.094H2.828zM21.5 12.64c.362 0 .625.07.789.21.164.141.246.331.246.571 0 .234-.082.422-.246.563-.164.14-.427.21-.789.21h-.84v1.107h-.473V12.64h1.313zm-.473.375v1.05h.84c.293 0 .439-.117.439-.35 0-.234-.146-.35-.439-.35h-.84v-.35zM18.934 14.652h1.617v.398h-2.09V12.64h2.067v.398h-1.594v.656h1.5v.387h-1.5v.571zM16.6 12.64c.375 0 .668.070.88.21.21.141.315.344.315.609 0 .187-.047.344-.14.469-.094.125-.234.211-.422.258l.726 1.055h-.539l-.668-.973h-.769v.973h-.473V12.64H16.6zm-.473.375v1.078h.562c.293 0 .438-.125.438-.375s-.145-.375-.438-.375h-.562v-.328zM13.063 13.555c0-.469.141-.847.422-1.133.282-.286.658-.43 1.129-.43.468 0 .844.144 1.125.43.282.286.422.664.422 1.133 0 .469-.14.847-.422 1.133-.281.286-.657.43-1.125.43-.471 0-.847-.144-1.129-.43-.281-.286-.422-.664-.422-1.133zm.473 0c0 .328.094.594.281.797.188.203.438.305.75.305.313 0 .563-.102.75-.305.188-.203.282-.469.282-.797 0-.328-.094-.594-.282-.797-.187-.203-.437-.305-.75-.305-.312 0-.562.102-.75.305-.187.203-.281.469-.281.797zM9.375 12.64c.469 0 .844.117 1.125.352.282.234.422.55.422.949 0 .398-.14.715-.422.949-.281.235-.656.352-1.125.352h-1.313V12.64h1.313zm-.473.375v1.547h.84c.281 0 .504-.078.668-.234.164-.157.246-.375.246-.657 0-.281-.082-.5-.246-.656-.164-.157-.387-.234-.668-.234h-.84v-.234z" />
  </svg>
);

export const TypeScriptIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.213.776.213 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
  </svg>
);

export const DockerIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983 0 1.954-.103 2.892-.307a12.478 12.478 0 003.331-1.307 10.692 10.692 0 002.368-2.3A9.543 9.543 0 0017.9 14.75h.123c1.26 0 2.02-.507 2.348-.931.191-.33.328-.701.404-1.09l.1-.531-.202-.197z" />
  </svg>
);

export const PostgreSQLIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M23.111 5.3c-.174-.532-.454-1.019-.826-1.433-.372-.415-.832-.754-1.354-1.001C19.487 2.488 17.735 2.25 15.88 2.25c-1.855 0-3.607.238-5.051.616-.522.247-.982.586-1.354 1.001-.372.414-.652.901-.826 1.433-.326.999-.526 2.112-.583 3.298C7.792 8.948 7.5 9.348 7.5 9.75c0 .402.292.802.566 1.152.057 1.186.257 2.299.583 3.298.174.532.454 1.019.826 1.433.372.415.832.754 1.354 1.001 1.444.378 3.196.616 5.051.616 1.855 0 3.607-.238 5.051-.616.522-.247.982-.586 1.354-1.001.372-.414.652-.901.826-1.433.326-.999.526-2.112.583-3.298.274-.35.566-.75.566-1.152 0-.402-.292-.802-.566-1.152-.057-1.186-.257-2.299-.583-3.298zm-7.987 9.7c-2.18 0-3.945-.985-3.945-2.2 0-1.215 1.765-2.2 3.945-2.2s3.945.985 3.945 2.2c0 1.215-1.765 2.2-3.945 2.2z" />
  </svg>
);

export const MongoDBIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184C10.616 2.133 7.59 4.723 6.142 9.555c-1.482 4.957-.625 9.674 2.625 13.015.074-.433.155-.417.409-.417.25 0 .331-.016.409.417 3.25-3.341 4.107-8.058 2.608-13.015z" />
  </svg>
);

export const AWSIcon: React.FC<IconProps> = ({
  className = '',
  size = 'md',
}) => (
  <svg
    className={`${getIconSize(size)} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M6.763 10.036c0 .296.032.535.088.719.064.184.144.368.256.551.04.061.056.120.056.176 0 .08-.048.16-.144.24l-.48.32c-.056.04-.112.056-.168.056-.08 0-.16-.04-.24-.104a2.157 2.157 0 01-.256-.336 6.193 6.193 0 01-.24-.4c-.592.696-1.336 1.048-2.24 1.048-.64 0-1.152-.184-1.536-.552-.384-.368-.576-.859-.576-1.456 0-.648.232-1.176.696-1.584.464-.408 1.08-.616 1.856-.616.256 0 .528.024.808.064.288.048.584.112.888.2v-.648c0-.68-.144-1.155-.424-1.424-.288-.27-.776-.4-1.472-.4-.32 0-.648.040-.984.104-.336.072-.664.168-.984.288-.144.064-.256.104-.328.128-.072.016-.128.024-.168.024-.112 0-.168-.08-.168-.248v-.384c0-.128.016-.224.056-.288.04-.064.104-.128.192-.184.32-.168.704-.304 1.16-.416.456-.112.944-.168 1.48-.168.832 0 1.432.136 1.808.408.368.272.552.704.552 1.296v1.7zm-2.416 1.16c.352 0 .72-.064 1.104-.184.384-.128.712-.336.992-.624.168-.176.296-.368.376-.584.08-.216.128-.464.128-.736v-.36a6.19 6.19 0 00-.712-.168 7.861 7.861 0 00-.768-.056c-.52 0-.904.104-1.16.304-.256.2-.384.488-.384.856 0 .336.088.592.256.776.168.184.424.276.768.276zm4.832 1.896c-.144 0-.24-.024-.304-.08-.064-.048-.12-.144-.168-.288L6.224 3.992c-.048-.152-.072-.248-.072-.296 0-.12.064-.184.192-.184h.776c.152 0 .256.024.32.08.064.048.112.144.16.288l1.696 6.672 1.568-6.672c.048-.152.096-.24.16-.288.064-.056.176-.08.328-.08h.64c.152 0 .256.024.328.08.064.048.12.144.16.288l1.584 6.76 1.752-6.76c.048-.152.104-.24.16-.288.064-.056.168-.08.32-.08h.736c.128 0 .2.064.2.184 0 .04-.008.08-.024.128-.016.048-.04.12-.08.208L14.12 12.72c-.048.152-.104.24-.168.288-.064.056-.168.08-.304.08h-.688c-.152 0-.256-.024-.328-.08-.064-.056-.12-.144-.16-.296L11.04 6.344l-1.424 6.288c-.048.152-.096.24-.16.296-.064.056-.176.08-.328.08h-.688zm7.424.384c-.432 0-.864-.048-1.296-.144-.432-.096-.768-.2-.984-.312-.128-.064-.216-.136-.256-.2-.04-.064-.064-.128-.064-.2v-.4c0-.168.064-.248.184-.248.048 0 .096.008.152.032.048.016.12.048.2.08.28.128.584.224.912.296.336.064.664.104 1.008.104.568 0 1.008-.104 1.32-.304.312-.2.472-.48.472-.832 0-.248-.072-.456-.216-.624-.144-.168-.408-.336-.792-.488L16.8 7.616c-.632-.2-1.096-.496-1.384-.888-.288-.392-.432-.824-.432-1.296 0-.368.08-.696.232-1 .152-.296.36-.552.624-.768.264-.216.576-.384.936-.504.36-.12.744-.184 1.16-.184.192 0 .392.016.6.04.208.032.4.072.584.12.176.048.344.104.504.16.16.064.288.128.384.2.096.064.168.136.216.2.048.072.072.152.072.248v.384c0 .168-.064.248-.184.248-.064 0-.16-.024-.288-.08a4.49 4.49 0 00-1.328-.376c-.52 0-.936.088-1.248.272-.312.184-.472.432-.472.744 0 .248.08.456.24.624.16.168.448.336.864.504l1.72.552c.624.2 1.072.48 1.344.848.272.368.408.784.408 1.248 0 .384-.072.728-.224 1.032-.144.304-.344.568-.6.792-.256.224-.56.4-.928.528-.368.128-.768.192-1.2.192z" />
  </svg>
);
