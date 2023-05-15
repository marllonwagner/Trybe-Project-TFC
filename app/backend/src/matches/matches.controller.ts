import { Request, Response } from 'express';
import MatchesService from './matches.service';

class MatchesController {
  private matchesService = new MatchesService();

  async getAllMatches(req:Request, res:Response) {
    const { inProgress } = req.query;
    console.log(inProgress);
    const { statusCode, response } = await this.matchesService.getAllMatches(inProgress);
    res.status(statusCode).json(response);
  }
}

export default MatchesController;
