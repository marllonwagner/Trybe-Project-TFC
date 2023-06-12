import { Request, Response } from 'express';
import LeaderBoardService from './leaderBoard.service';

class LeaderBoardController {
  private leaderBoardService = new LeaderBoardService();

  async getHomeTeamsResults(req:Request, res: Response) {
    const { statusCode, response } = await this.leaderBoardService.getTeamsResults('homeTeamId');
    return res.status(statusCode).json(response);
  }

  async getAwayTeamsResults(req:Request, res: Response) {
    const { statusCode, response } = await this.leaderBoardService.getTeamsResults('awayTeamId');
    return res.status(statusCode).json(response);
  }

  async getTeamsResults(req:Request, res: Response) {
    const { statusCode, response } = await this.leaderBoardService.getGeneralResult();
    return res.status(statusCode).json(response);
  }
}

export default LeaderBoardController;
