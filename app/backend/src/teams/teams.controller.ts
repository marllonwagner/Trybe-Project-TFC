import { Response, Request } from 'express';
import TeamsService from './teams.service';

export default class TeamsController {
  constructor(private readonly teamService: TeamsService) {}

  async getAllTeams(_req: Request, res: Response) {
    const { statusCode, response } = await this.teamService.getAllTeams();
    res.status(statusCode).json(response);
  }

  async getTeamById(req: Request, res: Response) {
    const { id } = req.params;
    const { statusCode, response } = await this.teamService.getTeamById(Number(id));
    res.status(statusCode).json(response);
  }
}
