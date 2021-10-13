const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "product",
  }
);

module.exports = Product;
