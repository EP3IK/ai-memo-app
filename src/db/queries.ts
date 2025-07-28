import { eq, and, desc, asc, like, or, isNull, isNotNull } from 'drizzle-orm';
import { db } from './index';
import { users, memos, categories, tags, memoTags } from './schema';
import type {
  NewUser,
  NewMemo,
  NewCategory,
  NewTag,
  NewMemoTag,
} from './schema';

// User queries
export const userQueries = {
  // Create a new user
  create: async (userData: NewUser) => {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  },

  // Get user by ID
  getById: async (id: string) => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  // Get user by email
  getByEmail: async (email: string) => {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  // Update user
  update: async (id: string, userData: Partial<NewUser>) => {
    const [user] = await db
      .update(users)
      .set({ ...userData, updated_at: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  },

  // Delete user
  delete: async (id: string) => {
    await db.delete(users).where(eq(users.id, id));
  },
};

// Category queries
export const categoryQueries = {
  // Create a new category
  create: async (categoryData: NewCategory) => {
    const [category] = await db
      .insert(categories)
      .values(categoryData)
      .returning();
    return category;
  },

  // Get category by ID
  getById: async (id: string) => {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return category;
  },

  // Get categories by user ID
  getByUserId: async (userId: string) => {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.user_id, userId))
      .orderBy(asc(categories.name));
  },

  // Update category
  update: async (id: string, categoryData: Partial<NewCategory>) => {
    const [category] = await db
      .update(categories)
      .set({ ...categoryData, updated_at: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return category;
  },

  // Delete category
  delete: async (id: string) => {
    await db.delete(categories).where(eq(categories.id, id));
  },
};

// Tag queries
export const tagQueries = {
  // Create a new tag
  create: async (tagData: NewTag) => {
    const [tag] = await db.insert(tags).values(tagData).returning();
    return tag;
  },

  // Get tag by ID
  getById: async (id: string) => {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag;
  },

  // Get tags by user ID
  getByUserId: async (userId: string) => {
    return await db
      .select()
      .from(tags)
      .where(eq(tags.user_id, userId))
      .orderBy(asc(tags.name));
  },

  // Update tag
  update: async (id: string, tagData: Partial<NewTag>) => {
    const [tag] = await db
      .update(tags)
      .set({ ...tagData, updated_at: new Date() })
      .where(eq(tags.id, id))
      .returning();
    return tag;
  },

  // Delete tag
  delete: async (id: string) => {
    await db.delete(tags).where(eq(tags.id, id));
  },
};

// Memo queries
export const memoQueries = {
  // Create a new memo
  create: async (memoData: NewMemo) => {
    const [memo] = await db.insert(memos).values(memoData).returning();
    return memo;
  },

  // Get memo by ID with category and tags
  getById: async (id: string) => {
    const [memo] = await db.select().from(memos).where(eq(memos.id, id));
    return memo;
  },

  // Get memos by user ID with pagination
  getByUserId: async (
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      categoryId?: string;
      isArchived?: boolean;
      search?: string;
    }
  ) => {
    const {
      limit = 20,
      offset = 0,
      categoryId,
      isArchived,
      search,
    } = options || {};

    let query = db.select().from(memos).where(eq(memos.user_id, userId));

    if (categoryId) {
      query = query.where(eq(memos.category_id, categoryId));
    }

    if (isArchived !== undefined) {
      query = query.where(eq(memos.is_archived, isArchived));
    }

    if (search) {
      query = query.where(
        or(
          like(memos.title, `%${search}%`),
          like(memos.content, `%${search}%`),
          like(memos.summary, `%${search}%`)
        )
      );
    }

    return await query
      .orderBy(desc(memos.created_at))
      .limit(limit)
      .offset(offset);
  },

  // Update memo
  update: async (id: string, memoData: Partial<NewMemo>) => {
    const [memo] = await db
      .update(memos)
      .set({ ...memoData, updated_at: new Date() })
      .where(eq(memos.id, id))
      .returning();
    return memo;
  },

  // Delete memo
  delete: async (id: string) => {
    await db.delete(memos).where(eq(memos.id, id));
  },

  // Archive/Unarchive memo
  toggleArchive: async (id: string) => {
    const [memo] = await db
      .update(memos)
      .set({
        is_archived: db.raw('NOT is_archived'),
        updated_at: new Date(),
      })
      .where(eq(memos.id, id))
      .returning();
    return memo;
  },

  // Get memo count by user ID
  getCountByUserId: async (userId: string, isArchived?: boolean) => {
    let query = db
      .select({ count: db.fn.count() })
      .from(memos)
      .where(eq(memos.user_id, userId));

    if (isArchived !== undefined) {
      query = query.where(eq(memos.is_archived, isArchived));
    }

    const [result] = await query;
    return Number(result?.count || 0);
  },
};

// Memo tag queries
export const memoTagQueries = {
  // Add tag to memo
  addTagToMemo: async (memoId: string, tagId: string) => {
    const [memoTag] = await db
      .insert(memoTags)
      .values({ memo_id: memoId, tag_id: tagId })
      .returning();
    return memoTag;
  },

  // Remove tag from memo
  removeTagFromMemo: async (memoId: string, tagId: string) => {
    await db
      .delete(memoTags)
      .where(and(eq(memoTags.memo_id, memoId), eq(memoTags.tag_id, tagId)));
  },

  // Get tags for a memo
  getTagsByMemoId: async (memoId: string) => {
    return await db
      .select({
        tag: tags,
      })
      .from(memoTags)
      .innerJoin(tags, eq(memoTags.tag_id, tags.id))
      .where(eq(memoTags.memo_id, memoId));
  },

  // Get memos by tag ID
  getMemosByTagId: async (tagId: string, userId: string) => {
    return await db
      .select({
        memo: memos,
      })
      .from(memoTags)
      .innerJoin(memos, eq(memoTags.memo_id, memos.id))
      .where(and(eq(memoTags.tag_id, tagId), eq(memos.user_id, userId)))
      .orderBy(desc(memos.created_at));
  },
};

// Complex queries
export const complexQueries = {
  // Get memo with category and tags
  getMemoWithRelations: async (memoId: string) => {
    const [memo] = await db.select().from(memos).where(eq(memos.id, memoId));
    if (!memo) return null;

    const memoTags = await memoTagQueries.getTagsByMemoId(memoId);
    const category = memo.category_id
      ? await categoryQueries.getById(memo.category_id)
      : null;

    return {
      ...memo,
      category,
      tags: memoTags.map(mt => mt.tag),
    };
  },

  // Get user dashboard data
  getUserDashboard: async (userId: string) => {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return null;

    const [memoCount] = await db
      .select({ count: db.fn.count() })
      .from(memos)
      .where(and(eq(memos.user_id, userId), eq(memos.is_archived, false)));

    const [categoryCount] = await db
      .select({ count: db.fn.count() })
      .from(categories)
      .where(eq(categories.user_id, userId));

    const [tagCount] = await db
      .select({ count: db.fn.count() })
      .from(tags)
      .where(eq(tags.user_id, userId));

    const recentMemos = await memoQueries.getByUserId(userId, { limit: 5 });

    return {
      user,
      stats: {
        memoCount: Number(memoCount?.count || 0),
        categoryCount: Number(categoryCount?.count || 0),
        tagCount: Number(tagCount?.count || 0),
      },
      recentMemos,
    };
  },
};
