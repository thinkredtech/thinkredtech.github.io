// Simplified test setup to avoid compatibility issues
import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock all components to avoid complex rendering issues
jest.mock('./components/features/layout/Layout', () => {
  return function MockLayout({ children }: { children?: ReactNode }) {
    return (
      <div data-testid="mock-layout">
        {children}
      </div>
    );
  };
});

jest.mock(
  './pages/HomePage',
  () => () => <div>Home Page</div>
);
jest.mock(
  './pages/AboutPage',
  () => () => <div>About Page</div>
);
jest.mock(
  './pages/ServicesPage',
  () => () => <div>Services Page</div>
);
jest.mock(
  './pages/PortfolioPage',
  () => () => <div>Portfolio Page</div>
);
jest.mock(
  './pages/ContactPage',
  () => () => <div>Contact Page</div>
);
jest.mock(
  './pages/BlogPage',
  () => () => <div>Blog Page</div>
);
jest.mock(
  './components/ui/AvatarAssistant',
  () => () => <div>Avatar Assistant</div>
);

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children?: ReactNode }) =>
    <div>{children}</div>,
  Routes: ({ children }: { children?: ReactNode }) =>
    <div>{children}</div>,
  Route: ({ path, element }: { path: string; element: ReactNode }) =>
    <div data-testid={`route-${path}`}>{element}</div>,
}));

describe('App', () => {
  test('renders without crashing', () => {
    render(<App />);
    // Basic test just to ensure the app renders without errors
  });
});
