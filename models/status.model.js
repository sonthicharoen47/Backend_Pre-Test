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
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: ["^[a-z]+$", "i"],
        max: 50,
      },
    },
  },
  {
    tableName: "status",
    timestamps: false,
  }
);

module.exports = Status;
