import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../App';

describe('App Component', () => {
  it('renders the AI Nexus brand', () => {
    render(<App />);
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('renders the authentication form when not logged in', () => {
    render(<App />);
    expect(screen.getByText('Welcome to AI Nexus')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });
});
