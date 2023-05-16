import { expect } from 'chai';
import { compare } from 'bcryptjs';
import { Request, Response } from 'express';
import { SinonStub , assert , stub} from 'sinon';
import * as sinon from 'sinon'
import LoginController from '../login/login.controller';
import LoginService from '../login/login.service';
import * as Jwt from '../auth/Jwt';
import Users from '../database/models/Users';


describe('LoginService Unit Test', () => {
  let loginService: LoginService;
  let findOneStub: SinonStub<any[], any>;
  // let compareStub: SinonStub<any[], any>;
  let genTokenStub: SinonStub<any[], any>;

  beforeEach(() => {
    loginService = new LoginService();
    findOneStub = stub(Users, 'findOne');
    // compareStub = stub(compare);
    genTokenStub = stub(Jwt, 'genToken');
  });

  afterEach(() => {
    findOneStub.restore();
    // compareStub.restore();
    genTokenStub.restore();
  });

  describe('postLogin', () => {
    it('should return a response with a token if login is successful', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = { id: 'user_id', email, username: 'test_user', password: 'hashed_password' };
      findOneStub.resolves(user);
      // compareStub.resolves(true);
      genTokenStub.returns('generated_token');

      const result = await loginService.postLogin(email, password);

      expect(findOneStub.calledWith({ where: { email } })).to.be.true;
      // expect(compareStub.calledWith(password, user.password)).to.be.true;
      expect(genTokenStub.calledWith({ id: user.id, email, username: user.username })).to.be.true;
      expect(result).to.deep.equal({ statusCode: 200, response: { token: 'generated_token' } });
    });

    it('should return a response with an error message if login fails', async () => {
      const email = 'test@example.com';
      const password = 'password';
      findOneStub.resolves(null);

      const result = await loginService.postLogin(email, password);

      expect(findOneStub.calledWith({ where: { email } })).to.be.true;
      expect(result).to.deep.equal({ statusCode: 401, response: { message: 'Invalid email or password' } });
    });
  });
});


describe('LoginController Integration Test', () => {
  let loginController: LoginController;
  let loginService: LoginService;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonStub: SinonStub;

  beforeEach(() => {
    loginService = new LoginService();
    loginController = new LoginController();
    req = { body: {}, headers: {} };
    res = {};
    statusStub = sinon.stub().returns(res as Response);
    jsonStub = sinon.stub();
    res.status = statusStub;
    res.json = jsonStub;
  });

  describe('postLogin', () => {
    it('should return 200 with a token if login is successful', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const token = 'generated_token';
      const expectedResponse = { token };
      const infos = { id: 'user_id', email, username: 'test_user' };
      sinon.stub(loginService, 'postLogin').resolves({ statusCode: 200, response: expectedResponse });
    

    
      req.body = { email, password };
      await loginController.postLogin(req as Request, res as Response);

     
      // assert.calledWith(loginService.postLogin as SinonStub, email, password);
      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.calledWith(expectedResponse)).to.be.true;
    });

    it('should return 401 with an error message if login fails', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const errorMessage = 'Invalid email or password';
      const expectedResponse = { message: errorMessage };
      sinon.stub(loginService, 'postLogin').resolves({ statusCode: 401, response: expectedResponse });

      req.body = { email, password };
      await loginController.postLogin(req as Request, res as Response);

  
      assert.calledWith(loginService.postLogin as SinonStub, email, password);
      expect(statusStub.calledWith(401)).to.be.true;
      expect(jsonStub.calledWith(expectedResponse)).to.be.true;
    });
  });


  describe('getLoginRole', () => {
    it('should return 200 with the user role if authorization token is valid', async () => {
      const authorization = 'valid_token';
      const role = 'admin';
      const expectedResponse = { role };
      sinon.stub(loginService, 'getLoginRole').resolves({ statusCode: 200, response: expectedResponse });

      req.headers = { authorization };
      await loginController.getLoginRole(req as Request, res as Response);

      
      // assert.calledWith(loginService.getLoginRole as SinonStub, authorization);
      expect(statusStub.calledWith(200)).to.be.true;
      expect(jsonStub.calledWith(expectedResponse)).to.be.true;
    });

    it('should return 401 with an error message if authorization token is not provided', async () => {
      const expectedResponse = { message: 'Token not found' };
      sinon.stub(loginService, 'getLoginRole').resolves({ statusCode: 401, response: expectedResponse });

      await loginController.getLoginRole(req as Request, res as Response);

  
      // assert.calledWith(loginService.getLoginRole as SinonStub, undefined)
      expect(statusStub.calledWith(401)).to.be.true;
      expect(jsonStub.calledWith(expectedResponse)).to.be.true;
    });
    
    it('should return 401 with an error message if authorization token is invalid', async () => {
      const authorization = 'invalid_token';
      const errorMessage = 'Token must be a valid token';
      const expectedResponse = { message: errorMessage };
      sinon.stub(loginService, 'getLoginRole').resolves({ statusCode: 401, response: expectedResponse });
    
      req.headers = { authorization };
      await loginController.getLoginRole(req as Request, res as Response);
    
      // assert.calledWith(loginService.getLoginRole as SinonStub, authorization);
      expect(statusStub.calledWith(401)).to.be.true;
      expect(jsonStub.calledWith(expectedResponse)).to.be.true;
    });
  });
});    
