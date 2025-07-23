import type { Combat } from '@/constants/combats';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { useVotingLogic } from './useVotingLogic';

// Mock dependencies
vi.mock('@/lib/user', () => ({ getUserId: vi.fn() }));
vi.mock('@/lib/database-voting', () => ({
  submitVote: vi.fn(),
  getUserVote: vi.fn(),
  getParticipantVotes: vi.fn(),
  hasUserVoted: vi.fn(),
}));

import {
  getParticipantVotes,
  getUserVote,
  hasUserVoted,
  submitVote,
} from '@/lib/database-voting';
import { getUserId } from '@/lib/user';

const mockGetUserId = getUserId as Mock;
const mockSubmitVote = submitVote as Mock;
const mockGetUserVote = getUserVote as Mock;
const mockGetParticipantVotes = getParticipantVotes as Mock;
const mockHasUserVoted = hasUserVoted as Mock;

const mockCombat: Combat = {
  id: 1,
  fighter1: 'peereira',
  fighter2: 'rivaldios',
};

describe('useVotingLogic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set default state if user not logged in', async () => {
    mockGetUserId.mockReturnValue(null);
    const { result } = renderHook(() => useVotingLogic({ combat: mockCombat }));
    await waitFor(() => {
      expect(result.current.fighter1VoteCount).toBe(0);
      expect(result.current.fighter2VoteCount).toBe(0);
      expect(result.current.votingState.userHasVoted).toBe(false);
      expect(result.current.votingState.userVotedFor).toBeNull();
    });
  });

  it('should update state with vote counts and user vote', async () => {
    mockGetUserId.mockReturnValue('user1');
    mockGetParticipantVotes.mockResolvedValueOnce(5);
    mockGetParticipantVotes.mockResolvedValueOnce(3);
    mockHasUserVoted.mockResolvedValueOnce(true);
    mockGetUserVote.mockResolvedValueOnce({ participantId: 'peereira' });
    const { result } = renderHook(() => useVotingLogic({ combat: mockCombat }));
    await waitFor(() => {
      expect(result.current.fighter1VoteCount).toBe(5);
      expect(result.current.fighter2VoteCount).toBe(3);
      expect(result.current.votingState.userHasVoted).toBe(true);
      expect(result.current.votingState.userVotedFor).toBe('peereira');
    });
  });

  it('should handle voting', async () => {
    mockGetUserId.mockReturnValue('user1');
    mockGetParticipantVotes.mockResolvedValue(0);
    mockHasUserVoted.mockResolvedValue(false);
    mockGetUserVote.mockResolvedValue({ participantId: null });
    mockSubmitVote.mockResolvedValue(true);
    const onVoteChange = vi.fn();
    const { result, rerender } = renderHook(
      (props) =>
        useVotingLogic({
          combat: props.combat,
          onVoteChange: props.onVoteChange,
        }),
      {
        initialProps: { combat: mockCombat, onVoteChange },
      },
    );
    await waitFor(() => expect(result.current.fighter1VoteCount).toBe(0));
    await act(async () => {
      await result.current.handleVote('peereira');
    });
    await waitFor(() => {
      expect(mockSubmitVote).toHaveBeenCalledWith('user1', 'peereira', 1);
      expect(onVoteChange).toHaveBeenCalled();
    });
  });

  it('should set error if voting fails', async () => {
    mockGetUserId.mockReturnValue('user1');
    mockGetParticipantVotes.mockResolvedValue(0);
    mockHasUserVoted.mockResolvedValue(false);
    mockGetUserVote.mockResolvedValue({ participantId: null });
    mockSubmitVote.mockResolvedValue(false);
    const { result } = renderHook(() => useVotingLogic({ combat: mockCombat }));
    await waitFor(() => expect(result.current.fighter1VoteCount).toBe(0));
    await act(async () => {
      await result.current.handleVote('peereira');
    });
    await waitFor(() => {
      expect(result.current.error).toBe('Failed to submit vote');
    });
  });

  it('should set error if user not logged in when voting', async () => {
    mockGetUserId.mockReturnValue(null);
    const { result } = renderHook(() => useVotingLogic({ combat: mockCombat }));
    await act(async () => {
      await result.current.handleVote('peereira');
    });
    await waitFor(() => {
      expect(result.current.error).toBe('Please log in to vote');
    });
  });
});
