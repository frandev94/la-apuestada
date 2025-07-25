import { FighterDisplay } from './FighterDisplay';
import { VotingButton } from './VotingButton';
import type { FighterContainerProps } from './types';

// SRP: Composed fighter container following composition over inheritance
export function FighterContainer({
  fighterData,
  votingState,
  onVote,
  theme,
  locked = false,
}: FighterContainerProps) {
  return (
    <div className="flex-1 text-center">
      <FighterDisplay fighterData={fighterData} />
      <VotingButton
        votingState={votingState}
        participantId={fighterData.fighter.id}
        onVote={onVote}
        theme={theme}
        fighterName={fighterData.fighter.name}
        disabled={locked}
      />
    </div>
  );
}
