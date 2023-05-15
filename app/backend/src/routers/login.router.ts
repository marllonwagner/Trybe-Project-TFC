import { Router } from 'express';
import isLoginValid from '../middlewares/loginValidations';
import LoginController from '../login/login.controller';

const router = Router();

const loginController = new LoginController();

router.post('/', isLoginValid, (req, res) => loginController.postLogin(req, res));
router.get('/role', (req, res) => loginController.getLoginRole(req, res));

export default router;
