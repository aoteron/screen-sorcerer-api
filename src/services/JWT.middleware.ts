/// <reference path="../types/index.d.ts" />
import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  email: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  console.log('Middleware is called'); // Debugging line
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Authorization Header:', authHeader); // Debugging line
  console.log('Extracted Token:', token); // Debugging line

  if (token == null) {
    return res.status(401).send('No token provided');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        console.log(`Token has expired at ${err.expiredAt}`);
      } else {
        console.error('Token verification error:', err.message); // Debugging line
      }
      return res.status(403).send('Token is not valid');
    }

    const payload = decoded as JwtPayload;
    console.log('Decoded Payload:', payload); // Debugging line

    if (payload && payload.id && payload.email) {
      console.log('Payload is valid', payload); // Debugging line
      req.user = { id: payload.id, email: payload.email };
      console.log('User set on request', req.user); // Debugging line
      next();
    } else {
      return res.status(403).send('Invalid token structure');
    }
  });
};
