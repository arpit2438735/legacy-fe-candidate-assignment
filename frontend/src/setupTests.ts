import '@testing-library/jest-dom';

// Mock import.meta for Jest
(global as any).importMeta = {
  env: {
    VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:3001',
    VITE_DYNAMIC_ENVIRONMENT_ID: process.env.VITE_DYNAMIC_ENVIRONMENT_ID || 'test-env-id',
  },
};

