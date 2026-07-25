import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('User', {
  id: text('id').primaryKey(),
  email: text('email').unique(),
  name: text('name').notNull(),
  image: text('image'),
  isAdmin: integer('isAdmin', { mode: 'boolean' }).default(false),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const votesTable = sqliteTable(
  'Vote',
  {
    id: text('id').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => usersTable.id),
    participantId: text('participantId').notNull(),
    combatId: integer('combatId').notNull(),
    createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index('vote_user_combat_unique').on(table.userId, table.combatId),
  ],
);

export const combatWinnersTable = sqliteTable('CombatWinner', {
  combatId: integer('combatId').primaryKey(),
  participantId: text('participantId').notNull(),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type User = typeof usersTable.$inferSelect;
export type Vote = typeof votesTable.$inferSelect;
export type CombatWinner = typeof combatWinnersTable.$inferSelect;
