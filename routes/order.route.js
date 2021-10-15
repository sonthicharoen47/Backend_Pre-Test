const OrderRoute = require("express").Router();
const { Op } = require("sequelize");
const {
  checkAdminPermission,
  checkCustomerPermission,
} = require("../middleware/auth");

const {
  Order,
  OrderDetail,
  OrderStatus,
  ProductDetail,
  Status,
} = require("../models/index");

//*** */
OrderRoute.get("/findAll", checkAdminPermission, async (req, res) => {
  //total price
  let errors = [];
  let orderAll = await Order.findAll({
    include: [
      {
        model: OrderStatus,
        where: {
          orderStatus_status: "enable",
        },
        attributes: {
          exclude: ["fk_order", "fk_status", "orderStatus_status"],
        },
        include: [
          {
            model: Status,
          },
        ],
      },
      {
        model: OrderDetail,
        attributes: {
          exclude: ["fk_order", "fk_productDetail"],
        },
        include: [
          {
            model: ProductDetail,
            attributes: {
              exclude: ["fk_productDetail"],
            },
          },
        ],
      },
    ],
  }).catch((err) => {
    err.errors.map((e) => errors.push(e.message));
  });

  if (orderAll) {
    let result = [];
    for (let i = 0; i < orderAll.length; i++) {
      let total = 0;
      for (let j = 0; j < orderAll[i].OrderDetails.length; j++) {
        let amount = orderAll[i].OrderDetails[j].orderDetail_amount;
        let price =
          orderAll[i].OrderDetails[j].ProductDetail.productDetail_price;
        total += amount * price;
        //total = 0, add total in obj
        if (j === orderAll[i].OrderDetails.length - 1) {
          let data = orderAll[i].toJSON();
          data.total = total;
          result.push(data);
        }
      }
    }
    res.status(200).send(result);
  } else {
    res.status(403).send({ error: errors });
  }
});

OrderRoute.post("/find/me", async (req, res) => {
  let errors = [];
  let orderId = req.body.order_id;
  if (orderId && typeof orderId == "number") {
    let order = await Order.findOne({
      where: { order_id: orderId },
      include: [
        {
          model: OrderStatus,
          where: {
            orderStatus_status: "enable",
          },
          attributes: {
            exclude: ["fk_order", "fk_status", "orderStatus_status"],
          },
          include: [
            {
              model: Status,
            },
          ],
        },
        {
          model: OrderDetail,
          attributes: {
            exclude: ["fk_order", "fk_productDetail"],
          },
          include: [
            {
              model: ProductDetail,
              attributes: {
                exclude: ["fk_productDetail"],
              },
            },
          ],
        },
      ],
    }).catch((err) => {
      err.errors.map((e) => errors.push(e.message));
    });
    if (order) {
      let total = 0;
      for (let i = 0; i < order.OrderDetails.length; i++) {
        let amount = order.OrderDetails[i].orderDetail_amount;
        let price = order.OrderDetails[i].ProductDetail.productDetail_price;
        total += amount * price;
        //total = 0, add total in obj
        if (i === order.OrderDetails.length - 1) {
          let data = order.toJSON();
          data.total = total;
          res.status(200).send(data);
        }
      }
    } else {
      res.status(403).send({ error: `order is not found` });
    }
  } else {
    res.status(403).send({ error: `order id are type error or null` });
  }
});

OrderRoute.post("/create", checkCustomerPermission, async (req, res) => {
  let productList = req.body.productList;
  if (!productList || !Array.isArray(productList) || !productList.length > 0) {
    res.status(403).send({ error: `productList type error or null` });
  } else {
    //for check product
    let errors = [];
    let productdetailList = [];
    //get fk_product, amount from customer
    for (let i = 0; i < productList.length; i++) {
      let productdetail = await ProductDetail.findOne({
        where: {
          fk_product: productList[i].fk_product,
          productDetail_status: "enable",
        },
      });
      if (!productdetail) {
        errors.push(`product id ${productList[i].fk_product} not found!`);
        break;
      } else {
        productdetailList.push(productdetail.productDetail_id);
      }
    }

    if (errors.length > 0) {
      res.status(403).send(errors);
    } else {
      //validate success
      //create order
      let order = await Order.create({ fk_account: req.user.account_id }).catch(
        (err) => {
          err.errors.map((e) => errors.push(e.message));
        }
      );

      if (order) {
        //create orderdetail
        let orderdetail;
        for (let i = 0; i < productList.length; i++) {
          let data = {
            orderDetail_amount:
              productList[i].amount > 0 ? productList[i].amount : 1,
            fk_productDetail: productdetailList[i],
            fk_order: order.order_id,
          };
          orderdetail = await OrderDetail.create(data).catch((err) => {
            err.errors.map((e) => errors.push(e.message));
          });
        }
        if (orderdetail) {
          //find status = 'pending'
          let status = await Status.findOne({
            where: { status_name: "pending" },
          }).catch((err) => {
            err.errors.map((e) => errors.push(e.message));
          });
          if (status) {
            //create orderstatus
            let data = {
              fk_order: order.order_id,
              fk_status: status.status_id,
              orderStatus_date: new Date(),
              orderStatus_status: "enable",
            };
            let orderstatus = await OrderStatus.create(data);
            if (orderstatus) {
              res.status(200).send({ message: `create order successful!` });
            } else {
              res.status(403).send({ error: `create orderStatus fail` });
            }
          } else {
            res.status(403).send({ error: `status pending not found!` });
          }
        } else {
          res.status(403).send({ error: errors });
        }
      } else {
        res.status(403).send({ error: errors });
      }
    }
  }
});

//update order status
OrderRoute.put(
  "/updateOrderStatusByCustomer",
  checkCustomerPermission,
  async (req, res) => {
    let errors = [];
    //pending cancel-by-customer

    //get orderid from customer
    let orderId = req.body.order_id;
    if (typeof orderId == "number") {
      let validateOrder = await Order.findOne({
        where: {
          fk_account: req.user.account_id,
          order_id: orderId,
        },
      });
      if (validateOrder) {
        //find status = pending

        let status = await Status.findOne({
          where: { status_name: "pending" },
        });
        if (status) {
          let order = await OrderStatus.findOne({
            where: {
              fk_status: status.status_id,
              orderStatus_status: "enable",
              fk_order: orderId,
            },
            include: [
              {
                model: Order,
                where: { fk_account: req.user.account_id },
              },
            ],
          }).catch((err) => {
            err.errors.map((e) => errors.push(e.message));
          });

          if (order) {
            let updateStatus = await Status.findOne({
              where: { status_name: "cancelByCustomer" },
            });
            if (updateStatus) {
              //disable orderStatus pending
              let disableOrder = await OrderStatus.update(
                { orderStatus_status: "disable" },
                {
                  where: {
                    fk_order: orderId,
                  },
                }
              ).catch((err) => {
                err.errors.map((e) => errors.push(e.message));
              });
              if (disableOrder == 1) {
                //create new orderstatus
                let data = {
                  fk_order: orderId,
                  fk_status: updateStatus.status_id,
                  orderStatus_date: new Date(),
                  orderStatus_status: "enable",
                };
                await OrderStatus.create(data)
                  .then(() => {
                    res.status(200).send({
                      message: "cancel order by customer successful!",
                    });
                  })
                  .catch((err) => {
                    res
                      .status(403)
                      .send({ error: `cancel order fail!, ${err}` });
                  });
              } else {
                res.status(403).send({ error: `disable order fail!` });
              }
            } else {
              res
                .status(403)
                .send({ error: `status cancel-by-customer not found!` });
            }
          } else {
            res.status(403).send({ error: `order status pending are empthy!` });
          }
        } else {
          res
            .status(403)
            .send({ error: `order not found or order status is not pending!` });
        }
      } else {
        res.status(403).send({ error: errors });
      }
    } else {
      res.status(403).send({ error: `order id are type error or null!` });
    }
  }
);

OrderRoute.put(
  "/updateOrderStatusByAdmin",
  checkAdminPermission,
  async (req, res) => {
    //in-progress done cancel-by-admin
    //get fk_status || status_name, orderid from admin
    let orderId = req.body.order_id;
    let statusId = req.body.status_id;

    //check, verify type body
    if (typeof orderId == "number" && typeof statusId == "number") {
      //find status
      let verifyStatus = await Status.findOne({
        where: {
          status_id: statusId,
          status_name: { [Op.ne]: "cancelByCustomer" },
        },
      }).catch((err) => {
        err.errors.map((e) => errors.push(e.message));
      });

      if (verifyStatus) {
        //find order
        let verifyOrder = await OrderStatus.findOne({
          where: {
            fk_order: orderId,
            orderStatus_status: "enable",
          },
          include: [
            {
              model: Status,
              where: {
                status_name: { [Op.ne]: verifyStatus.status_name },
              },
            },
          ],
        });
        if (verifyOrder) {
          //order and status correct
          //disable prev orderstatus
          let disablePrevOrder = await OrderStatus.update(
            { orderStatus_status: "disable" },
            {
              where: {
                orderStatus_id: verifyOrder.orderStatus_id,
              },
            }
          );
          if (disablePrevOrder == 1) {
            //disable success
            //create new orderStatus
            let data = {
              fk_order: orderId,
              fk_status: statusId,
              orderStatus_date: new Date(),
              orderStatus_status: "enable",
            };
            await OrderStatus.create(data)
              .then(() => {
                res.status(200).send({
                  message: `update order status by admin successful!`,
                });
              })
              .catch((err) => {
                res
                  .status(403)
                  .send({ error: `update order status by admin fail: ${err}` });
              });
          } else {
            res.status(403).send({ error: `disable orderStatus fail!` });
          }
        } else {
          res
            .status(403)
            .send({ error: `order id is not found or new status as before!` });
        }
      } else {
        res
          .status(403)
          .send({ error: `status id not found or permissin denined!` });
      }
    } else {
      res
        .status(403)
        .send({ error: `order id & status id type error or null` });
    }
  }
);

module.exports = OrderRoute;
