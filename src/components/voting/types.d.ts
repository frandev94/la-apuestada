// Domain interfaces (SRP: Single responsibility for data structure)
export interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

export interface VotingState {
  userHasVoted: boolean;
  userVotedFor: string | null;
  isVoting: boolean;
}

export interface FighterVoteData {
  fighter: Participant;
  voteCount: number;
}

// Abstraction for voting actions (DIP: Depend on abstractions)
export interface VotingActions {
  onVote: (participantId: string) => void;
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

export interface VotingControlProps extends VotingActions {
  votingState: VotingState;
  participantId: string;
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
  onVote: (participantId: string) => void;
  theme: ThemeConfig;
}

export interface VotingCardProps {
  combat: import('../../data/combats').Combat;
  onVoteChange?: () => void;
}
