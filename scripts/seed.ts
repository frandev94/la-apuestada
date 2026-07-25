import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { laVeladaCombats } from '../src/constants/combats';
import { db } from '../src/lib/db/client';
import {
  usersTable,
  votesTable,
  combatWinnersTable,
} from '../src/lib/db/schema';

const SEED_USER = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'fcoj.glez94@gmail.com',
  name: 'Wargios',
  isAdmin: true,
};

async function seedUsers() {
  const existing = (await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, SEED_USER.id))) as Array<{ id: string }>;
  if (existing.length > 0) {
    console.log('Seed user already present, skipping.');
    return;
  }
  await db.insert(usersTable).values(SEED_USER);
  console.log('Inserted seed admin user.');
}

async function seedVotes() {
  if (laVeladaCombats.length === 0) {
    console.warn('No combats found, skipping vote generation.');
    return;
  }
  const users = (await db.select().from(usersTable)) as Array<{ id: string }>;
  if (users.length === 0) {
    console.warn('No users found, skipping vote generation.');
    return;
  }
  const votes: typeof votesTable.$inferInsert[] = [];
  for (const combat of laVeladaCombats) {
    const fighters = [combat.fighter1, combat.fighter2];
    for (const user of users) {
      const randomFighter =
        fighters[Math.floor(Math.random() * fighters.length)];
      votes.push({
        id: crypto.randomUUID(),
        userId: user.id,
        participantId: randomFighter,
        combatId: combat.id,
      });
    }
  }
  if (votes.length > 0) {
    await db.insert(votesTable).values(votes);
    console.log(
      `Inserted ${votes.length} votes across ${laVeladaCombats.length} combats for ${users.length} users.`,
    );
  }
}

async function clearWinners() {
  await db.delete(combatWinnersTable);
}

async function main() {
  console.log('Seeding database...');
  await clearWinners();
  await seedUsers();
  await seedVotes();
  console.log('Seed completed.');
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
