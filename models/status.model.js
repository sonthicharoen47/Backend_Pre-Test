const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Status = sequelize.define(
  "Status",
  {
    status_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    status_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "status",
  }
);

module.exports = Status;
