import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'medcore-secret-jwt-key-2026';

export interface AuthenticatedRequest extends Request {
  doctor?: {
    id: string;
    email: string;
    name: string;
  };
}

export function authenticateDoctorToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access token is required. Please login.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session. Please login again.' });
    }

    req.doctor = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };
    next();
  });
}
