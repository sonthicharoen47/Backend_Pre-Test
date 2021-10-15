const BasicRoute = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Account, Role } = require("../models");
const saltRounds = 10;
const { ensureAuthenticated } = require("../middleware/auth");

//register
BasicRoute.post("/register", async (req, res) => {
  let errors = [];

  const data = {
    account_fname: req.body.account_fname,
    account_lname: req.body.account_lname,
    email: req.body.email,
    hashPassword: req.body.hashPassword,
    fk_role: null,
  };

  if (data.hashPassword && data.hashPassword.length >= 8) {
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(data.hashPassword, salt);
    data.hashPassword = hash;

    let role = await Role.findOne({
      where: {
        role_name: "customer",
      },
    }).catch((err) => {
      console.log(err);
    });

    if (!role) {
      res.status(403).send({ error: `role customer undefind` });
    } else {
      data.fk_role = role.role_id;
      let account = await Account.create(data).catch((err) => {
        err.errors.map((e) => errors.push(e.message));
      });
      if (account) {
        res.status(200).send({ message: `register successful` });
      } else {
        res.status(403).send({ error: errors });
      }
    }
  } else {
    res.status(403).send({
      error: `password can not be empthy and must more than 8 character`,
    });
  }
});

//login
BasicRoute.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ success: false, info });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }

        const payload = {
          sub: req.user.email,
          fname: req.user.account_fname,
          lname: req.user.account_lname,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: "1d",
        });
        return res.status(200).json({ token });
      });
    }
  )(req, res, next);
});

//logout
BasicRoute.get("/logout", ensureAuthenticated, (req, res) => {
  req.logout();
  res.status(200).send({ message: "logout successful!" });
});

module.exports = BasicRoute;
