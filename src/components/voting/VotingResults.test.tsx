import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom';

// Import fixtures
import {
  mockVoteResultsSorted,
  votingScenarios,
} from '../../__tests__/fixtures/voting';

// Mock the voting logic first
vi.mock('../../lib/voting', () => ({
  castVote: vi.fn(),
  getVotes: vi.fn(),
  getVoteCount: vi.fn(),
  hasVoted: vi.fn(),
  getUserVote: vi.fn(),
  clearVotes: vi.fn(),
  getVoteResults: vi.fn(),
  getTotalVotes: vi.fn(),
}));

import * as votingModule from '../../lib/voting';
import { VotingResults } from './VotingResults';

describe('VotingResults Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render results for all participants', () => {
    const scenario = votingScenarios.manyVotes;
    vi.mocked(votingModule.getVoteResults).mockReturnValue(
      scenario.voteResults,
    );
    vi.mocked(votingModule.getTotalVotes).mockReturnValue(scenario.totalVotes);

    render(<VotingResults />);

    expect(screen.getByText('Voting Results')).toBeInTheDocument();
    expect(screen.getByText('Total Votes:')).toBeInTheDocument();
    expect(
      screen.getByText(scenario.totalVotes.toString()),
    ).toBeInTheDocument();
  });

  test('should sort participants by vote count', () => {
    vi.mocked(votingModule.getVoteResults).mockReturnValue(
      mockVoteResultsSorted,
    );
    vi.mocked(votingModule.getTotalVotes).mockReturnValue(
      mockVoteResultsSorted.reduce(
        (sum: number, result: votingModule.VoteResults) =>
          sum + result.voteCount,
        0,
      ),
    );

    render(<VotingResults />);

    expect(screen.getByText('Voting Results')).toBeInTheDocument();
    expect(screen.getByText('Total Votes:')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
  });

  test('should display total vote count', () => {
    const scenario = votingScenarios.someVotes;
    vi.mocked(votingModule.getVoteResults).mockReturnValue(
      scenario.voteResults,
    );
    vi.mocked(votingModule.getTotalVotes).mockReturnValue(scenario.totalVotes);

    render(<VotingResults />);

    expect(screen.getByText('Total Votes:')).toBeInTheDocument();
    expect(
      screen.getByText(scenario.totalVotes.toString()),
    ).toBeInTheDocument();
  });

  test('should display message when no votes exist', () => {
    const scenario = votingScenarios.noVotes;
    vi.mocked(votingModule.getVoteResults).mockReturnValue(
      scenario.voteResults,
    );
    vi.mocked(votingModule.getTotalVotes).mockReturnValue(scenario.totalVotes);

    render(<VotingResults />);

    expect(screen.getByText('No votes yet')).toBeInTheDocument();
  });
});
