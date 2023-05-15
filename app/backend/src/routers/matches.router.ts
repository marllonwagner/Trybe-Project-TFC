import { Router } from 'express';
import MatchesController from '../matches/matches.controller';
import isTokenValid from '../middlewares/tokenValidation';

const router = Router();

const matchesController = new MatchesController();

router.get('/', (req, res) => matchesController.getAllMatches(req, res));
router.patch('/:id/finish', isTokenValid, (req, res) => matchesController.finishMatch(req, res));
router.patch('/:id', isTokenValid, (req, res) => matchesController.updateMatch(req, res));
router.post('/', isTokenValid, (req, res) => matchesController.createMatch(req, res));

export default router;
