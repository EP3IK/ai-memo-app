import { db, checkDatabaseConnection } from './index';
import { users, memos, categories, tags, memoTags } from './schema';

// Database health check utility
export const healthCheck = async () => {
  try {
    const connection = await checkDatabaseConnection();
    if (connection.status === 'error') {
      throw new Error(connection.message);
    }

    // Test basic query
    await db.select().from(users).limit(1);

    return {
      status: 'healthy',
      message: 'Database connection and queries working correctly',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database health check failed: ${error}`,
      timestamp: new Date().toISOString(),
    };
  }
};

// Database statistics utility
export const getDatabaseStats = async () => {
  try {
    const [userCount] = await db.select({ count: db.fn.count() }).from(users);
    const [memoCount] = await db.select({ count: db.fn.count() }).from(memos);
    const [categoryCount] = await db
      .select({ count: db.fn.count() })
      .from(categories);
    const [tagCount] = await db.select({ count: db.fn.count() }).from(tags);
    const [memoTagCount] = await db
      .select({ count: db.fn.count() })
      .from(memoTags);

    return {
      users: Number(userCount?.count || 0),
      memos: Number(memoCount?.count || 0),
      categories: Number(categoryCount?.count || 0),
      tags: Number(tagCount?.count || 0),
      memoTags: Number(memoTagCount?.count || 0),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(`Failed to get database stats: ${error}`);
  }
};

// Database cleanup utility (for testing)
export const cleanupTestData = async (userId: string) => {
  try {
    // Delete in correct order to respect foreign key constraints
    await db
      .delete(memoTags)
      .where(
        db.raw(`memo_id IN (SELECT id FROM memos WHERE user_id = '${userId}')`)
      );
    await db.delete(memos).where(db.raw(`user_id = '${userId}'`));
    await db.delete(tags).where(db.raw(`user_id = '${userId}'`));
    await db.delete(categories).where(db.raw(`user_id = '${userId}'`));
    await db.delete(users).where(db.raw(`id = '${userId}'`));

    return { success: true, message: 'Test data cleaned up successfully' };
  } catch (error) {
    throw new Error(`Failed to cleanup test data: ${error}`);
  }
};

// Database migration status utility
export const getMigrationStatus = async () => {
  try {
    // Check if all tables exist
    const tables = ['users', 'memos', 'categories', 'tags', 'memo_tags'];
    const tableStatus = {};

    for (const table of tables) {
      try {
        await db.raw(`SELECT 1 FROM ${table} LIMIT 1`);
        tableStatus[table] = 'exists';
      } catch (error) {
        tableStatus[table] = 'missing';
      }
    }

    return {
      status: 'migration_check_complete',
      tables: tableStatus,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(`Failed to check migration status: ${error}`);
  }
};

// Database connection pool status
export const getConnectionPoolStatus = async () => {
  try {
    // This is a simplified version - in a real implementation,
    // you might want to expose connection pool metrics from your database client
    const connection = await checkDatabaseConnection();

    return {
      status: connection.status,
      message: connection.message,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(`Failed to get connection pool status: ${error}`);
  }
};
