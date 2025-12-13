import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyMessage } from 'viem';

dotenv.config();

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Signature verification endpoint
  app.post('/verify-signature', async (req: Request, res: Response) => {
    try {
      const { message, signature } = req.body;

      // Validate request body
      if (!message || !signature) {
        res.status(400).json({
          error: 'Missing required fields: message and signature are required',
        });
        return;
      }

      // Verify the signature
      const isValid = await verifyMessage({
        address: signature.address,
        message: message,
        signature: signature.signature,
      });

      res.json({
        isValid,
        signer: signature.address,
        originalMessage: message,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to verify signature',
        isValid: false,
      });
    }
  });

  return app;
};

if (require.main === module) {
  const app = createApp();
  const PORT = process.env.PORT || 3001;
  
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
  });
}

