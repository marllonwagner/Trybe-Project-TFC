import { Request, Response } from 'express';
import MatchesService from './matches.service';

class MatchesController {
  private matchesService = new MatchesService();

  async getAllMatches(req:Request, res:Response) {
    const { inProgress } = req.query;
    const { statusCode, response } = await this.matchesService.getAllMatches(inProgress);
    res.status(statusCode).json(response);
  }

  async finishMatch(req:Request, res:Response) {
    const { id } = req.params;
    const { authorization } = req.headers;
    const { statusCode, response } = await this.matchesService.finishMatch(authorization, id);
    res.status(statusCode).json(response);
  }

  async updateMatch(req:Request, res:Response) {
    const { id } = req.params;
    const { authorization } = req.headers;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const { statusCode, response } = await this
      .matchesService.updateMatch(authorization, id, homeTeamGoals, awayTeamGoals);
    res.status(statusCode).json(response);
  }
}

export default MatchesController;
