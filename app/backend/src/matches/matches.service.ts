import Teams from '../database/models/Teams';
import Matches from '../database/models/Matches';

class MatchesService {
  getAllMatches = async () => {
    const allMatches = await Matches.findAll({
      include: [{ model: Teams, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Teams, as: 'awayTeam', attributes: { exclude: ['id'] } }],
    });
    return { statusCode: 200, response: allMatches };
  };
}

export default MatchesService;
