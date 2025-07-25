import type { ThemedComponentProps, VotingControlProps } from './types';

// SRP: Component responsible only for voting button
export function VotingButton({
  votingState,
  participantId,
  onVote,
  theme,
  fighterName,
}: VotingControlProps & ThemedComponentProps & { fighterName: string }) {
  const { userVotedFor, isVoting } = votingState;
  const userHasVoted = userVotedFor !== null;

  const getButtonStyles = (): string => {
    if (userVotedFor === participantId) {
      return 'bg-green-500 text-white';
    }
    if (userHasVoted) {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    }
    if (isVoting) {
      return theme.loadingStyles;
    }
    return `${theme.buttonStyles} focus:outline-none focus:ring-2 focus:ring-offset-2`;
  };

  const getButtonText = (): string => {
    if (userVotedFor === participantId) return '\u2713 Votado';
    if (isVoting) return 'Votando...';
    if (userHasVoted) return 'No puedes votar';
    return `Votar por ${fighterName}`;
  };

  return (
    <button
      type="button"
      onClick={() => onVote(participantId)}
      disabled={userHasVoted || isVoting}
      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors min-h-16 text-sm md:text-md xl:text-lg ${getButtonStyles()}`}
      aria-label={`Votar por ${fighterName}`}
    >
      {getButtonText()}
    </button>
  );
}
