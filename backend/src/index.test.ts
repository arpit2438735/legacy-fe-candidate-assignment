import request from 'supertest';
import { createApp } from './index';
import * as viem from 'viem';

// Mock viem's verifyMessage function
jest.mock('viem', () => ({
  ...jest.requireActual('viem'),
  verifyMessage: jest.fn(),
}));

const app = createApp();
const mockVerifyMessage = viem.verifyMessage as jest.MockedFunction<typeof viem.verifyMessage>;

describe('Backend API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return valid timestamp format', async () => {
      const response = await request(app).get('/health');
      
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });
  });

  describe('POST /verify-signature', () => {
    it('should return 400 when message is missing', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({
          signature: {
            signature: '0xtest',
            address: '0xtest',
          },
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should return 400 when signature is missing', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: 'Test message',
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should return 400 when body is empty', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return success for valid signature', async () => {
      // Mock verifyMessage to return true (valid signature)
      mockVerifyMessage.mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: 'Hello Web3',
          signature: {
            signature: '0x8c4a5d6c9b5e15e5e6f7b3c8f9a2e5d7a1b4c3d8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
            address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
          },
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        isValid: true,
        signer: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        originalMessage: 'Hello Web3',
      });
      expect(mockVerifyMessage).toHaveBeenCalledWith({
        address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        message: 'Hello Web3',
        signature: '0x8c4a5d6c9b5e15e5e6f7b3c8f9a2e5d7a1b4c3d8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
      });
    });

    it('should return failure for invalid signature', async () => {
      // Mock verifyMessage to return false (invalid signature)
      mockVerifyMessage.mockResolvedValueOnce(false);

      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: 'Test message',
          signature: {
            signature: '0xinvalid',
            address: '0x0000000000000000000000000000000000000000',
          },
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        isValid: false,
        signer: '0x0000000000000000000000000000000000000000',
        originalMessage: 'Test message',
      });
    });

    it('should handle verification errors gracefully', async () => {
      // Mock verifyMessage to throw an error
      mockVerifyMessage.mockRejectedValueOnce(new Error('Verification failed'));

      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: 'Test message',
          signature: {
            signature: '0xerror',
            address: '0x0000000000000000000000000000000000000000',
          },
        });
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Failed to verify signature',
        isValid: false,
      });
    });

    it('should preserve the original message in response', async () => {
      mockVerifyMessage.mockResolvedValueOnce(true);

      const testMessage = 'This is a test message with special chars: !@#$%';
      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: testMessage,
          signature: {
            signature: '0xtest',
            address: '0x0000000000000000000000000000000000000000',
          },
        });
      
      expect(response.status).toBe(200);
      expect(response.body.originalMessage).toBe(testMessage);
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      
      expect(response.status).toBe(404);
    });
  });
});

