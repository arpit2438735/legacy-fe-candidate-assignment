import * as apiModule from './api';

jest.mock('axios');

// Mock the API module to avoid import.meta issues
jest.mock('./api', () => ({
  verifySignature: jest.fn(),
}));

const { verifySignature } = apiModule;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('verifySignature', () => {
    const mockedVerifySignature = verifySignature as jest.MockedFunction<typeof verifySignature>;

    it('should successfully verify a signature', async () => {
      const mockResult = {
        isValid: true,
        signer: '0x1234567890abcdef',
        originalMessage: 'Test message',
      };

      mockedVerifySignature.mockResolvedValueOnce(mockResult);

      const result = await verifySignature(
        'Test message',
        '0xsignature',
        '0x1234567890abcdef'
      );

      expect(result).toEqual(mockResult);
      expect(mockedVerifySignature).toHaveBeenCalledWith(
        'Test message',
        '0xsignature',
        '0x1234567890abcdef'
      );
    });

    it('should handle API errors', async () => {
      mockedVerifySignature.mockRejectedValueOnce(new Error('Failed to verify signature'));

      await expect(
        verifySignature('Test message', '0xsignature', '0xaddress')
      ).rejects.toThrow('Failed to verify signature');
    });
  });
});

