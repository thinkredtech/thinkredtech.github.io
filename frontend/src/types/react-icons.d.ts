/**
 * React Icons Type Augmentation for React 19 Compatibility
 *
 * This provides a generic, scalable solution for React Icons compatibility
 * with React 19's new JSX runtime without hard-coding specific icon names.
 *
 * @see https://react-icons.github.io/react-icons/
 */

import { ComponentType, SVGProps } from 'react';

// Generic module declaration for all react-icons packages
declare module 'react-icons/*' {
  const content: ComponentType<SVGProps<SVGSVGElement>>;
  export = content;
}

// Specific module declarations for main icon families
declare module 'react-icons/fa' {
  export * from 'react-icons/fa';
}

declare module 'react-icons/fa6' {
  export * from 'react-icons/fa6';
}

declare module 'react-icons/si' {
  export * from 'react-icons/si';
}

declare module 'react-icons/md' {
  export * from 'react-icons/md';
}

declare module 'react-icons/hi' {
  export * from 'react-icons/hi';
}

declare module 'react-icons/hi2' {
  export * from 'react-icons/hi2';
}

declare module 'react-icons/io' {
  export * from 'react-icons/io';
}

declare module 'react-icons/io5' {
  export * from 'react-icons/io5';
}

declare module 'react-icons/bs' {
  export * from 'react-icons/bs';
}

declare module 'react-icons/ai' {
  export * from 'react-icons/ai';
}

declare module 'react-icons/fi' {
  export * from 'react-icons/fi';
}

declare module 'react-icons/gi' {
  export * from 'react-icons/gi';
}

declare module 'react-icons/go' {
  export * from 'react-icons/go';
}

declare module 'react-icons/gr' {
  export * from 'react-icons/gr';
}

declare module 'react-icons/ri' {
  export * from 'react-icons/ri';
}

declare module 'react-icons/tb' {
  export * from 'react-icons/tb';
}

declare module 'react-icons/ti' {
  export * from 'react-icons/ti';
}

declare module 'react-icons/vsc' {
  export * from 'react-icons/vsc';
}

declare module 'react-icons/wi' {
  export * from 'react-icons/wi';
}

declare module 'react-icons/cg' {
  export * from 'react-icons/cg';
}

declare module 'react-icons/im' {
  export * from 'react-icons/im';
}
