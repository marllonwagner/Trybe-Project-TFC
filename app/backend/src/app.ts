import * as express from 'express';

import TeamsRouter from './routers/teams.router';
import TeamsController from './teams/teams.controller';
import TeamsService from './teams/teams.service';
import LoginRouter from './routers/login.router';
import MatchesRouter from './routers/matches.router';
import LeaderBoardRouter from './routers/leaderboards.rotuer';
// import isLoginValid from './middlewares/loginValidations';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    // Não remover essa rota
    this.app.get('/', (_req, res) => res.json({ ok: true }));
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);

    const teamsService = new TeamsService();
    const teamsController = new TeamsController(teamsService);
    const teamsRouter = new TeamsRouter(express.Router(), teamsController);

    this.app.use('/teams', teamsRouter.router);
    this.app.use('/login', LoginRouter);
    this.app.use('/matches', MatchesRouter);
    this.app.use('/leaderboard', LeaderBoardRouter);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// Essa segunda exportação é estratégica, e a execução dos testes de cobertura depende dela
export const { app } = new App();
