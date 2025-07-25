import { NOW, column, defineDb, defineTable } from 'astro:db';

// user table definition
// id, email, name, passwordHash, salt, createdAt, updatedAt

// name: 'Wargios',
// email: 'fcoj.glez94@gmail.com',
// image: 'https://cdn.discordapp.com/avatars/202220890690289665/851c49cc8928e5bb12a0631c7239d26a.png'

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }), //
    email: column.text({ unique: true }),
    name: column.text(),
    image: column.text({ optional: true }),
    isAdmin: column.boolean({ default: false }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

// vote table definition
// id, userId, participantId, combatId, timestamp

const Vote = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    userId: column.text({ references: () => User.columns.id }), // The user who voted
    participantId: column.text(), // The participant being voted for
    combatId: column.number(), // Optional combat ID if vote is for a specific combat
    createdAt: column.date({ default: NOW }),
  },
  indexes: [
    { unique: true, on: ['userId', 'combatId'] }, // Ensure a user can only vote once per combat
  ],
});

const CombatWinner = defineTable({
  columns: {
    combatId: column.number({ primaryKey: true, unique: true }), // The combat this winner is for
    participantId: column.text(), // The participant who won
    createdAt: column.date({ default: NOW }),
  },
});

export default defineDb({
  tables: { Vote, User, CombatWinner },
});
