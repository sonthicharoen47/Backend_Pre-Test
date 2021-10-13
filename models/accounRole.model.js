const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const AccountRole = sequelize.define(
  "AccountRole",
  {
    accountRole_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    accountRole_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: ["^[a-z]+$", "i"],
        max: 50,
      },
    },
  },
  {
    tableName: "accountRole",
    timestamps: false,
  }
);

module.exports = AccountRole;
