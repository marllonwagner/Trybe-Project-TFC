import { Request, Response } from 'express';
import LeaderBoardService from './leaderBoard.service';

class LeaderBoardController {
  private leaderBoardService = new LeaderBoardService();

  async getHomeTeamsResults(req:Request, res: Response) {
    const { statusCode, response } = await this.leaderBoardService.getTeamsResults('homeTeamId');
    return res.status(statusCode).json(response);
  }
}

export default LeaderBoardController;
