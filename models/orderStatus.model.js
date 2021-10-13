const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const OrderStatus = sequelize.define(
  "OrderStatus",
  {
    orderStatus_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    orderStatus_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "orderStatus",
  }
);

module.exports = OrderStatus;
