const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Role = sequelize.define(
  "Role",
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: ["^[a-z]+$", "i"],
        max: 50,
      },
      unique: true,
    },
  },
  {
    tableName: "role",
    timestamps: false,
  }
);

module.exports = Role;
