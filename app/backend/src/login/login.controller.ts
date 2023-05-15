import { Request, Response } from 'express';
import LoginService from './login.service';

class LoginController {
  private loginService = new LoginService();

  async postLogin(req:Request, res: Response) {
    const { email, password } = req.body;
    const { statusCode, response } = await this.loginService.postLogin(email, password);
    res.status(statusCode).json(response);
  }

  async getLoginRole(req:Request, res:Response) {
    const { authorization } = req.headers;
    const { statusCode, response } = await this.loginService.getLoginRole(authorization);
    res.status(statusCode).json(response);
  }
}

export default LoginController;
