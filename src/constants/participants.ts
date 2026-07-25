import { activeConfig } from '@/config';

export function normalizeFighterName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, '')
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ñ/g, 'n');
}

const fighters = activeConfig.combats.flatMap((c) => [
  c.fighter_1,
  c.fighter_2,
]);
const uniqueFighters = [...new Set(fighters)];
export const laVeladaParticipants: string[] =
  uniqueFighters.map(normalizeFighterName);

export type EventParticipantsName = (typeof laVeladaParticipants)[number];

export const generateFighterAvatarUrl = (
  fighterId: EventParticipantsName,
  size: 'big' | 'cards' = 'cards',
): string => {
  const path = `https://www.infolavelada.com/images/fighters/${size}/${fighterId}.webp`;
  return path;
};

// Function to validate the participants list
export function validateParticipantsList(
  participants: string[],
  expectedCount: number,
): string[] {
  const uniqueParticipants = new Set(participants);
  if (uniqueParticipants.size !== participants.length) {
    throw new Error('Duplicate entries found in participants list.');
  }
  if (participants.length !== expectedCount) {
    throw new Error(
      `Participants list length does not match the expected count of ${expectedCount}.`,
    );
  }
  return participants;
}
