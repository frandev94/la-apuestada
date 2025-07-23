import type { EventParticipantsName } from '../../constants/participants';
import { generateFighterAvatarUrl } from '../../constants/participants';
import type { FighterVoteData } from './types';

// SRP: Fighter data factory
export function createFighterData(fighterId: string): FighterVoteData {
  return {
    fighter: {
      id: fighterId,
      name: fighterId.charAt(0).toUpperCase() + fighterId.slice(1),
      avatar: generateFighterAvatarUrl(fighterId as EventParticipantsName),
    },
  };
}
