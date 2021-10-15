const { sequelize } = require("./dbConfig");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const {
  Role,
  Account,
  Status,
  ProductDetail,
  Product,
  Order,
  OrderDetail,
  OrderStatus,
} = require("../models/index");

const SyncModel = async () => {
  await sequelize
    .sync({ force: true, logging: false }) //force -> reset when start or alter optimize
    .then(async () => {
      console.log(`sync model successful!`);

      //create role customer, admin
      await Role.create({ role_name: "customer" }).catch((err) => {
        console.log(err);
      });
      let roleAdmin = await Role.create({ role_name: "admin" }).catch((err) => {
        console.log(err);
      });
      //create admin account,
      let salt = bcrypt.genSaltSync(saltRounds);
      let password = "12345678";
      await Account.create({
        account_fname: "kittikon",
        account_lname: "sonthicharoen",
        email: "admin@mail.com",
        hashPassword: bcrypt.hashSync(password, salt),
        fk_role: roleAdmin.role_id,
      }).catch((err) => {
        console.log(err);
      });
      //create status
      //pending
      await Status.create({ status_name: "pending" }).catch((err) => {
        console.log(err);
      });
      //in-progress
      await Status.create({ status_name: "inProgress" }).catch((err) => {
        console.log(err);
      });
      //done
      await Status.create({ status_name: "done" }).catch((err) => {
        console.log(err);
      });
      //cancel-by-customer
      await Status.create({ status_name: "cancelByCustomer" }).catch((err) => {
        console.log(err);
      });
      //cancel-by-admin
      await Status.create({ status_name: "cancelByAdmin" }).catch((err) => {
        console.log(err);
      });
      //create 3 product
      //Iphone 8
      let product_1 = await Product.create({
        product_name: "Iphone 8",
        product_description: "officially launched date: September 22, 2017",
      }).catch((err) => {
        console.log(err);
      });
      await ProductDetail.create({
        fk_product: product_1.product_id,
        productDetail_price: 9500,
        productDetail_date: new Date(),
        productDetail_status: "enable",
      }).catch((err) => {
        console.log(err);
      });
      //Iphone 12
      let product_2 = await Product.create({
        product_name: "Iphone 12",
        product_description: "officially launched on Friday, October 23, 2020",
      }).catch((err) => {
        console.log(err);
      });
      await ProductDetail.create({
        fk_product: product_2.product_id,
        productDetail_price: 29900,
        productDetail_date: new Date(),
        productDetail_status: "enable",
      }).catch((err) => {
        console.log(err);
      });
      //MacBook M1
      let product_3 = await Product.create({
        product_name: "MacBook Air 2020",
        product_description: "officially launched date: 18th March 2020",
      }).catch((err) => {
        console.log(err);
      });
      await ProductDetail.create({
        fk_product: product_3.product_id,
        productDetail_price: 32500,
        productDetail_date: new Date(),
        productDetail_status: "enable",
      }).catch((err) => {
        console.log(err);
      });
    })
    .catch((err) => {
      console.log(`sync model error: ${err}`);
    });
};

module.exports = SyncModel;
