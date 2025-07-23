import { User, Vote, db } from 'astro:db';
import { laVeladaCombats } from '@/constants/combats';
import { generateUUID } from '@/lib/crypto';
import { loadEnv } from 'vite';

const { DEFAULT_USER_PASSWORD } = loadEnv(
  process.env.NODE_ENV ?? '',
  process.cwd(),
  '',
);

type UserType = typeof User.$inferSelect;
type CreateUserType = typeof User.$inferInsert & { isAdmin?: boolean };
type VoteType = typeof Vote.$inferSelect;

// https://astro.build/db/seed
export default async function seed() {
  await generateUsers();
  await generateVotes();
}

async function generateUsers() {
  if (!DEFAULT_USER_PASSWORD) {
    console.warn('No DEFAULT_USER_PASSWORD set, skipping user creation.');
    return;
  }

  // Create seed users with proper schema
  const users: CreateUserType[] = [
    {
      email: 'fcoj.glez94@gmail.com',
      name: 'Wargios',
      isAdmin: true,
    },
  ];

  await db.insert(User).values(users);
}

async function generateVotes() {
  // Get all combats
  const combats = laVeladaCombats;
  if (combats.length === 0) {
    console.warn('No combats found, skipping vote generation.');
    return;
  }
  // Get all users
  const users: UserType[] = await db.select().from(User);

  if (users.length === 0) {
    console.warn('No users found, skipping vote generation.');
    return;
  }

  // Generate votes for each combat
  const votes: Omit<VoteType, 'createdAt'>[] = [];

  for (const combat of combats) {
    // Each user votes for one fighter in each combat
    for (const user of users) {
      // Randomly choose between fighter1 and fighter2
      const fighters = [combat.fighter1, combat.fighter2];
      const randomFighter =
        fighters[Math.floor(Math.random() * fighters.length)];

      const vote = {
        id: generateUUID(),
        userId: user.id,
        participantId: randomFighter,
        combatId: combat.id,
      };

      votes.push(vote);
    }
  }

  // Insert all votes
  if (votes.length > 0) {
    await db.insert(Vote).values(votes);
    console.log(
      `Generated ${votes.length} votes for ${combats.length} combats and ${users.length} users.`,
    );
  }
}
