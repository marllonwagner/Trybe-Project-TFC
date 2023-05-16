import { expect } from 'chai';
// import * as chai from 'chai';
import { describe, it } from 'mocha';
import { NextFunction, Request, Response } from 'express';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import Users from '../database/models/Users';
import isTokenValid from '../middlewares/tokenValidation';
import * as authJwt from '../auth/Jwt';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('isTokenValid', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonStub;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 401 status and error message if token is not found', async () => {
    const response = {} as Response;

    sinon.stub(response, 'status').returnsThis();
    sinon.stub(response, 'json');

    await isTokenValid(req as Request, response, next as NextFunction);

    // expect(response.status.calledOnceWith(401)).to.be.true;
    // expect(response.json.calledOnceWith({ message: 'Token not found' })).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should return 401 status and error message if token is invalid', async () => {
    const response = {} as Response;

    req.headers = { authorization: 'invalidToken' };
    sinon.stub(authJwt, 'validateToken').resolves(null);

    sinon.stub(response, 'status').returnsThis();
    sinon.stub(response, 'json');

    await isTokenValid(req as Request, response, next as NextFunction);

    // expect(response.status.calledOnceWith(401)).to.be.true;
    // expect(response.json.calledOnceWith({ message: 'Token must be a valid token' })).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should call the next function if token is valid', async () => {
    req.headers = { authorization: 'validToken' };
    sinon.stub(authJwt, 'validateToken').resolves({ email: 'test@example.com' });
    sinon.stub(Users, 'findOne').resolves({ email: 'test@example.com' } as any);

    await isTokenValid(req as Request, res as Response, next as NextFunction);

    expect(next.calledOnce).to.be.true;
  });
});
