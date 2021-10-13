const Account = require("./account.model");
const AccountRole = require("./accounRole.model");
const Order = require("./order.model");
const OrderDetail = require("./orderDetail.model");
const OrderStatus = require("./orderStatus.model");
const Product = require("./product.model");
const ProductDetail = require("./productDetail.model");
const Role = require("./role.model");
const Status = require("./status.model");

//hasone
//belongsTo // fk_? is here

//account role accountRole
Account.hasOne(AccountRole, { foreignKey: "fk_account" });
AccountRole.belongsTo(Account, { foreignKey: "fk_account" });

Role.hasMany(AccountRole, { foreignKey: "fk_role" });
AccountRole.belongsTo(Role, { foreignKey: "fk_role" });

//product productDetail
Product.hasMany(ProductDetail, { foreignKey: "fk_product" });
ProductDetail.belongsTo(Product, { foreignKey: "fk_product" });

//order orderDetail
Order.hasMany(OrderDetail, { foreignKey: "fk_order" });
OrderDetail.belongsTo(Order, { foreignKey: "fk_order" });

//order status orderStatus
Order.hasMany(OrderStatus, { foreignKey: "fk_order" });
OrderStatus.belongsTo(Order, { foreignKey: "fk_order" });

Status.hasMany(OrderStatus, { foreignKey: "fk_status" });
OrderStatus.belongsTo(Status, { foreignKey: "fk_status" });

//productDetail orderDetail
ProductDetail.hasMany(OrderDetail, { foreignKey: "fk_productDetail" });
OrderDetail.belongsTo(ProductDetail, { foreignKey: "fk_productDetail" });


module.exports = {
  Account,
  AccountRole,
  Order,
  OrderDetail,
  OrderStatus,
  Product,
  ProductDetail,
  Role,
  Status,
};
