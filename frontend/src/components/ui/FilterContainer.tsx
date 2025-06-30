import React from "react";

interface FilterContainerProps {
  children: React.ReactNode;
  showStats?: boolean;
  totalItems?: number;
  filteredItems?: number;
  itemName?: string;
  className?: string;
  quickActions?: React.ReactNode;
}

const FilterContainer: React.FC<FilterContainerProps> = ({
  children,
  showStats = true,
  totalItems = 0,
  filteredItems = 0,
  itemName = "items",
  className = "",
  quickActions,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-8 mb-12 border border-gray-100 ${className}`}
    >
      {children}

      {(showStats || quickActions) && (
        <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
          {showStats && (
            <p className="text-secondary">
              Showing{" "}
              <span className="font-bold text-primary">{filteredItems}</span> of{" "}
              <span className="font-bold">{totalItems}</span> {itemName}
            </p>
          )}

          {quickActions && (
            <div className="flex items-center gap-2">{quickActions}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterContainer;
