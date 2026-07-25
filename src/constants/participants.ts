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

// Maps normalized fighter ids to the slug used by cdn.infolavelada.com
// (sourced from https://www.infolavelada.com/pronosticos on 2026-07-25).
const FIGHTER_CDN_SLUGS: Record<EventParticipantsName, string> = {
  laparce: 'la-parce',
  fabianasevillano: 'fabiana-sevillano',
  clersss: 'clersss',
  nataliamx: 'natalia-mx',
  eduaguirre: 'edu-aguirre',
  gastonedul: 'gaston-edul',
  martadiaz: 'marta-diaz',
  tatianakaer: 'tatiana-kaer',
  viruzz: 'viruzz',
  geroarias: 'gero-arias',
  alondrissa: 'alondrissa',
  angievelasco: 'angie-velasco',
  litkillah: 'lit-killah',
  kiddkeo: 'kidd-keo',
  samyrivers: 'samy-rivers',
  roro: 'roro',
  plex: 'plex',
  fernanfloo: 'fernanfloo',
  illojuan: 'illojuan',
  thegrefg: 'thegrefg',
};

export const generateFighterAvatarUrl = (
  fighterId: EventParticipantsName,
): string => {
  const slug = FIGHTER_CDN_SLUGS[fighterId] ?? fighterId;
  return `https://cdn.infolavelada.com/character-hero/${slug}.webp`;
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
