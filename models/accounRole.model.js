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
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "accountRole",
  }
);



module.exports = AccountRole;
