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
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        max: 50,
      },
    },
    product_description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "product",
    timestamps: false,
  }
);

module.exports = Product;
