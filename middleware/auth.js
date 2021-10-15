const { Role } = require("../models");

const ensureAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send("Please login!");
  }
};

const checkAdminPermission = async (req, res, next) => {
  let verifyPermission = await Role.findByPk(req.user.fk_role).catch(() =>
    res.status(401).send({ error: `permission denined` })
  );
  if (verifyPermission.role_name !== "admin") {
    res.status(401).send({ error: `permission denined` });
  } else {
    next();
  }
};

const checkCustomerPermission = async (req, res, next) => {
  let verifyPermission = await Role.findByPk(req.user.fk_role).catch(() =>
    res.status(401).send({ error: `permission denined` })
  );
  if (verifyPermission.role_name !== "customer") {
    res.status(401).send({ error: `customer only!` });
  } else {
    next();
  }
};

module.exports = {
  ensureAuthenticated,
  checkAdminPermission,
  checkCustomerPermission,
};
