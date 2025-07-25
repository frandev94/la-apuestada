import { Vote, and, count, db, eq } from 'astro:db';
import type { EventParticipantsName } from '../../constants/participants';

export type VoteInput = typeof Vote.$inferInsert & {
  participantId: EventParticipantsName;
};

export type VoteRecord = typeof Vote.$inferSelect & {
  participantId: EventParticipantsName;
};

/**
 * Creates a new vote in the database
 */
export async function createVote(voteInput: VoteInput): Promise<VoteRecord> {
  const result = await db
    .insert(Vote)
    .values({
      id: crypto.randomUUID(),
      userId: voteInput.userId,
      participantId: voteInput.participantId,
      combatId: voteInput.combatId,
    } as VoteInput)
    .returning();

  return result[0] as VoteRecord;
}

/**
 * Gets all votes from the database
 */
export async function getAllVotes(): Promise<VoteRecord[]> {
  const result = await db.select().from(Vote);
  return result as VoteRecord[];
}

/**
 * Gets all votes for a specific combat
 */
export async function getVotesByCombat(
  combatId: number,
): Promise<VoteRecord[]> {
  const result = await db
    .select()
    .from(Vote)
    .where(eq(Vote.combatId, combatId));
  return result as VoteRecord[];
}

/**
 * Gets all votes for a specific participant
 */
export async function getVotesByParticipant(
  participantId: string,
): Promise<VoteRecord[]> {
  const result = await db
    .select()
    .from(Vote)
    .where(eq(Vote.participantId, participantId));
  return result as VoteRecord[];
}

/**
 * Gets votes for a participant in a specific combat
 */
export async function getVotesByParticipantAndCombat(
  participantId: string,
  combatId: number,
): Promise<VoteRecord[]> {
  const result = await db
    .select()
    .from(Vote)
    .where(
      and(eq(Vote.participantId, participantId), eq(Vote.combatId, combatId)),
    );
  return result as VoteRecord[];
}

/**
 * Gets a vote by user ID and combat ID
 */
export async function getVoteByUser(
  userId: string,
  combatId: number,
): Promise<VoteRecord | null> {
  const result = await db
    .select()
    .from(Vote)
    .where(and(eq(Vote.userId, userId), eq(Vote.combatId, combatId)))
    .limit(1);
  return result.length > 0 ? (result[0] as VoteRecord) : null;
}

/**
 * Checks if a user has already voted
 */
export async function hasUserVoted(
  userId: string,
  combatId: number,
): Promise<boolean> {
  const vote = await db
    .select()
    .from(Vote)
    .where(and(eq(Vote.userId, userId), eq(Vote.combatId, combatId)))
    .limit(1);
  return vote.length > 0;
}

/**
 * Gets vote count for a specific participant
 */
export async function getVoteCount(participantId: string): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(Vote)
    .where(eq(Vote.participantId, participantId));
  return result[0]?.count || 0;
}

/**
 * Gets vote count for a participant in a specific combat
 */
export async function getCombatVoteCount(
  participantId: string,
  combatId: number,
): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(Vote)
    .where(
      and(eq(Vote.participantId, participantId), eq(Vote.combatId, combatId)),
    );
  return result[0]?.count || 0;
}

/**
 * Gets total number of votes
 */
export async function getTotalVotes(): Promise<number> {
  const result = await db.select({ count: count() }).from(Vote);
  return result[0]?.count || 0;
}

/**
 * Deletes a vote by ID
 */
export async function deleteVote(voteId: string): Promise<boolean> {
  try {
    await db.delete(Vote).where(eq(Vote.id, voteId));
    return true;
  } catch (error) {
    console.error('Error deleting vote:', error);
    return false;
  }
}

/**
 * Clears all votes from the database
 */
export async function clearAllVotes(): Promise<boolean> {
  try {
    await db.delete(Vote);
    return true;
  } catch (error) {
    console.error('Error clearing votes:', error);
    return false;
  }
}

/**
 * Gets vote results for all participants with vote counts
 */
export async function getVoteResults(): Promise<
  Array<{ participantId: string; voteCount: number }>
> {
  const result = await db
    .select({
      participantId: Vote.participantId,
      voteCount: count(),
    })
    .from(Vote)
    .groupBy(Vote.participantId)
    .orderBy(count());

  return result.map((row) => ({
    participantId: row.participantId,
    voteCount: row.voteCount,
  }));
}

/**
 * Gets vote results for a specific combat
 */
export async function getCombatResults(combatId: number): Promise<{
  combatId: number;
  results: Array<{ participantId: string; voteCount: number }>;
  totalVotes: number;
}> {
  const result = await db
    .select({
      participantId: Vote.participantId,
      voteCount: count(),
    })
    .from(Vote)
    .where(eq(Vote.combatId, combatId))
    .groupBy(Vote.participantId)
    .orderBy(count());

  const totalResult = await db
    .select({ total: count() })
    .from(Vote)
    .where(eq(Vote.combatId, combatId));

  const results = result.map((row) => ({
    participantId: row.participantId,
    voteCount: row.voteCount,
  }));

  return {
    combatId,
    results,
    totalVotes: totalResult[0]?.total || 0,
  };
}

/**
 * Gets all votes for a specific user
 */
export async function getVotesByUser(userId: string): Promise<VoteRecord[]> {
  const result = await db.select().from(Vote).where(eq(Vote.userId, userId));
  return result as VoteRecord[];
}

/**
 * Gets the count of votes per match, grouped by combat and participant
 */
export async function getVotesPerCombat(): Promise<
  Array<{
    combatId: number;
    votes: Array<{ participantId: string; voteCount: number }>;
  }>
> {
  // Get all votes grouped by combatId and participantId
  const result = await db
    .select({
      combatId: Vote.combatId,
      participantId: Vote.participantId,
      voteCount: count(),
    })
    .from(Vote)
    .groupBy(Vote.combatId, Vote.participantId);

  // Group by combatId
  const grouped: Record<
    number,
    { participantId: string; voteCount: number }[]
  > = {};
  for (const row of result) {
    if (!grouped[row.combatId]) grouped[row.combatId] = [];
    grouped[row.combatId].push({
      participantId: row.participantId,
      voteCount: row.voteCount,
    });
  }

  return Object.entries(grouped).map(([combatId, votes]) => ({
    combatId: Number(combatId),
    votes,
  }));
}
