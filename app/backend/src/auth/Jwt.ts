import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

interface InfosObject {
  [key: string | number ]: string | number;
}

const genToken = (infosObj:InfosObject) => {
  const token = jwt.sign(infosObj, JWT_SECRET, { algorithm: 'HS256' });
  return token;
};

const validateToken = async (token: string) => {
  try {
    const verifiedToken = jwt.verify(token, JWT_SECRET);
    return verifiedToken as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
};

export { genToken, validateToken };
