import Teams from '../database/models/Teams';
import Matches from '../database/models/Matches';
import { validateToken } from '../auth/Jwt';
import Users from '../database/models/Users';

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

  public readonly finishMatch = async (authorization:any, id:any) => {
    if (!authorization) {
      return { statusCode: 401, response: { message: 'Token not found' } };
    }
    const token = await validateToken(authorization);
    const isValid = token && await Users.findOne({ where: { email: token.email } });
    if (isValid === null) {
      return { statusCode: 401, response: { message: 'Token must be a valid token' } };
    }
    await Matches.update(
      { inProgress: false },
      { where: { id } },
    );
    return { statusCode: 200, response: { message: 'Finished' } };
  };
}

export default MatchesService;
