import { useUser } from '../UserContext';
import { CombatHeader } from './CombatHeader';
import { ErrorDisplay } from './ErrorDisplay';
import { FighterContainer } from './FighterContainer';
import { VSDivider } from './VSDivider';
import { VoteResultDisplay } from './VoteResultDisplay';
import { createFighterData } from './fighterDataFactory';
import { blueTheme, redTheme } from './themes';
import type { VotingCardProps } from './types';
import { useVotingLogic } from './useVotingLogic';

// Main component following SRP
export function VotingCard({ combat }: VotingCardProps) {
  const { user } = useUser(); // Ensure user context is available
  const { votingState, error, handleVote } = useVotingLogic({
    combat,
    userId: user?.id,
  });

  // Create fighter data using factory function
  const fighter1Data = createFighterData(combat.fighter1);
  const fighter2Data = createFighterData(combat.fighter2);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
      <CombatHeader combatId={combat.id} />
      <ErrorDisplay error={error} />

      <div className="flex  gap-4 items-center">
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
