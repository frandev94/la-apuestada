import { vi } from 'vitest';
// Mock the voting logic first (must be before any imports that use it)
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

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import '@testing-library/jest-dom';

// Import fixtures
import {
  mockVoteResultsSorted,
  votingScenarios,
} from '../../__tests__/fixtures/voting';

import * as votingModule from '../../lib/voting';
import { VotingResults } from './VotingResults';

describe('VotingResults Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.skip('should render results for all participants', async () => {
    const scenario = votingScenarios.manyVotes;
    vi.mocked(votingModule.getVoteResults).mockReturnValue(
      Promise.resolve(scenario.voteResults),
    );
    vi.mocked(votingModule.getTotalVotes).mockReturnValue(
      Promise.resolve(scenario.totalVotes),
    );

    render(<VotingResults />);
    // Debug print to inspect rendered output
    screen.debug();

    expect(await screen.findByText('Voting Results')).toBeInTheDocument();
    expect(await screen.findByText('Total Votes:')).toBeInTheDocument();
    expect(
      await screen.findByText(scenario.totalVotes.toString()),
    ).toBeInTheDocument();
  });

  test.skip('should sort participants by vote count', async () => {
    vi.mocked(votingModule.getVoteResults).mockReturnValue(
      Promise.resolve(mockVoteResultsSorted),
    );
    vi.mocked(votingModule.getTotalVotes).mockReturnValue(
      Promise.resolve(
        mockVoteResultsSorted.reduce(
          (sum: number, result: votingModule.VoteResults) =>
            sum + result.voteCount,
          0,
        ),
      ),
    );

    render(<VotingResults />);

    expect(await screen.findByText('Voting Results')).toBeInTheDocument();
    expect(await screen.findByText('Total Votes:')).toBeInTheDocument();
    expect(await screen.findByText('18')).toBeInTheDocument();
  });

  test('should display total vote count', async () => {
    const scenario = votingScenarios.someVotes;
    vi.mocked(votingModule.getVoteResults).mockReturnValue(
      Promise.resolve(scenario.voteResults),
    );
    vi.mocked(votingModule.getTotalVotes).mockReturnValue(
      Promise.resolve(scenario.totalVotes),
    );

    render(<VotingResults />);

    expect(await screen.findByText('Total Votes:')).toBeInTheDocument();
    expect(
      await screen.findByText(scenario.totalVotes.toString()),
    ).toBeInTheDocument();
  });

  test('should display message when no votes exist', async () => {
    const scenario = votingScenarios.noVotes;
    vi.mocked(votingModule.getVoteResults).mockReturnValue(
      Promise.resolve(scenario.voteResults),
    );
    vi.mocked(votingModule.getTotalVotes).mockReturnValue(
      Promise.resolve(scenario.totalVotes),
    );

    render(<VotingResults />);

    expect(await screen.findByText('No votes yet')).toBeInTheDocument();
  });
});
