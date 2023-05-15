import { NextFunction, Request, Response } from 'express';

const isLoginValid = async (req:Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const senhaRegex = /^.{1,5}$/;

  if (!email || email === '' || password === '' || !password) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }

  if (!emailRegex.test(email) || password.length < 6) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  return next();
};

export default isLoginValid;
