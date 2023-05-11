import { compare } from 'bcryptjs';
import Users from '../database/models/Users';
import genToken from '../auth/Jwt';

class LoginService {
  public readonly postLogin = async (email:string, password:string) => {
    if (!email || email === '' || password === '' || !password) {
      return { statusCode: 400, response: { message: 'All fields must be filled' } };
    }
    const user = await Users.findOne({ where: { email } });
    if (!user || !(await compare(password, user.password))) {
      return { statusCode: 401, response: { message: 'Invalid email or password' } };
    }
    const infos = { id: user.id, email: user.email, username: user.username };
    const token = genToken(infos);
    return { statusCode: 200, response: { token } };
  };
}

export default LoginService;
