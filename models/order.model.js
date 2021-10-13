const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    tableName: "order",
  }
);

module.exports = Order;
