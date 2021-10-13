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
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: ["^[a-z]+$", "i"],
        max: 50,
      },
    },
    productDetail_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
  },
  {
    tableName: "productDetail",
    timestamps: false,
  }
);

module.exports = ProductDetail;
