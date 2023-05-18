import Teams from '../database/models/Teams';
import Matches from '../database/models/Matches';
import TeamsService from '../teams/teams.service';

class MatchesService {
  private teamService = new TeamsService();
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

  public readonly finishMatch = async (authorizarion: any, id:any) => {
    await Matches.update(
      { inProgress: false },
      { where: { id } },
    );
    return { statusCode: 200, response: { message: 'Finished' } };
  };

  public readonly updateMatch = async (
    authorization:any,
    id:any,
    homeTeamGoals:any,
    awayTeamGoals:any,
  ) => {
    await Matches.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
    return { statusCode: 200,
      response: {
        homeTeamGoals,
        awayTeamGoals,
      } };
  };

  public readonly createMatch = async (matchInfo:any) => {
    const teamExists = await this.teamService.getTeamById(matchInfo.homeTeamId);
    if (matchInfo.homeTeamId === matchInfo.awayTeamId) {
      return { statusCode: 422,
        response: { message: 'It is not possible to create a match with two equal teams' } };
    }
    const newMatch = await Matches.create({ ...matchInfo, inProgress: true });
    if (teamExists.response === null) {
      return { statusCode: 404, response: { message: 'There is no team with such id!' } };
    }
    return { statusCode: 201,
      response: {
        id: newMatch.id,
        homeTeamId: newMatch.homeTeamId,
        homeTeamGoals: newMatch.homeTeamGoals,
        awayTeamId: newMatch.awayTeamId,
        awayTeamGoals: newMatch.awayTeamGoals,
        inProgress: newMatch.inProgress,
      } };
  };

  public readonly allMatchesFinished = async (id:number, homeOrAway: string) => {
    const matches = await Matches.findAll({ where: { inProgress: false } });
    return matches.filter((e:any) => e[homeOrAway] === id);
  };
}

export default MatchesService;
