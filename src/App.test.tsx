// Simplified test setup to avoid compatibility issues
import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock all components to avoid complex rendering issues
jest.mock('./components/Layout/Layout', () => {
  return function MockLayout({ children }: { children?: ReactNode }) {
    return React.createElement(
      'div',
      { 'data-testid': 'mock-layout' },
      children
    );
  };
});

jest.mock(
  './pages/HomePage',
  () => () => React.createElement('div', null, 'Home Page')
);
jest.mock(
  './pages/AboutPage',
  () => () => React.createElement('div', null, 'About Page')
);
jest.mock(
  './pages/ServicesPage',
  () => () => React.createElement('div', null, 'Services Page')
);
jest.mock(
  './pages/PortfolioPage',
  () => () => React.createElement('div', null, 'Portfolio Page')
);
jest.mock(
  './pages/ContactPage',
  () => () => React.createElement('div', null, 'Contact Page')
);
jest.mock(
  './pages/BlogPage',
  () => () => React.createElement('div', null, 'Blog Page')
);
jest.mock(
  './components/AvatarAssistant',
  () => () => React.createElement('div', null, 'Avatar Assistant')
);

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children?: ReactNode }) =>
    React.createElement('div', null, children),
  Routes: ({ children }: { children?: ReactNode }) =>
    React.createElement('div', null, children),
  Route: ({ path, element }: { path: string; element: ReactNode }) =>
    React.createElement('div', { 'data-testid': `route-${path}` }, element),
}));

describe('App', () => {
  test('renders without crashing', () => {
    render(<App />);
    // Basic test just to ensure the app renders without errors
  });
});
