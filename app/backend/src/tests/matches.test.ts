import  * as chai from 'chai';
import  { SinonStub } from 'sinon';
import * as sinon from 'sinon';
import { describe, it, beforeEach } from 'mocha';
import MatchesController from '../matches/matches.controller';
import MatchesService from '../matches/matches.service';


const expect = chai.expect;

describe('MatchesController', () => {
  let matchesController: MatchesController;
  let matchesService: MatchesService;
  let teamServiceStub: SinonStub;
  let getAllMatchesStub: SinonStub;
  let finishMatchStub: SinonStub;
  let updateMatchStub: SinonStub;
  let createMatchStub: SinonStub;
  let res: any;

  beforeEach(() => {
    matchesService = new MatchesService();
    matchesController = new MatchesController();
    getAllMatchesStub = sinon.stub(matchesService, 'getAllMatches');
    finishMatchStub = sinon.stub(matchesService, 'finishMatch');
    updateMatchStub = sinon.stub(matchesService, 'updateMatch');
    createMatchStub = sinon.stub(matchesService, 'createMatch');
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });


  describe('getAllMatches', () => {
    it('deve retornar todas as partidas em andamento', async () => {
      const inProgressMatches = [{ /* partida em andamento */ }];
      getAllMatchesStub.resolves({ statusCode: 200, response: inProgressMatches });

      const req: any = { query: { inProgress: 'true' } };

      await matchesController.getAllMatches(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(inProgressMatches)).to.be.true;
    });

    it('deve retornar todas as partidas finalizadas', async () => {
      const finishedMatches = [{ /* partidas finalizadas */ }];
      getAllMatchesStub.resolves({ statusCode: 200, response: finishedMatches });

      const req: any = { query: { inProgress: 'false' } };

      await matchesController.getAllMatches(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(finishedMatches)).to.be.true;
    });

    it('deve retornar todas as partidas', async () => {
      const allMatches = [{ /* todas as partidas */ }];
      getAllMatchesStub.resolves({ statusCode: 200, response: allMatches });

      const req: any = { query: {} };

      await matchesController.getAllMatches(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(allMatches)).to.be.true;
    });
  });

  describe('finishMatch', () => {
    it('deve finalizar uma partida existente', async () => {
      const id = '123';
      const authorization = 'token';
      const finishResponse = { message: 'Finished' };
      finishMatchStub.resolves({ statusCode: 200, response: finishResponse });

      const req: any = { params: { id }, headers: { authorization } };

      await matchesController.finishMatch(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(finishResponse)).to.be.true;
      expect(finishMatchStub.calledWith(authorization, id)).to.be.true;
    });
  });

  describe('updateMatch', () => {
    it('deve atualizar uma partida existente', async () => {
      const id = '123';
      const authorization = 'token';
      const homeTeamGoals = 2;
      const awayTeamGoals = 1;
      const updateResponse = { homeTeamGoals, awayTeamGoals };
      updateMatchStub.resolves({ statusCode: 200, response: updateResponse });
      const req: any = { params: { id }, headers: { authorization }, body: { homeTeamGoals, awayTeamGoals } };

      await matchesController.updateMatch(req, res);
    
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updateResponse)).to.be.true;
      expect(updateMatchStub.calledWith(authorization, id, homeTeamGoals, awayTeamGoals)).to.be.true;
    });
  });


  describe('createMatch', () => {
    it('deve criar uma nova partida', async () => {
    const matchInfo = {
      "homeTeamId": 16, 
      "awayTeamId": 8, 
      "homeTeamGoals": 2,
      "awayTeamGoals": 2,
    };
    const createResponse = {
      "id": 1,
      "homeTeamId": 16,
      "homeTeamGoals": 2,
      "awayTeamId": 8,
      "awayTeamGoals": 2,
      "inProgress": true,
    }
    createMatchStub.resolves({ statusCode: 201, response: createResponse });
    const req: any = { body: matchInfo };

    await matchesController.createMatch(req, res);
  
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createResponse)).to.be.true;
    expect(createMatchStub.calledWith(matchInfo)).to.be.true;
  });
  it('deve retornar um erro 422 quando tentar criar uma partida com dois times iguais', async () => {
    const matchInfo = { homeTeamId: '1', awayTeamId: '1' };
    const teamExists = { statusCode: 200, response: { id: '1' } };
    teamServiceStub.resolves(teamExists);

    const createResponse = { statusCode: 422, response: { message: 'It is not possible to create a match with two equal teams' } };

    const result = await matchesService.createMatch(matchInfo);

    expect(result).to.deep.equal(createResponse);
    expect(teamServiceStub.calledWith('1')).to.be.true;
  });

  it('deve retornar um erro 404 quando o time de casa não existe', async () => {
    const matchInfo = { homeTeamId: '1', awayTeamId: '2' };
    const teamExists = { statusCode: 404, response: null };
    teamServiceStub.resolves(teamExists);

    const createResponse = { statusCode: 404, response: { message: 'There is no team with such id!' } };

    const result = await matchesService.createMatch(matchInfo);

    expect(result).to.deep.equal(createResponse);
    expect(teamServiceStub.calledWith('1')).to.be.true;
  });
});
});