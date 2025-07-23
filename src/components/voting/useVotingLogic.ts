import { actions } from 'astro:actions';
import type { Combat } from '@/constants/combats';
import type { EventParticipantsName } from '@/constants/participants';
import { useCallback, useEffect, useState } from 'react';
import type { VotingState } from './types';

const { castVote } = actions.voteActions;

// SRP: Custom hook for voting logic separation
export function useVotingLogic(
  userId: string,
  combat: Combat,
  onVoteChange?: () => void,
) {
  const [fighter1VoteCount, setFighter1VoteCount] = useState(0);
  const [fighter2VoteCount, setFighter2VoteCount] = useState(0);
  const [votingState, setVotingState] = useState<VotingState>({
    userHasVoted: false,
    userVotedFor: null,
    isVoting: false,
  });
  const [error, setError] = useState<string | null>(null);

  const updateVotingState = useCallback(async () => {}, []);

  const handleVote = async (participantId: EventParticipantsName) => {
    if (!userId) {
      setError('Please log in to vote');
      return;
    }

    if (votingState.userHasVoted || votingState.isVoting) return;

    setVotingState((prev) => ({ ...prev, isVoting: true }));
    setError(null);

    try {
      const success = await castVote({
        userId,
        combatId: combat.id,
        participantId,
      });

      if (success) {
        await updateVotingState();
        onVoteChange?.();
      } else {
        setError('Failed to submit vote');
        setVotingState((prev) => ({ ...prev, isVoting: false }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cast vote');
      setVotingState((prev) => ({ ...prev, isVoting: false }));
    }
  };

  useEffect(() => {
    updateVotingState();
  }, [updateVotingState]);

  return {
    fighter1VoteCount,
    fighter2VoteCount,
    votingState,
    error,
    handleVote,
  };
}
