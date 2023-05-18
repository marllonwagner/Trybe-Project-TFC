import { Router } from 'express';
import LeaderBoardController from '../leaderboards/leaderBoard.controller';

const router = Router();

const leaderBoardsController = new LeaderBoardController();

router.get('/home', (req, res) => leaderBoardsController.getHomeTeamsResults(req, res));

export default router;
