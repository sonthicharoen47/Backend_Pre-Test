const BasicRoute = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Account, AccountRole, Role } = require("../models");
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
  };

  if (data.hashPassword && data.hashPassword.length >= 8) {
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(data.hashPassword, salt);
    data.hashPassword = hash;

    let account = await Account.create(data).catch((err) => {
      err.errors.map((e) => errors.push(e.message));
    });

    if (account) {
      let role = await Role.findOne({
        where: {
          role_name: "customer",
        },
      }).catch((err) => {
        console.log(err);
      });

      if (!role) {
        res.status(500).send({ error: `role customer undefind` });
      } else {
        let data = {
          fk_account: account.account_id,
          fk_role: role.role_id,
          accountRole_status: "active",
        };
        let account_role = await AccountRole.create(data).catch((err) => {
          err.errors.map((e) => errors.push(e.message));
        });
        if (!account_role) {
          res.status(500).send({ error: errors });
        } else {
          res.status(200).send({ message: `register successful!` });
        }
      }
    } else {
      res.status(500).send({ error: errors });
    }
  } else {
    res.status(500).send({
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
      //find accountRole
      let role = await AccountRole.findOne({
        where: {
          fk_account: user.account_id,
          accountRole_status: "active",
        },
        include: [
          {
            model: Role,
            attributes: ["role_name"],
          },
        ],
      });

      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }

        const payload = {
          id: role.role_id,
          fname: req.user.account_fname,
          lname: req.user.lname,
          email: req.user.email,
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
