import MatchesService from '../matches/matches.service';
import Teams from '../database/models/Teams';
import ResultsService from './resultsCalcs.service';

class LeaderBoardService {
  private matchesService = new MatchesService();
  private resultsService = new ResultsService();

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

  getGeneralResult = async () => {
    const resultHome = await this.getTeamsResults('homeTeamId');
    const resultAway = await this.getTeamsResults('awayTeamId');
    const combinedArray = [...resultHome.response, ...resultAway.response].reduce((acc, obj) => {
      const existingIndex = acc.findIndex((item:any) => item.name === obj.name);
      if (existingIndex !== -1) {
        acc[existingIndex] = { ...acc[existingIndex],
          totalPoints: acc[existingIndex].totalPoints + obj.totalPoints,
          totalGames: acc[existingIndex].totalGames + obj.totalGames,
          totalVictories: acc[existingIndex].totalVictories + obj.totalVictories,
          totalDraws: acc[existingIndex].totalDraws + obj.totalDraws,
          totalLosses: acc[existingIndex].totalLosses + obj.totalLosses,
          goalsFavor: acc[existingIndex].goalsFavor + obj.goalsFavor,
          goalsOwn: acc[existingIndex].goalsOwn + obj.goalsOwn,
          goalsBalance: acc[existingIndex].goalsBalance + obj.goalsBalance };
        const efficiency = (acc[existingIndex].totalPoints * 100) / (acc[existingIndex].totalGames * 3);
        acc[existingIndex].efficiency = efficiency.toFixed(2);
      } else {
        acc.push({ ...obj, efficiency: (obj.totalPoints * 100) / (obj.totalGames * 3) });
      }
      return acc;
    }, []);
    return { statusCode: 200, response: this.resultsService.sortResults(combinedArray) };
  };
}

export default LeaderBoardService;
