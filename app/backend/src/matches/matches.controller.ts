import { Request, Response } from 'express';
import MatchesService from './matches.service';

class MatchesController {
  private matchesService = new MatchesService();

  async getAllMatches(req:Request, res:Response) {
    const { statusCode, response } = await this.matchesService.getAllMatches();
    res.status(statusCode).json(response);
  }
}

export default MatchesController;
