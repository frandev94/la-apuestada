import type { ThemedComponentProps, VoteCountProps } from './types';

// SRP: Component responsible only for vote count display
export function VoteCountDisplay({
  voteCount,
  theme,
}: VoteCountProps & ThemedComponentProps) {
  return (
    <div className="mb-3">
      <span className={`text-xl font-semibold ${theme.voteCountColor}`}>
        {voteCount}
      </span>
      <span className="text-gray-300 ml-1 text-sm">
        {voteCount === 1 ? 'vote' : 'votes'}
      </span>
    </div>
  );
}
