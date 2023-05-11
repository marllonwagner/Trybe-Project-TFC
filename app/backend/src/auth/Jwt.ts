import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

interface InfosObject {
  [key: string | number ]: string | number;
}

const genToken = (infosObj:InfosObject) => {
  const token = jwt.sign(infosObj, JWT_SECRET, { algorithm: 'HS256' });
  return token;
};

export default genToken;
