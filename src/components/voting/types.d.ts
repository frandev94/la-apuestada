import type { Combat } from '@/constants/combats';
import type { EventParticipantsName } from '@/constants/participants';

// Domain interfaces (SRP: Single responsibility for data structure)
export interface Participant {
  id: EventParticipantsName;
  name: string;
  avatar?: string;
}

export interface VotingState {
  userVotedFor: string | null;
  isVoting: boolean;
}

export interface FighterVoteData {
  fighter: Participant;
}

// Abstraction for voting actions (DIP: Depend on abstractions)
export interface VotingActions {
  onVote: (participantId: EventParticipantsName) => void;
}

// Abstraction for UI theme (OCP: Open for extension)
export interface ThemeConfig {
  voteCountColor: string;
  buttonStyles: string;
  loadingStyles: string;
}

// ISP: Segregated interfaces for different concerns
export interface FighterDisplayProps {
  fighterData: FighterVoteData;
}

export interface VoteCountProps {
  voteCount: number;
}

export interface VotingControlProps extends VotingActions {
  votingState: VotingState;
  participantId: EventParticipantsName;
}

export interface ThemedComponentProps {
  theme: ThemeConfig;
}

export interface ErrorDisplayProps {
  error: string | null;
}

export interface CombatHeaderProps {
  combatId: number;
}

export interface VoteResultDisplayProps {
  votingState: VotingState;
}

export interface FighterContainerProps {
  fighterData: FighterVoteData;
  votingState: VotingState;
  onVote: (participantId: EventParticipantsName) => void;
  theme: ThemeConfig;
}

export interface VotingCardProps {
  combat: Combat;
}
