import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

// Mock the navigation links
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
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

describe('Footer Component', () => {
  test('renders logo and company information', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check if logo is rendered
    const logo = screen.getByAltText('ThinkRED Logo');
    expect(logo).toBeInTheDocument();

    // Check if company description is rendered
    expect(
      screen.getByText(/ThinkRED Technologies simplifies technology/i)
    ).toBeInTheDocument();

    // Check if copyright notice is rendered
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(
        new RegExp(`© ${currentYear} ThinkRED Technologies LLP`, 'i')
      )
    ).toBeInTheDocument();
  });

  test('renders all footer sections and links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check section headings
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();

    // Check important links
    expect(screen.getByTestId('link-/about')).toBeInTheDocument();
    expect(screen.getByTestId('link-/services')).toBeInTheDocument();
    expect(screen.getByTestId('link-/portfolio')).toBeInTheDocument();
    expect(screen.getByTestId('link-/blog')).toBeInTheDocument();
    expect(screen.getByTestId('link-/contact')).toBeInTheDocument();

    // Check social links
    expect(
      screen.getByTestId('link-https://github.com/thinkred-tech')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('link-https://linkedin.com/company/thinkred-tech')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('link-https://twitter.com/thinkred_tech')
    ).toBeInTheDocument();
  });

  test('renders legal links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check legal links
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Sitemap')).toBeInTheDocument();
  });
});
