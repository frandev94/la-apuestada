import { NOW, column, defineDb, defineTable } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    hashed_password: column.text(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

const Vote = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    year: column.number(),
    userId: column.number({ references: () => User.columns.id }),
    combat: column.text(),
    prediction: column.text(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
  indexes: [
    { on: ['userId', 'year', 'combat'], unique: true, name: 'unique_vote' },
  ],
});

export default defineDb({
  tables: { User, Vote },
});
