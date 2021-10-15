const ProductRoute = require("express").Router();
const { Product, ProductDetail } = require("../models/index");

const { checkAdminPermission } = require("../middleware/auth");
const { Op } = require("sequelize");

ProductRoute.get("/findAll", async (req, res) => {
  await ProductDetail.findAll({
    where: {
      productDetail_status: "enable",
    },
    attributes: { exclude: ["productDetail_status"] },
    order: [["fk_product", "ASC"]],
    include: [
      {
        model: Product,
        attributes: ["product_name", "product_description"],
      },
    ],
  })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

//create product
ProductRoute.post("/create", checkAdminPermission, async (req, res) => {
  let errors = [];
  let productData = {
    product_name: req.body.product_name,
    product_description: req.body.product_description || null,
  };
  if (typeof req.body.product_price == "number" && req.body.product_price) {
    let product = await Product.create(productData).catch((err) => {
      err.errors.map((e) => errors.push(e.message));
    });
    if (product) {
      //create product detail date,status, price
      let productdetailData = {
        productDetail_price: req.body.product_price,
        productDetail_status: "enable",
        productDetail_date: new Date(),
        fk_product: product.product_id,
      };
      let productdetail = await ProductDetail.create(productdetailData).catch(
        (err) => {
          err.errors.map((e) => errors.push(e.message));
        }
      );

      if (productdetail) {
        res.status(200).send({ message: `create a new product success!` });
      } else {
        res.status(403).send({ error: errors });
      }
    } else {
      res.status(403).send({ error: errors });
    }
  } else {
    res.status(403).send({ error: `please defined first price` });
  }
});

//smart search
ProductRoute.post("/search", async (req, res) => {
  let search = req.body.search_string || "";

  await ProductDetail.findAll({
    where: {
      productDetail_status: "enable",
    },
    attributes: { exclude: ["productDetail_status"] },
    order: [["fk_product", "ASC"]],
    include: [
      {
        model: Product,
        attributes: ["product_name", "product_description"],
        where: {
          product_name: { [Op.iLike]: "%" + search + "%" },
        },
      },
    ],
  })
    .then((result) => res.status(200).send(result))
    .catch((err) => {
      res.status(403).send({ error: `find product fail, ${err}` });
    });
});

ProductRoute.post("/addNewPrice", checkAdminPermission, async (req, res) => {
  let errors = [];
  let data = {
    fk_product: req.body.product_id,
    productDetail_price: req.body.new_price,
    productDetail_date: new Date(),
    productDetail_status: "enable",
  };

  if (
    typeof data.fk_product == "number" &&
    typeof data.productDetail_price == "number" &&
    data.fk_product &&
    data.productDetail_price
  ) {
    //set prev productDetail status from enable to disable
    let disablePrevPrice = await ProductDetail.update(
      { productDetail_status: "disable" },
      {
        where: {
          fk_product: req.body.product_id,
        },
      }
    ).catch((err) => {
      err.errors.map((e) => errors.push(e.message));
    });

    if (disablePrevPrice == 1) {
      // 1 = success
      let newPrice = await ProductDetail.create(data).catch((err) => {
        err.errors.map((e) => errors.push(e.message));
      });

      if (newPrice) {
        res.status(200).send({ message: `create new price successful!` });
      } else {
        res.status(403).send({ error: errors });
      }
    } else {
      res.status(403).send({ error: `product not found` });
    }
  } else {
    res
      .status(403)
      .send({ error: `product id or new price are type error or null` });
  }
});

module.exports = ProductRoute;
