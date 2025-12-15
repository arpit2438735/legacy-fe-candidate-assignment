// Vercel serverless function entry point
import express, { Request, Response } from 'express';
import cors from 'cors';
import { verifyMessage } from 'viem';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (supports both /health and /api/health)
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Signature verification endpoint (supports both paths)
const verifySignatureHandler = async (req: Request, res: Response) => {
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
};

app.post('/verify-signature', verifySignatureHandler);
app.post('/api/verify-signature', verifySignatureHandler);

// Export for Vercel
export default app;

