import type { VoteResultDisplayProps } from './types';

// SRP: Vote result display component
export function VoteResultDisplay({ votingState }: VoteResultDisplayProps) {
  if (!votingState.userVotedFor) return null;

  return (
    <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg text-center border border-white/20">
      <p className="text-sm text-gray-200">
        Votaste por{' '}
        <strong className="text-white">{votingState.userVotedFor}</strong>
      </p>
    </div>
  );
}
