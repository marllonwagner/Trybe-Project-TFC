import Teams from '../database/models/Teams';

export default class TeamsService {
  getAllTeams = async () => {
    const allTeams = await Teams.findAll();
    return { statusCode: 200, response: allTeams };
  };

  getTeamById = async (id: number) => {
    const team = await Teams.findOne({ where: { id } });
    return { statusCode: 200, response: team };
  };
}
