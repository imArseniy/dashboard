import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  boolean,
  text,
} from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description').notNull(),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  startTime: varchar('start_time', { length: 5 }).notNull(),
  endTime: varchar('end_time', { length: 5 }).notNull(),
  isRepeating: boolean('is_repeating').notNull(),
  repeatingType: varchar('repeating_type', {
    length: 10,
    enum: ['daily', 'weekly', 'monthly'],
  }).$type<'daily' | 'weekly' | 'monthly'>(),
  location: varchar('location', { length: 256 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  color: varchar('color', { length: 15 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type EventTypes = typeof events.$inferSelect;
export type newEvent = typeof events.$inferInsert;