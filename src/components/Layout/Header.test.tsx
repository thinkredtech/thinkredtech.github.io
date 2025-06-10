import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

// Mock the navigation links
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({
    to,
    children,
    className,
  }: {
    to: string;
    children: React.ReactNode;
    className?: string;
  }) =>
    React.createElement(
      'a',
      { href: to, className, 'data-testid': `link-${to}` },
      children
    ),
}));

describe('Header Component', () => {
  test('renders logo and navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Check if logo is rendered
    const logo = screen.getByAltText('ThinkRED Logo');
    expect(logo).toBeInTheDocument();

    // Check if navigation links are rendered
    expect(screen.getByTestId('link-/')).toBeInTheDocument();
    expect(screen.getByTestId('link-/about')).toBeInTheDocument();
    expect(screen.getByTestId('link-/services')).toBeInTheDocument();
    expect(screen.getByTestId('link-/portfolio')).toBeInTheDocument();
    expect(screen.getByTestId('link-/blog')).toBeInTheDocument();
    expect(screen.getByTestId('link-/contact')).toBeInTheDocument();
  });

  test('mobile menu toggle works', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Mobile menu should be hidden initially
    const mobileMenu = screen.queryByRole('menu');
    expect(mobileMenu).not.toBeVisible();

    // Click the mobile menu button
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);

    // Mobile menu should be visible after clicking
    expect(mobileMenu).toBeVisible();

    // Click the menu button again to close
    fireEvent.click(menuButton);

    // Mobile menu should be hidden again
    expect(mobileMenu).not.toBeVisible();
  });
});
