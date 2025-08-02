import React from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterProps {
  label: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Filter: React.FC<FilterProps> = ({
  label,
  icon,
  options,
  value,
  onChange,
  placeholder = "All",
  className = "",
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="block label-1 text-secondary mb-2">
        {icon && <span className="inline-block mr-2">{icon}</span>}
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={label}
        title={label}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
