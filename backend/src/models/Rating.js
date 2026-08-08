const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Rating extends Model {}

Rating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'stores', key: 'id' },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Rating must be at least 1' },
        max: { args: [5], msg: 'Rating must be at most 5' },
      },
    },
  },
  {
    sequelize,
    modelName: 'Rating',
    tableName: 'ratings',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'store_id'],
      },
    ],
  }
);

module.exports = Rating;
