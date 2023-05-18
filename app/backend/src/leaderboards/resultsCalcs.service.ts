import MatchesService from '../matches/matches.service';

class ResultsService {
  private matchesService = new MatchesService();

  public readonly victories = async (id:number, homerOrAway: string) => {
    const matches = await this.matchesService.allMatchesFinished(id, homerOrAway);
    if (homerOrAway === 'homeTeamId') {
      return matches.filter((e) => e.homeTeamGoals > e.awayTeamGoals).length;
    }
    return matches.filter((e) => e.homeTeamGoals < e.awayTeamGoals).length;
  };

  public readonly losses = async (id:number, homerOrAway: string) => {
    const matches = await this.matchesService.allMatchesFinished(id, homerOrAway);
    if (homerOrAway === 'homeTeamId') {
      return matches.filter((e) => e.homeTeamGoals < e.awayTeamGoals).length;
    }
    return matches.filter((e) => e.homeTeamGoals > e.awayTeamGoals).length;
  };

  public readonly draws = async (id:number, homerOrAway: string) => {
    const matches = await this.matchesService.allMatchesFinished(id, homerOrAway);
    return matches.filter((e) => e.homeTeamGoals === e.awayTeamGoals).length;
  };

  public readonly goalsFavor = async (id:number, homerOrAway: string) => {
    const matches = await this.matchesService.allMatchesFinished(id, homerOrAway);
    if (homerOrAway === 'homeTeamId') {
      return matches.reduce((acc, curr) => acc + curr.homeTeamGoals, 0);
    }
    return matches.reduce((acc, curr) => acc + curr.awayTeamGoals, 0);
  };

  public readonly goalsOwn = async (id:number, homerOrAway: string) => {
    const matches = await this.matchesService.allMatchesFinished(id, homerOrAway);
    if (homerOrAway === 'homeTeamId') {
      return matches.reduce((acc, curr) => acc + curr.awayTeamGoals, 0);
    }
    return matches.reduce((acc, curr) => acc + curr.homeTeamGoals, 0);
  };

  public readonly efficiency = async (id:number, homerOrAway: string) => {
    const maxPoints = (await this.matchesService.allMatchesFinished(id, homerOrAway)).length * 3;
    const pointsGot = await this.victories(id, homerOrAway) * 3 + await this.draws(id, homerOrAway);
    return (pointsGot * 100) / maxPoints;
  };

  public readonly sortResults = (arrInfoTeams: any) => arrInfoTeams.sort(
    (a: any, b: any) => (b.totalPoints - a.totalPoints
      || b.goalsBalance - a.goalsBalance || b.goalsFavor - a.goalsFavor || b.goalsOwn - a.goalsOwn),
  );
}

export default ResultsService;
