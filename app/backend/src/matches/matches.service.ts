import Teams from '../database/models/Teams';
import Matches from '../database/models/Matches';

class MatchesService {
  getAllMatches = async (inProgress: any) => {
    if (inProgress === 'true') {
      const inProgressMatches = await Matches.findAll({ where: { inProgress: true },
        include: [{ model: Teams, as: 'homeTeam', attributes: { exclude: ['id'] } },
          { model: Teams, as: 'awayTeam', attributes: { exclude: ['id'] } }] });
      return { statusCode: 200, response: inProgressMatches };
    }
    if (inProgress === 'false') {
      const finishedMatches = await Matches.findAll({ where: { inProgress: false },
        include: [{ model: Teams, as: 'homeTeam', attributes: { exclude: ['id'] } },
          { model: Teams, as: 'awayTeam', attributes: { exclude: ['id'] } }] });
      return { statusCode: 200, response: finishedMatches };
    }
    const allMatches = await Matches.findAll({
      include: [{ model: Teams, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Teams, as: 'awayTeam', attributes: { exclude: ['id'] } }],
    });
    return { statusCode: 200, response: allMatches };
  };
}

export default MatchesService;
