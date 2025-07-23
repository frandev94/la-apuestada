import type { VoteResultDisplayProps } from './types';

// SRP: Vote result display component
export function VoteResultDisplay({ votingState }: VoteResultDisplayProps) {
  if (!votingState.userHasVoted) return null;

  return (
    <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center">
      <p className="text-sm text-gray-600">
        You voted for <strong>{votingState.userVotedFor}</strong>
      </p>
    </div>
  );
}
