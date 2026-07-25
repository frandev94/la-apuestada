import { and, count, eq } from 'drizzle-orm';
import { db } from './client';
import { votesTable } from './schema';

export type VoteInput = Omit<
  typeof votesTable.$inferInsert,
  'id' | 'createdAt'
> & {
  participantId: string;
};

export type VoteRecord = typeof votesTable.$inferSelect & {
  participantId: string;
};

/**
 * Creates a new vote in the database
 */
export async function createVote(voteInput: VoteInput): Promise<VoteRecord> {
  const result = (await db
    .insert(votesTable)
    .values({
      id: crypto.randomUUID(),
      userId: voteInput.userId,
      participantId: voteInput.participantId,
      combatId: voteInput.combatId,
    })
    .returning()) as VoteRecord[];
  return result[0] as VoteRecord;
}

/**
 * Gets all votes from the database
 */
export async function getAllVotes(): Promise<VoteRecord[]> {
  return (await db.select().from(votesTable)) as VoteRecord[];
}

/**
 * Gets all votes for a specific combat
 */
export async function getVotesByCombat(
  combatId: number,
): Promise<VoteRecord[]> {
  return (await db
    .select()
    .from(votesTable)
    .where(eq(votesTable.combatId, combatId))) as VoteRecord[];
}

/**
 * Gets all votes for a specific participant
 */
export async function getVotesByParticipant(
  participantId: string,
): Promise<VoteRecord[]> {
  return (await db
    .select()
    .from(votesTable)
    .where(eq(votesTable.participantId, participantId))) as VoteRecord[];
}

/**
 * Gets votes for a participant in a specific combat
 */
export async function getVotesByParticipantAndCombat(
  participantId: string,
  combatId: number,
): Promise<VoteRecord[]> {
  return (await db
    .select()
    .from(votesTable)
    .where(
      and(
        eq(votesTable.participantId, participantId),
        eq(votesTable.combatId, combatId),
      ),
    )) as VoteRecord[];
}

/**
 * Gets a vote by user ID and combat ID
 */
export async function getVoteByUser(
  userId: string,
  combatId: number,
): Promise<VoteRecord | null> {
  const result = (await db
    .select()
    .from(votesTable)
    .where(
      and(eq(votesTable.userId, userId), eq(votesTable.combatId, combatId)),
    )
    .limit(1)) as VoteRecord[];
  return result.length > 0 ? (result[0] as VoteRecord) : null;
}

/**
 * Checks if a user has already voted
 */
export async function hasUserVoted(
  userId: string,
  combatId: number,
): Promise<boolean> {
  const vote = (await db
    .select()
    .from(votesTable)
    .where(
      and(eq(votesTable.userId, userId), eq(votesTable.combatId, combatId)),
    )
    .limit(1)) as VoteRecord[];
  return vote.length > 0;
}

/**
 * Gets vote count for a specific participant
 */
export async function getVoteCount(participantId: string): Promise<number> {
  const result = (await db
    .select({ total: count() })
    .from(votesTable)
    .where(eq(votesTable.participantId, participantId))) as Array<{
    total: number;
  }>;
  return result[0]?.total ?? 0;
}

/**
 * Gets vote count for a participant in a specific combat
 */
export async function getCombatVoteCount(
  participantId: string,
  combatId: number,
): Promise<number> {
  const result = (await db
    .select({ total: count() })
    .from(votesTable)
    .where(
      and(
        eq(votesTable.participantId, participantId),
        eq(votesTable.combatId, combatId),
      ),
    )) as Array<{ total: number }>;
  return result[0]?.total ?? 0;
}

/**
 * Gets total number of votes
 */
export async function getTotalVotes(): Promise<number> {
  const result = (await db
    .select({ total: count() })
    .from(votesTable)) as Array<{ total: number }>;
  return result[0]?.total ?? 0;
}

/**
 * Deletes a vote by ID
 */
export async function deleteVote(voteId: string): Promise<boolean> {
  try {
    const result = await db.delete(votesTable).where(eq(votesTable.id, voteId));
    return Number(result.rowsAffected ?? 0) > 0;
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
    await db.delete(votesTable);
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
  const result = (await db
    .select({
      participantId: votesTable.participantId,
      voteCount: count(),
    })
    .from(votesTable)
    .groupBy(votesTable.participantId)
    .orderBy(count())) as Array<{
    participantId: string;
    voteCount: number;
  }>;

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
  const result = (await db
    .select({
      participantId: votesTable.participantId,
      voteCount: count(),
    })
    .from(votesTable)
    .where(eq(votesTable.combatId, combatId))
    .groupBy(votesTable.participantId)
    .orderBy(count())) as Array<{
    participantId: string;
    voteCount: number;
  }>;

  const totalResult = (await db
    .select({ total: count() })
    .from(votesTable)
    .where(eq(votesTable.combatId, combatId))) as Array<{ total: number }>;

  const results = result.map((row) => ({
    participantId: row.participantId,
    voteCount: row.voteCount,
  }));

  return {
    combatId,
    results,
    totalVotes: totalResult[0]?.total ?? 0,
  };
}

/**
 * Gets all votes for a specific user
 */
export async function getVotesByUser(userId: string): Promise<VoteRecord[]> {
  return (await db
    .select()
    .from(votesTable)
    .where(eq(votesTable.userId, userId))) as VoteRecord[];
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
  const result = (await db
    .select({
      combatId: votesTable.combatId,
      participantId: votesTable.participantId,
      voteCount: count(),
    })
    .from(votesTable)
    .groupBy(votesTable.combatId, votesTable.participantId)) as Array<{
    combatId: number;
    participantId: string;
    voteCount: number;
  }>;

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
