import { Router } from 'express';
import LeaderBoardController from '../leaderboards/leaderBoard.controller';

const router = Router();

const leaderBoardsController = new LeaderBoardController();

router.get('/home', (req, res) => leaderBoardsController.getHomeTeamsResults(req, res));
router.get('/away', (req, res) => leaderBoardsController.getAwayTeamsResults(req, res));
router.get('/', (req, res) => leaderBoardsController.getTeamsResults(req, res));

export default router;
