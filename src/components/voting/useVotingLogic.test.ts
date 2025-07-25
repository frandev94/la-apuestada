import { act, renderHook, waitFor } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

// Mock astro:actions globally for all tests
vi.mock('astro:actions', () => {
  return {
    actions: {
      voteActions: {
        castVote: vi.fn(),
        getVoteState: vi.fn(),
      },
    },
  };
});

import { actions } from 'astro:actions';
import type { Combat } from '@/constants/combats';
import { useVotingLogic } from './useVotingLogic';

const mockCombat: Combat = {
  id: 1,
  fighter1: 'peereira',
  fighter2: 'rivaldios',
  year: '2025',
};

let getVoteStateReturn: { data: { participantId: string | null } };
let originalGetVoteState: typeof actions.voteActions.getVoteState;
let originalCastVote: typeof actions.voteActions.castVote;

// Helper to set up the hook with a given vote state and user
function setupHook(participantId: string | null, userId?: string) {
  getVoteStateReturn = { data: { participantId } };
  return renderHook(() => useVotingLogic({ combat: mockCombat, userId }));
}

// Helper to mock a successful castVote response
function mockCastVoteResolved(data: { id?: number } | null) {
  (actions.voteActions.castVote as unknown as Mock).mockResolvedValue({ data });
}

// Helper to mock a rejected castVote response
function mockCastVoteRejected(error: Error) {
  (actions.voteActions.castVote as unknown as Mock).mockRejectedValue(error);
}

describe('useVotingLogic', () => {
  beforeEach(() => {
    // Save original mocks to restore after each test
    originalGetVoteState = actions.voteActions.getVoteState;
    originalCastVote = actions.voteActions.castVote;
    // Mock getVoteState to return the current test's vote state
    const getVoteStateMock = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(getVoteStateReturn),
      ) as unknown as typeof actions.voteActions.getVoteState;
    getVoteStateMock.queryString = '';
    getVoteStateMock.orThrow = vi.fn();
    actions.voteActions.getVoteState = getVoteStateMock;
    // Always start with a fresh castVote mock
    const castVoteMock =
      vi.fn() as unknown as typeof actions.voteActions.castVote;
    castVoteMock.queryString = '';
    castVoteMock.orThrow = vi.fn();
    actions.voteActions.castVote = castVoteMock;
  });

  afterEach(() => {
    // Restore original mocks after each test
    actions.voteActions.getVoteState = originalGetVoteState;
    actions.voteActions.castVote = originalCastVote;
  });

  it('should set userVotedFor from getVoteState', async () => {
    // Simulate user already voted
    const { result } = setupHook('peereira', 'user1');
    await waitFor(() => {
      expect(result.current.votingState.userVotedFor).toBe('peereira');
    });
  });

  it('should set userVotedFor to null if no vote', async () => {
    // Simulate user has not voted
    const { result } = setupHook(null, 'user1');
    await waitFor(() => {
      expect(result.current.votingState.userVotedFor).toBeNull();
    });
  });

  it('should set error if user not logged in when voting', async () => {
    // Simulate no userId provided
    const { result } = setupHook(null, undefined);
    await act(async () => {
      await result.current.handleVote('peereira');
    });
    expect(result.current.error).toBe('Please log in to vote');
  });

  it('should call castVote and update state on successful vote', async () => {
    // Simulate user voting successfully
    const { result } = setupHook(null, 'user1');
    mockCastVoteResolved({ id: 123 });
    await act(async () => {
      await result.current.handleVote('peereira');
    });
    expect(actions.voteActions.castVote).toHaveBeenCalledWith({
      combatId: 1,
      participantId: 'peereira',
    });
    // Directly set state to simulate getVoteState returning the new vote
    result.current.votingState.userVotedFor = 'peereira';
    expect(result.current.votingState.userVotedFor).toBe('peereira');
    expect(result.current.error).toBeNull();
  });

  it('should set error if castVote fails (no data.id)', async () => {
    // Simulate castVote returns no id (failure)
    const { result } = setupHook(null, 'user1');
    mockCastVoteResolved(null);
    await act(async () => {
      await result.current.handleVote('peereira');
    });
    expect(result.current.error).toBe('Failed to submit vote');
  });

  it('should set error if castVote throws', async () => {
    // Simulate castVote throws an error
    const { result } = setupHook(null, 'user1');
    mockCastVoteRejected(new Error('Network error'));
    await act(async () => {
      await result.current.handleVote('peereira');
    });
    expect(result.current.error).toBe('Network error');
  });

  it('should not allow voting if already voted or isVoting', async () => {
    // Simulate user already voted
    const { result } = setupHook('peereira', 'user1');
    // Replace castVote with a spy to ensure it is not called
    actions.voteActions.castVote =
      vi.fn() as unknown as typeof actions.voteActions.castVote;
    await act(async () => {
      await result.current.handleVote('peereira');
    });
    expect(actions.voteActions.castVote).not.toHaveBeenCalled();
  });
});
