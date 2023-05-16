import * as chai from 'chai';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { describe, it, beforeEach } from 'mocha';
import { Router, Request, Response, NextFunction } from 'express';
import isLoginValid from '../middlewares/loginValidations';
import loginRouter from '../routers/login.router';

const expect = chai.expect;

describe('Login Router', () => {
  let router: Router;
  let postStub: SinonStub;
  let getStub: SinonStub;

  beforeEach(() => {
    router = loginRouter as Router;
    postStub = sinon.stub();
    getStub = sinon.stub();
    sinon.replace(router, 'post', postStub);
    sinon.replace(router, 'get', getStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /', () => {
    it('deve chamar o middleware e o método postLogin do LoginController', () => {
      const req = {} as Request;
      const res = {} as Response;
      const next = {} as NextFunction;

      router.post('/', isLoginValid, () => {})(req, res, next);

      expect(postStub.calledOnce).to.be.true;
      expect(postStub.calledWith('/', isLoginValid, sinon.match.any)).to.be.true;
    });
  });

  describe('GET /role', () => {
    it('deve chamar o método getLoginRole do LoginController', () => {
      const req = {} as Request;
      const res = {} as Response;
      const next = {} as NextFunction;

      router.get('/role', () => {})(req, res, next);

      expect(getStub.calledOnce).to.be.true;
      expect(getStub.calledWith('/role', sinon.match.any)).to.be.true;
    });
  });
});
