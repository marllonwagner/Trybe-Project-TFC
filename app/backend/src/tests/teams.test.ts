import * as chai from 'chai';
import * as sinon from 'sinon'
import { SinonStub } from 'sinon';
import { describe, it, beforeEach } from 'mocha';
import TeamsController from '../teams/teams.controller';
import TeamsService from '../teams/teams.service';
import Teams from '../database/models/Teams';
import { allTeamsMock, oneTeam } from './mocks/teams.mock';

const expect = chai.expect;

describe('TeamsController', () => {
  let teamsController: TeamsController;
  let teamsService: TeamsService;
  let getAllTeamsStub: SinonStub;
  let getTeamByIdStub: SinonStub;
  let findAllStub: SinonStub;
  let res: any;

  beforeEach(() => {
    teamsService = new TeamsService();
    teamsController = new TeamsController(teamsService);
    findAllStub = sinon.stub(Teams, 'findAll');
    getAllTeamsStub = sinon.stub(teamsService, 'getAllTeams');
    getTeamByIdStub = sinon.stub(teamsService, 'getTeamById');
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(() => {
    findAllStub.restore();
  });

  describe('getAllTeams', () => {
    it('deve retornar todos os times', async () => {
      const teams = allTeamsMock;
      findAllStub.resolves({ statusCode: 200, response: teams });
      getAllTeamsStub.resolves({ statusCode: 200, response: teams });

      const req: any = {};

      await teamsController.getAllTeams(req, res);
      const result = await teamsService.getAllTeams();

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(teams)).to.be.true;
      expect(result.statusCode).to.equal(200);
      expect(result.response).to.deep.equal(teams);
      expect(findAllStub.calledOnce).to.be.true;
    });
  });

  describe('getTeamById', () => {
    it('deve retornar um time específico pelo ID', async () => {
      const id = 1;
      const team =  oneTeam 
      getTeamByIdStub.resolves({ statusCode: 200, response: team });

      const req: any = { params: { id } };

      await teamsController.getTeamById(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(team)).to.be.true;
      expect(getTeamByIdStub.calledWith(id)).to.be.true;
    });
  });
});
