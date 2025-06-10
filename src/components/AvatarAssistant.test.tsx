import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AvatarAssistant from './AvatarAssistant';

// Mock the Three.js components
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'canvas-mock' }, children),
  useFrame: () => {},
  useThree: () => ({
    gl: { dispose: jest.fn() },
    scene: { traverse: jest.fn() },
    camera: {},
  }),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () =>
    React.createElement('div', { 'data-testid': 'orbit-controls-mock' }),
}));

describe('AvatarAssistant Component', () => {
  test('renders with disable button', () => {
    render(<AvatarAssistant />);

    // Check if settings/disable button is rendered
    const disableButton = screen.getByLabelText('Disable assistant');
    expect(disableButton).toBeInTheDocument();
  });

  test('can be disabled and enabled', () => {
    render(<AvatarAssistant />);

    // Initially the assistant should be visible
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();

    // Click the disable button
    const disableButton = screen.getByLabelText('Disable assistant');
    fireEvent.click(disableButton);

    // After disabling, the canvas should not be in the document
    expect(screen.queryByTestId('canvas-mock')).not.toBeInTheDocument();

    // The button should now be for enabling
    const enableButton = screen.getByLabelText('Enable assistant');
    expect(enableButton).toBeInTheDocument();

    // Click to enable again
    fireEvent.click(enableButton);

    // Canvas should be back
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
  });

  test('expands when clicked', () => {
    render(<AvatarAssistant />);

    // Initially the message should not be visible
    expect(
      screen.queryByText(/Hello! I'm ThinkRED's assistant/)
    ).not.toBeInTheDocument();

    // Click the assistant
    const assistantButton = screen.getByRole('button', { name: '' });
    fireEvent.click(assistantButton);

    // Message should now be visible
    expect(
      screen.getByText(/Hello! I'm ThinkRED's assistant/)
    ).toBeInTheDocument();

    // Close button should be available
    const closeButton = screen.getByText('Close');
    expect(closeButton).toBeInTheDocument();

    // Click close
    fireEvent.click(closeButton);

    // Message should be hidden again
    expect(
      screen.queryByText(/Hello! I'm ThinkRED's assistant/)
    ).not.toBeInTheDocument();
  });
});
