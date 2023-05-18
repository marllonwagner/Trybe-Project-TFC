import MatchesService from '../matches/matches.service';
import Teams from '../database/models/Teams';
import ResultsService from './resultsCalcs.service';

class LeaderBoardService {
  private readonly matchesService = new MatchesService();
  private readonly resultsService = new ResultsService();

  getTeamsResults = async (homeOrAway:string) => {
    const getAllTeams = await Teams.findAll();
    const arrResults = await Promise.all(getAllTeams.map(async ({ id, teamName }) => ({
      name: teamName,
      totalPoints: (await this.resultsService.victories(id, homeOrAway) * 3
          + await this.resultsService.draws(id, homeOrAway)),
      totalGames: ((await this.matchesService.allMatchesFinished(id, homeOrAway)).length),
      totalVictories: (await this.resultsService.victories(id, homeOrAway)),
      totalDraws: (await this.resultsService.draws(id, homeOrAway)),
      totalLosses: (await this.resultsService.losses(id, homeOrAway)),
      goalsFavor: (await this.resultsService.goalsFavor(id, homeOrAway)),
      goalsOwn: (await this.resultsService.goalsOwn(id, homeOrAway)),
      goalsBalance: (await this.resultsService.goalsFavor(id, homeOrAway)
          - await this.resultsService.goalsOwn(id, homeOrAway)),
      efficiency: ((await this.resultsService.efficiency(id, homeOrAway)).toFixed(2)),
    })));
    const finalResult = this.resultsService.sortResults(arrResults);
    return { statusCode: 200, response: finalResult };
  };
}

export default LeaderBoardService;
