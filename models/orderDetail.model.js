const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    orderDetail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    orderDetail_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: true,
        min: 1,
      },
    },
  },
  {
    tableName: "orderDetail",
    timestamps: false,
  }
);

module.exports = OrderDetail;
