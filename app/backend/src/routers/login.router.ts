import { Router } from 'express';
import LoginController from '../login/login.controller';

const router = Router();

const loginController = new LoginController();

router.post('/', (req, res) => loginController.postLogin(req, res));

export default router;
