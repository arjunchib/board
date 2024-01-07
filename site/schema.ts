import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const images = sqliteTable(
  'images',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    path: text('path').notNull(),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => {
    return {
      createdAtIdx: index('created_at_idx').on(table.created_at),
    };
  }
);
