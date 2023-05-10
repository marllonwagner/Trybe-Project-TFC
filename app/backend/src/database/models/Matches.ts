// models/Team.ts
import { Model, DataTypes } from 'sequelize';
import db from '.';
import Teams from './Teams';

class Matches extends Model {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

Matches.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    homeTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    homeTeamGoals: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    awayTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    awayTeamGoals: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    inProgress: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'matches',
    underscored: true,
    timestamps: false,
  },
);

Teams.hasMany(Matches, { foreignKey: 'awayTeam', as: 'teamFromAway' });
Teams.hasMany(Matches, { foreignKey: 'homeTeam', as: 'teamFromHome' });
Matches.belongsTo(Teams, { foreignKey: 'awayTeam', as: 'teamFromAway' });
Matches.belongsTo(Teams, { foreignKey: 'homeTeam', as: 'teamFromHome' });

export default Matches;
