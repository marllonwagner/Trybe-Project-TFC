import { compare } from 'bcryptjs';
import Users from '../database/models/Users';
import { genToken, validateToken } from '../auth/Jwt';

class LoginService {
  public readonly postLogin = async (email:string, password:string) => {
    const user = await Users.findOne({ where: { email } });
    if (!user || !(await compare(password, user.password))) {
      return { statusCode: 401, response: { message: 'Invalid email or password' } };
    }
    const infos = { id: user.id, email: user.email, username: user.username };
    const token = genToken(infos);
    return { statusCode: 200, response: { token } };
  };

  public readonly getLoginRole = async (authorization:any) => {
    if (!authorization) {
      return { statusCode: 401, response: { message: 'Token not found' } };
    }
    const token = await validateToken(authorization);
    if (token === null) {
      return { statusCode: 401, response: { message: 'Token must be a valid token' } };
    }
    const login = token && await Users.findOne({ where: { email: token.email } });
    return { statusCode: 200, response: { role: login } };
  };
}

export default LoginService;
