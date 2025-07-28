import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection configuration
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create postgres client with optimized settings for Supabase
const client = postgres(connectionString, {
  max: 10, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

// Create drizzle instance with schema
export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === 'development',
});

// Export schema for type generation and migrations
export * from './schema';

// Helper function to close connection
export const closeConnection = async () => {
  await client.end();
};

// Database health check
export const checkDatabaseConnection = async () => {
  try {
    await client`SELECT 1`;
    return { status: 'connected', message: 'Database connection successful' };
  } catch (error) {
    return { status: 'error', message: `Database connection failed: ${error}` };
  }
};

// Export client for direct access if needed
export { client };
