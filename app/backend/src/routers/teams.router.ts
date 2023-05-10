import { Router } from 'express';
import TeamsController from '../teams/teams.controller';

class TeamsRouter {
  constructor(
    public router: Router,
    private readonly teamsController: TeamsController,
  ) {
    this.router.get('/', (req, res) => this.teamsController.getAllTeams(req, res));
    this.router.get('/:id', (req, res) => this.teamsController.getTeamById(req, res));
  }
}

export default TeamsRouter;
