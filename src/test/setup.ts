// Test setup file
import { beforeAll, afterAll } from 'vitest';

// Set up test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  'postgresql://test:test@localhost:5432/ai_memo_test';

// Global test setup
beforeAll(async () => {
  // Initialize test database connection
  console.log('Setting up test environment...');
});

// Global test cleanup
afterAll(async () => {
  // Clean up test database connection
  console.log('Cleaning up test environment...');
});
