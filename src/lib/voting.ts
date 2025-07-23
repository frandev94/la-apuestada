import { getCombatById, laVeladaCombats } from '../constants/combats';
import {
  type EventParticipantsName,
  laVeladaParticipants,
} from '../constants/participants';
import * as voteRepository from './db/vote-repository';
import type { VoteInput, VoteRecord } from './db/vote-repository';

export interface VoteResults {
  participantId: EventParticipantsName;
  voteCount: number;
}

export interface CombatVoteResults {
  combatId: number;
  fighter1: EventParticipantsName;
  fighter2: EventParticipantsName;
  fighter1Votes: number;
  fighter2Votes: number;
  totalVotes: number;
  winningFighter?: EventParticipantsName;
}

/**
 * Validates if a participant ID is valid
 */
function isValidParticipant(
  participantId: string,
): participantId is EventParticipantsName {
  return laVeladaParticipants.includes(participantId as EventParticipantsName);
}

/**
 * Validates if a combat ID exists
 */
function isValidCombat(combatId: number): boolean {
  return getCombatById(combatId) !== undefined;
}

/**
 * Validates if a participant is in a specific combat
 */
function isParticipantInCombat(
  participantId: EventParticipantsName,
  combatId: number,
): boolean {
  const combat = getCombatById(combatId);
  if (!combat) return false;
  return combat.fighter1 === participantId || combat.fighter2 === participantId;
}

/**
 * Gets all votes from storage
 */
export async function getVotes(): Promise<VoteRecord[]> {
  return await voteRepository.getAllVotes();
}

/**
 * Checks if a user has already voted
 */
export async function hasVoted(
  userId: string,
  combatId: number,
): Promise<boolean> {
  return await voteRepository.hasUserVoted(userId, combatId);
}

/**
 * Casts a vote for a participant in a combat
 */
export async function castVote(vote: VoteInput): Promise<VoteRecord> {
  // Validate participant
  if (!isValidParticipant(vote.participantId)) {
    throw new Error('Invalid participant');
  }

  // Validate combat (combatId is now required)
  if (!isValidCombat(vote.combatId)) {
    throw new Error('Invalid combat ID');
  }

  if (!isParticipantInCombat(vote.participantId, vote.combatId)) {
    throw new Error('Participant is not in the specified combat');
  }

  // Check if user has already voted
  if (await hasVoted(vote.userId, vote.combatId)) {
    throw new Error('User has already voted');
  }

  return await voteRepository.createVote(vote);
}

/**
 * Gets the vote count for a specific participant
 */
export async function getVoteCount(
  participantId: EventParticipantsName,
): Promise<number> {
  return await voteRepository.getVoteCount(participantId);
}

/**
 * Gets vote count for a participant in a specific combat
 */
export async function getCombatVoteCount(
  participantId: EventParticipantsName,
  combatId: number,
): Promise<number> {
  return await voteRepository.getCombatVoteCount(participantId, combatId);
}

/**
 * Gets vote results for all participants sorted by vote count
 */
export async function getVoteResults(): Promise<VoteResults[]> {
  const results = await Promise.all(
    laVeladaParticipants.map(async (participantId) => ({
      participantId,
      voteCount: await getVoteCount(participantId),
    })),
  );
  return results.sort((a, b) => b.voteCount - a.voteCount);
}

/**
 * Gets vote results for a specific combat
 */
export async function getCombatVoteResults(
  combatId: number,
): Promise<CombatVoteResults | null> {
  const combat = getCombatById(combatId);
  if (!combat) return null;

  const fighter1Votes = await getCombatVoteCount(combat.fighter1, combatId);
  const fighter2Votes = await getCombatVoteCount(combat.fighter2, combatId);
  const totalVotes = fighter1Votes + fighter2Votes;

  let winningFighter: EventParticipantsName | undefined;
  if (fighter1Votes > fighter2Votes) {
    winningFighter = combat.fighter1;
  } else if (fighter2Votes > fighter1Votes) {
    winningFighter = combat.fighter2;
  }

  return {
    combatId,
    fighter1: combat.fighter1,
    fighter2: combat.fighter2,
    fighter1Votes,
    fighter2Votes,
    totalVotes,
    winningFighter,
  };
}

/**
 * Gets vote results for all combats
 */
export async function getAllCombatVoteResults(): Promise<CombatVoteResults[]> {
  const results = await Promise.all(
    laVeladaCombats.map((combat) => getCombatVoteResults(combat.id)),
  );
  return results.filter(Boolean) as CombatVoteResults[];
}

/**
 * Gets the total number of votes cast
 */
export async function getTotalVotes(): Promise<number> {
  return await voteRepository.getTotalVotes();
}

/**
 * Gets votes for a specific combat
 */
export async function getVotesForCombat(
  combatId: number,
): Promise<VoteRecord[]> {
  return await voteRepository.getVotesByCombat(combatId);
}

/**
 * Clears all votes from storage
 */
export async function clearVotes(): Promise<boolean> {
  return await voteRepository.clearAllVotes();
}

/**
 * Gets the user's vote if they have voted
 */
export async function getUserVote(userId: string): Promise<VoteRecord | null> {
  return await voteRepository.getVoteByUser(userId);
}
