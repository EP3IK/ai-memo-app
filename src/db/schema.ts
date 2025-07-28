import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  index,
} from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    name: text('name'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    emailIdx: index('users_email_idx').on(table.email),
  })
);

// Categories table
export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    user_id: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    color: text('color'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index('categories_user_id_idx').on(table.user_id),
    nameIdx: index('categories_name_idx').on(table.name),
  })
);

// Tags table
export const tags = pgTable(
  'tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    user_id: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    color: text('color'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index('tags_user_id_idx').on(table.user_id),
    nameIdx: index('tags_name_idx').on(table.name),
  })
);

// Memos table
export const memos = pgTable(
  'memos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    summary: text('summary'),
    category_id: uuid('category_id').references(() => categories.id),
    is_archived: boolean('is_archived').default(false).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index('memos_user_id_idx').on(table.user_id),
    categoryIdIdx: index('memos_category_id_idx').on(table.category_id),
    titleIdx: index('memos_title_idx').on(table.title),
    createdAtIdx: index('memos_created_at_idx').on(table.created_at),
    archivedIdx: index('memos_archived_idx').on(table.is_archived),
  })
);

// Memo tags junction table
export const memoTags = pgTable(
  'memo_tags',
  {
    memo_id: uuid('memo_id')
      .references(() => memos.id, { onDelete: 'cascade' })
      .notNull(),
    tag_id: uuid('tag_id')
      .references(() => tags.id, { onDelete: 'cascade' })
      .notNull(),
  },
  table => ({
    memoIdIdx: index('memo_tags_memo_id_idx').on(table.memo_id),
    tagIdIdx: index('memo_tags_tag_id_idx').on(table.tag_id),
    uniqueMemoTag: index('memo_tags_unique_idx').on(
      table.memo_id,
      table.tag_id
    ),
  })
);

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type Memo = typeof memos.$inferSelect;
export type NewMemo = typeof memos.$inferInsert;
export type MemoTag = typeof memoTags.$inferSelect;
export type NewMemoTag = typeof memoTags.$inferInsert;

// Relations
export const usersRelations = {
  memos: { references: [users.id], fields: [memos.user_id] },
  categories: { references: [users.id], fields: [categories.user_id] },
  tags: { references: [users.id], fields: [tags.user_id] },
};

export const categoriesRelations = {
  user: { references: [categories.user_id], fields: [users.id] },
  memos: { references: [categories.id], fields: [memos.category_id] },
};

export const tagsRelations = {
  user: { references: [tags.user_id], fields: [users.id] },
  memoTags: { references: [tags.id], fields: [memoTags.tag_id] },
};

export const memosRelations = {
  user: { references: [memos.user_id], fields: [users.id] },
  category: { references: [memos.category_id], fields: [categories.id] },
  memoTags: { references: [memos.id], fields: [memoTags.memo_id] },
};

export const memoTagsRelations = {
  memo: { references: [memoTags.memo_id], fields: [memos.id] },
  tag: { references: [memoTags.tag_id], fields: [tags.id] },
};
