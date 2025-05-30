export const laVeladaParticipants: string[] = [
  'peereira',
  'rivaldios',
  'perxitaa',
  'gaspi',
  'abby',
  'roro',
  'andoni',
  'carlos',
  'alana',
  'arigeli',
  'viruzz',
  'tomas',
  'grefg',
  'westcol',
];

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
