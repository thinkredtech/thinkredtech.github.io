import React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  title: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link to="/docs" className="hover:text-primary transition-colors">
        📚 Docs
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>

          {item.path && index < items.length - 1 ? (
            <Link
              to={`/docs/${item.path}`}
              className="hover:text-primary transition-colors"
            >
              {item.title}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.title}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
