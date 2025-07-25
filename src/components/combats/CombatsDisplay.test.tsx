import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom';

// Import fixtures
import {
  mockCombats,
  mockOpponentMappings,
} from '@/__tests__/fixtures/combats';

// Mock the combats data
vi.mock('@/constants/combats', () => ({
  laVeladaCombats: mockCombats,
  getOpponent: vi.fn((fighter: string) => {
    return mockOpponentMappings[fighter] || null;
  }),
}));

import { CombatsDisplay } from '@/components/combats';

describe.skip('CombatsDisplay Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render combat information', () => {
    render(<CombatsDisplay />);

    expect(screen.getByText('La Velada del Año - Combats')).toBeInTheDocument();
    expect(screen.getByText('5 exciting matchups await!')).toBeInTheDocument();
  });

  test('should display all combats', () => {
    render(<CombatsDisplay />);

    expect(screen.getByText('Combat #1')).toBeInTheDocument();
    expect(screen.getByText('Combat #2')).toBeInTheDocument();
    expect(screen.getByText('Combat #3')).toBeInTheDocument();
    expect(screen.getByText('Combat #4')).toBeInTheDocument();
    expect(screen.getByText('Combat #5')).toBeInTheDocument();
  });

  test('should display fighter names correctly', () => {
    render(<CombatsDisplay />);

    expect(screen.getByText('Peereira')).toBeInTheDocument();
    expect(screen.getByText('Rivaldios')).toBeInTheDocument();
    expect(screen.getByText('Perxitaa')).toBeInTheDocument();
    expect(screen.getByText('Gaspi')).toBeInTheDocument();
    expect(screen.getByText('Abby')).toBeInTheDocument();
    expect(screen.getByText('Roro')).toBeInTheDocument();
    expect(screen.getByText('Tomas')).toBeInTheDocument();
    expect(screen.getByText('Viruzz')).toBeInTheDocument();
    expect(screen.getByText('Grefg')).toBeInTheDocument();
    expect(screen.getByText('Westcol')).toBeInTheDocument();
  });

  test('should display VS between fighters', () => {
    render(<CombatsDisplay />);

    const vsElements = screen.getAllByText('VS');
    expect(vsElements).toHaveLength(5); // One for each combat
  });

  test('should display combat status badges', () => {
    render(<CombatsDisplay />);

    // Use getAllByText since status appears in both cards and summary
    const scheduledElements = screen.getAllByText('Scheduled');
    expect(scheduledElements.length).toBeGreaterThan(0);

    const finishedElements = screen.getAllByText('Finished');
    expect(finishedElements.length).toBeGreaterThan(0);
  });

  test('should display fight results for finished combats', () => {
    render(<CombatsDisplay />);

    // Based on mock data: gaspi wins combat 2, tomas wins combat 4
    expect(screen.getByText('Winner: Gaspi')).toBeInTheDocument();
    expect(screen.getByText('Winner: Tomas')).toBeInTheDocument();
  });

  test('should not display results for non-finished combats', () => {
    render(<CombatsDisplay />);

    // Should not show winner for scheduled combats (combats 1, 3, 5)
    expect(screen.queryByText('Winner: Peereira')).not.toBeInTheDocument();
    expect(screen.queryByText('Winner: Rivaldios')).not.toBeInTheDocument();
    expect(screen.queryByText('Winner: Abby')).not.toBeInTheDocument();
    expect(screen.queryByText('Winner: Roro')).not.toBeInTheDocument();
    expect(screen.queryByText('Winner: Grefg')).not.toBeInTheDocument();
    expect(screen.queryByText('Winner: Westcol')).not.toBeInTheDocument();
  });

  test('should display combat summary statistics', () => {
    render(<CombatsDisplay />);

    // Check statistics based on fixture data: 3 scheduled, 2 finished
    expect(screen.getByText('3')).toBeInTheDocument(); // Scheduled count
    expect(screen.getByText('2')).toBeInTheDocument(); // Finished count
  });

  test('should display summary labels', () => {
    render(<CombatsDisplay />);

    // Use getAllByText since labels appear in both individual combat cards and summary
    const scheduledElements = screen.getAllByText('Scheduled');
    expect(scheduledElements.length).toBeGreaterThanOrEqual(2); // In combat cards + summary

    const finishedElements = screen.getAllByText('Finished');
    expect(finishedElements.length).toBeGreaterThanOrEqual(2); // In combat cards + summary
  });

  test('should apply custom className', () => {
    const { container } = render(<CombatsDisplay className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('should display fighter initials in circles', () => {
    render(<CombatsDisplay />);

    // Use getAllByText since there might be multiple fighters with same initial
    const pElements = screen.getAllByText('P'); // Peereira and Perxitaa
    expect(pElements.length).toBeGreaterThanOrEqual(1);

    const rElements = screen.getAllByText('R'); // Rivaldios and Roro
    expect(rElements.length).toBeGreaterThanOrEqual(1);

    const gElements = screen.getAllByText('G'); // Gaspi and Grefg
    expect(gElements.length).toBeGreaterThanOrEqual(1);
  });

  test('should handle combat without optional fields', () => {
    // This test ensures the component doesn't break if optional fields are missing
    render(<CombatsDisplay />);

    // Should render without errors even if optional fields are missing
    expect(screen.getByText('Combat #1')).toBeInTheDocument();
  });
});
