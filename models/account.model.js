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
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: ["^[a-z]+$", "i"],
        max: 50,
      },
    },
    account_lname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: ["^[a-z]+$", "i"],
        max: 50,
      },
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isEmail: true,
        max: 50,
      },
      unique: true,
    },
    hashPassword: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "account",
    timestamps: false,
  }
);

module.exports = Account;
