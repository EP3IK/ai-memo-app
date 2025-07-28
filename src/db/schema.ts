import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Memos table
export const memos = pgTable("memos", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  category: text("category"),
  tags: text("tags").array(),
  is_archived: boolean("is_archived").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  color: text("color"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Tags table
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  color: text("color"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Memo tags junction table
export const memoTags = pgTable("memo_tags", {
  memo_id: uuid("memo_id")
    .references(() => memos.id)
    .notNull(),
  tag_id: uuid("tag_id")
    .references(() => tags.id)
    .notNull(),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Memo = typeof memos.$inferSelect;
export type NewMemo = typeof memos.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
