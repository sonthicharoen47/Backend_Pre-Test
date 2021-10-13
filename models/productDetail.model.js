const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const ProductDetail = sequelize.define(
  "ProductDetail",
  {
    productDetail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    productDetail_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    productDetail_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDetail_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "productDetail",
  }
);

module.exports = ProductDetail;
