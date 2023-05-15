import { NextFunction, Request, Response } from 'express';
import { validateToken } from '../auth/Jwt';
import Users from '../database/models/Users';

const isTokenValid = async (req:Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token not found' });
  }
  const token = await validateToken(authorization);
  const isValid = token && await Users.findOne({ where: { email: token.email } });
  if (isValid === null) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
  return next();
};

export default isTokenValid;
