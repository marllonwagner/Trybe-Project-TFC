import { Router } from 'express';
import MatchesController from '../matches/matches.controller';

const router = Router();

const matchesController = new MatchesController();

router.get('/', (req, res) => matchesController.getAllMatches(req, res));
router.patch('/:id/finish', (req, res) => matchesController.finishMatch(req, res));

export default router;
