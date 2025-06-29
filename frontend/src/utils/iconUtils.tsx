import React from 'react';
import type { IconType } from 'react-icons';

/**
 * Utility function to wrap react-icons components for React 19 compatibility
 * This ensures that icon components return valid JSX elements instead of ReactNode
 */
export const renderIcon = (IconComponent: IconType, props?: React.SVGProps<SVGSVGElement>): React.JSX.Element => {
  // Cast IconComponent to a compatible React component type
  const Component = IconComponent as React.ComponentType<React.SVGProps<SVGSVGElement>>;
  return React.createElement(Component, props);
};

/**
 * Higher-order component to wrap react-icons for React 19 compatibility
 */
export const createIconComponent = <T extends Record<string, unknown>>(IconComponent: React.ComponentType<T>) => {
  return (props: T): React.JSX.Element => {
    return React.createElement(IconComponent, props);
  };
};
