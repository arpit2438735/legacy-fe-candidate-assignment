import axios from 'axios';
import type {VerificationResponse} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const verifySignature = async (
  message: string,
  signature: string,
  address: string
): Promise<VerificationResponse> => {
  try {
    const response = await axios.post<VerificationResponse>(
      `${API_URL}/verify-signature`,
      {
        message,
        signature: {
          signature,
          address,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying signature:', error);
    throw new Error('Failed to verify signature');
  }
};

