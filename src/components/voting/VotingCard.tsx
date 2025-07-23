import {
  CombatHeader,
  ErrorDisplay,
  FighterContainer,
  VSDivider,
  VoteResultDisplay,
  blueTheme,
  createFighterData,
  redTheme,
  useVotingLogic,
} from './index';
import type { VotingCardProps } from './types';

// Main component following SRP
export function VotingCard({ combat, onVoteChange }: VotingCardProps) {
  const {
    fighter1VoteCount,
    fighter2VoteCount,
    votingState,
    error,
    handleVote,
  } = useVotingLogic(combat, onVoteChange);

  // Create fighter data using factory function
  const fighter1Data = createFighterData(combat.fighter1, fighter1VoteCount);
  const fighter2Data = createFighterData(combat.fighter2, fighter2VoteCount);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
      <CombatHeader combatId={combat.id} />
      <ErrorDisplay error={error} />

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <FighterContainer
          fighterData={fighter1Data}
          votingState={votingState}
          onVote={handleVote}
          theme={blueTheme}
        />

        <VSDivider />

        <FighterContainer
          fighterData={fighter2Data}
          votingState={votingState}
          onVote={handleVote}
          theme={redTheme}
        />
      </div>

      <VoteResultDisplay votingState={votingState} />
    </div>
  );
}
