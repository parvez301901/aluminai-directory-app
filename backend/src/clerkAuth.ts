import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import dotenv from 'dotenv';

dotenv.config();

const CLERK_JWKS_URI = process.env.CLERK_JWKS_URI;
if (!CLERK_JWKS_URI) {
  console.error('Missing CLERK_JWKS_URI in .env. Clerk JWT verification will not work.');
}

const client = jwksClient({
  jwksUri: CLERK_JWKS_URI || '',
  cache: true,
  rateLimit: true,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err, null);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

export default function clerkAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  if (!CLERK_JWKS_URI) {
    return res.status(500).json({ error: 'Server misconfiguration: CLERK_JWKS_URI missing' });
  }
  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid Clerk JWT', details: err.message });
    }
    (req as any).user = decoded;
    next();
  });
}
