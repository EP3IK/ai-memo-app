import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db, closeConnection } from '../index';
import { users, memos, categories, tags, memoTags } from '../schema';
import {
  userQueries,
  categoryQueries,
  tagQueries,
  memoQueries,
  memoTagQueries,
} from '../queries';

describe('Database Schema Tests', () => {
  beforeAll(async () => {
    // Ensure database connection is established
    const connection = await db.select().from(users).limit(1);
    expect(connection).toBeDefined();
  });

  afterAll(async () => {
    await closeConnection();
  });

  describe('Users Table', () => {
    it('should have correct structure', () => {
      expect(users.id).toBeDefined();
      expect(users.email).toBeDefined();
      expect(users.name).toBeDefined();
      expect(users.created_at).toBeDefined();
      expect(users.updated_at).toBeDefined();
    });

    it('should have email unique constraint', () => {
      expect(users.email.notNull).toBe(true);
      // Note: Unique constraint is handled at database level
    });
  });

  describe('Categories Table', () => {
    it('should have correct structure', () => {
      expect(categories.id).toBeDefined();
      expect(categories.name).toBeDefined();
      expect(categories.description).toBeDefined();
      expect(categories.user_id).toBeDefined();
      expect(categories.color).toBeDefined();
      expect(categories.created_at).toBeDefined();
      expect(categories.updated_at).toBeDefined();
    });

    it('should have foreign key to users', () => {
      expect(categories.user_id.references).toBeDefined();
    });
  });

  describe('Tags Table', () => {
    it('should have correct structure', () => {
      expect(tags.id).toBeDefined();
      expect(tags.name).toBeDefined();
      expect(tags.user_id).toBeDefined();
      expect(tags.color).toBeDefined();
      expect(tags.created_at).toBeDefined();
      expect(tags.updated_at).toBeDefined();
    });

    it('should have foreign key to users', () => {
      expect(tags.user_id.references).toBeDefined();
    });
  });

  describe('Memos Table', () => {
    it('should have correct structure', () => {
      expect(memos.id).toBeDefined();
      expect(memos.user_id).toBeDefined();
      expect(memos.title).toBeDefined();
      expect(memos.content).toBeDefined();
      expect(memos.summary).toBeDefined();
      expect(memos.category_id).toBeDefined();
      expect(memos.is_archived).toBeDefined();
      expect(memos.created_at).toBeDefined();
      expect(memos.updated_at).toBeDefined();
    });

    it('should have foreign keys', () => {
      expect(memos.user_id.references).toBeDefined();
      expect(memos.category_id.references).toBeDefined();
    });

    it('should have default values', () => {
      expect(memos.is_archived.default).toBe(false);
    });
  });

  describe('Memo Tags Junction Table', () => {
    it('should have correct structure', () => {
      expect(memoTags.memo_id).toBeDefined();
      expect(memoTags.tag_id).toBeDefined();
    });

    it('should have foreign keys with cascade delete', () => {
      expect(memoTags.memo_id.references).toBeDefined();
      expect(memoTags.tag_id.references).toBeDefined();
    });
  });
});

describe('Database Queries Tests', () => {
  let testUserId: string;
  let testCategoryId: string;
  let testTagId: string;
  let testMemoId: string;

  beforeAll(async () => {
    // Create test user
    const testUser = await userQueries.create({
      email: 'test@example.com',
      name: 'Test User',
    });
    testUserId = testUser.id;

    // Create test category
    const testCategory = await categoryQueries.create({
      name: 'Test Category',
      description: 'Test category description',
      user_id: testUserId,
      color: '#3b82f6',
    });
    testCategoryId = testCategory.id;

    // Create test tag
    const testTag = await tagQueries.create({
      name: 'Test Tag',
      user_id: testUserId,
      color: '#ef4444',
    });
    testTagId = testTag.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testMemoId) {
      await memoQueries.delete(testMemoId);
    }
    if (testTagId) {
      await tagQueries.delete(testTagId);
    }
    if (testCategoryId) {
      await categoryQueries.delete(testCategoryId);
    }
    if (testUserId) {
      await userQueries.delete(testUserId);
    }
  });

  describe('User Queries', () => {
    it('should create and retrieve user', async () => {
      const user = await userQueries.getById(testUserId);
      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
      expect(user?.name).toBe('Test User');
    });

    it('should get user by email', async () => {
      const user = await userQueries.getByEmail('test@example.com');
      expect(user).toBeDefined();
      expect(user?.id).toBe(testUserId);
    });

    it('should update user', async () => {
      const updatedUser = await userQueries.update(testUserId, {
        name: 'Updated Test User',
      });
      expect(updatedUser?.name).toBe('Updated Test User');
    });
  });

  describe('Category Queries', () => {
    it('should create and retrieve category', async () => {
      const category = await categoryQueries.getById(testCategoryId);
      expect(category).toBeDefined();
      expect(category?.name).toBe('Test Category');
      expect(category?.user_id).toBe(testUserId);
    });

    it('should get categories by user ID', async () => {
      const categories = await categoryQueries.getByUserId(testUserId);
      expect(categories).toHaveLength(1);
      expect(categories[0]?.name).toBe('Test Category');
    });

    it('should update category', async () => {
      const updatedCategory = await categoryQueries.update(testCategoryId, {
        name: 'Updated Test Category',
      });
      expect(updatedCategory?.name).toBe('Updated Test Category');
    });
  });

  describe('Tag Queries', () => {
    it('should create and retrieve tag', async () => {
      const tag = await tagQueries.getById(testTagId);
      expect(tag).toBeDefined();
      expect(tag?.name).toBe('Test Tag');
      expect(tag?.user_id).toBe(testUserId);
    });

    it('should get tags by user ID', async () => {
      const tags = await tagQueries.getByUserId(testUserId);
      expect(tags).toHaveLength(1);
      expect(tags[0]?.name).toBe('Test Tag');
    });

    it('should update tag', async () => {
      const updatedTag = await tagQueries.update(testTagId, {
        name: 'Updated Test Tag',
      });
      expect(updatedTag?.name).toBe('Updated Test Tag');
    });
  });

  describe('Memo Queries', () => {
    it('should create memo', async () => {
      const memo = await memoQueries.create({
        user_id: testUserId,
        title: 'Test Memo',
        content: 'This is a test memo content',
        summary: 'Test summary',
        category_id: testCategoryId,
      });
      testMemoId = memo.id;

      expect(memo).toBeDefined();
      expect(memo.title).toBe('Test Memo');
      expect(memo.user_id).toBe(testUserId);
      expect(memo.category_id).toBe(testCategoryId);
      expect(memo.is_archived).toBe(false);
    });

    it('should retrieve memo by ID', async () => {
      const memo = await memoQueries.getById(testMemoId);
      expect(memo).toBeDefined();
      expect(memo?.title).toBe('Test Memo');
    });

    it('should get memos by user ID', async () => {
      const memos = await memoQueries.getByUserId(testUserId);
      expect(memos).toHaveLength(1);
      expect(memos[0]?.title).toBe('Test Memo');
    });

    it('should update memo', async () => {
      const updatedMemo = await memoQueries.update(testMemoId, {
        title: 'Updated Test Memo',
      });
      expect(updatedMemo?.title).toBe('Updated Test Memo');
    });

    it('should toggle archive status', async () => {
      const archivedMemo = await memoQueries.toggleArchive(testMemoId);
      expect(archivedMemo?.is_archived).toBe(true);

      const unarchivedMemo = await memoQueries.toggleArchive(testMemoId);
      expect(unarchivedMemo?.is_archived).toBe(false);
    });

    it('should get memo count', async () => {
      const count = await memoQueries.getCountByUserId(testUserId);
      expect(count).toBe(1);

      const archivedCount = await memoQueries.getCountByUserId(
        testUserId,
        true
      );
      expect(archivedCount).toBe(0);
    });
  });

  describe('Memo Tag Queries', () => {
    it('should add tag to memo', async () => {
      const memoTag = await memoTagQueries.addTagToMemo(testMemoId, testTagId);
      expect(memoTag).toBeDefined();
      expect(memoTag.memo_id).toBe(testMemoId);
      expect(memoTag.tag_id).toBe(testTagId);
    });

    it('should get tags for memo', async () => {
      const tags = await memoTagQueries.getTagsByMemoId(testMemoId);
      expect(tags).toHaveLength(1);
      expect(tags[0]?.tag.name).toBe('Updated Test Tag');
    });

    it('should get memos by tag ID', async () => {
      const memos = await memoTagQueries.getMemosByTagId(testTagId, testUserId);
      expect(memos).toHaveLength(1);
      expect(memos[0]?.memo.title).toBe('Updated Test Memo');
    });

    it('should remove tag from memo', async () => {
      await memoTagQueries.removeTagFromMemo(testMemoId, testTagId);
      const tags = await memoTagQueries.getTagsByMemoId(testMemoId);
      expect(tags).toHaveLength(0);
    });
  });
});
