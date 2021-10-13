const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Account = sequelize.define(
  "Account",
  {
    account_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    account_fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_lname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashPassword: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "account",
  }
);

module.exports = Account;
