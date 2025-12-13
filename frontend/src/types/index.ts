export interface SignedMessage {
  id: string;
  message: string;
  signature: string;
  address: string;
  timestamp: number;
  isValid?: boolean;
}

export interface VerificationResponse {
  isValid: boolean;
  signer: string;
  originalMessage: string;
}

