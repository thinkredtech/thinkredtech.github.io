import React from 'react';

/**
 * Utility function to wrap react-icons components for React 19 compatibility
 * This ensures that icon components return valid JSX elements instead of ReactNode
 */
export const renderIcon = (
  IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>,
  props?: React.SVGProps<SVGSVGElement>
): React.JSX.Element => {
  return React.createElement(IconComponent, props);
};

/**
 * Higher-order component to wrap react-icons for React 19 compatibility
 */
export const createIconComponent = <T extends Record<string, unknown>>(
  IconComponent: React.ComponentType<T>
) => {
  return (props: T): React.JSX.Element => {
    return React.createElement(IconComponent, props);
  };
};
