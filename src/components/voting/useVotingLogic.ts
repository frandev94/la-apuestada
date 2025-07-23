import { actions } from 'astro:actions';
import type { Combat } from '@/constants/combats';
import type { EventParticipantsName } from '@/constants/participants';
import { useEffect, useRef, useState } from 'react';
import type { VotingState } from './types';

type UseVotingLogicProps = {
  combat: Combat;
  userId?: string;
};

// SRP: Custom hook for voting logic separation
export function useVotingLogic({ combat, userId }: UseVotingLogicProps) {
  const { castVote } = actions.voteActions;
  const [votingState, setVotingState] = useState<VotingState>({
    userVotedFor: null,
    isVoting: false,
  });
  const [error, setError] = useState<string | null>(null);

  const votingStateRef = useRef<VotingState>(votingState);
  useEffect(() => {
    votingStateRef.current = votingState;
  }, [votingState]);

  useEffect(() => {
    // retrieve vote state for the combat
    actions.voteActions
      .getVoteState({ combatId: combat.id })
      .then(({ data }) => {
        setVotingState((prev) => ({
          ...prev,
          userVotedFor: data?.participantId || null,
        }));
      });
  }, [combat]);

  const handleVote = async (participantId: EventParticipantsName) => {
    if (!userId) {
      setError('Please log in to vote');
      return;
    }

    // Always fetch the latest vote state before allowing voting
    const latestVote = await actions.voteActions.getVoteState({
      combatId: combat.id,
    });
    if (latestVote?.data?.participantId || votingState.isVoting) {
      return;
    }

    setVotingState((prev) => ({ ...prev, isVoting: true }));
    setError(null);
    try {
      const { data } = await castVote({
        combatId: combat.id,
        participantId,
      });
      if (!data?.id) {
        setError('Failed to submit vote');
        return;
      }
      setVotingState((prev) => ({
        ...prev,
        userVotedFor: participantId,
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to cast vote');
    } finally {
      setVotingState((prev) => ({ ...prev, isVoting: false }));
    }
  };

  return {
    votingState,
    error,
    handleVote,
  };
}
