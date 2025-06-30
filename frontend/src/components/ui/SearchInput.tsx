import React from "react";

interface SearchInputProps {
  label: string;
  placeholder?: string;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  className?: string;
  icon?: React.ReactNode;
}

const SearchInput: React.FC<SearchInputProps> = ({
  label,
  placeholder = "Search...",
  value,
  onChange,
  className = "",
  icon,
}) => {
  const defaultIcon = (
    <svg
      className="w-5 h-5 text-secondary/60"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  return (
    <div className={className}>
      <label
        htmlFor="search-input"
        className="block label-1 text-secondary mb-2 flex items-center"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id="search-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-white"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {icon || defaultIcon}
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
