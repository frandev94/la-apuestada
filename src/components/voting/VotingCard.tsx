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
export function VotingCard({ combat, locked = false }: VotingCardProps) {
  const { user } = useUser(); // Ensure user context is available
  const { votingState, error, handleVote } = useVotingLogic({
    combat,
    userId: user?.id,
    locked,
  });

  // Create fighter data using factory function
  const fighter1Data = createFighterData(combat.fighter1);
  const fighter2Data = createFighterData(combat.fighter2);

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 p-6 transition-transform hover:scale-105 hover:bg-white/10">
      <CombatHeader combatId={combat.id} />
      <ErrorDisplay error={error} />

      <div className="flex gap-0 flex--top">
        <div className="w-1/3">
          <FighterContainer
            fighterData={fighter1Data}
            votingState={votingState}
            onVote={handleVote}
            theme={blueTheme}
            locked={locked}
          />
        </div>
        <div className="w-1/3 text-center">
          <VSDivider />
        </div>
        <div className="w-1/3">
          <FighterContainer
            fighterData={fighter2Data}
            votingState={votingState}
            onVote={handleVote}
            theme={redTheme}
            locked={locked}
          />
        </div>
      </div>

      <VoteResultDisplay votingState={votingState} />
    </div>
  );
}
