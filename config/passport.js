const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { Account } = require("../models/index");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "hashPassword" },
      async (email, hashPassword, done) => {
        if (email && hashPassword) {
          let user = await Account.findOne({
            where: {
              email: email,
            },
          }).catch((err) => {
            console.log(`logged in error : ${err}`);
            return done(err);
          });
          if (!user) {
            return done(null, false, { message: "no such user found" });
          } else {
            let validatePassword = bcrypt.compareSync(
              hashPassword,
              user.hashPassword
            );
            if (!validatePassword) {
              return done(null, false, {
                message: "password did not match",
              });
            } else {
              return done(null, user);
            }
          }
        } else {
          console.log("email or password are empty!");
          return done(null, false, { message: "email or password are empty!" });
        }
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET_KEY,
      },
      async (jwtPayload, done) => {
        try {
          let user = await Account.findOne({
            where: {
              email: jwtPayload.sub,
            },
            attributes: { exclude: ["hashPassword"] },
          });
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    console.log("serializeUser");
    done(null, user);
  });

  passport.deserializeUser(async function (user, done) {
    console.log("deserializeUser");
    await Account.findByPk(user.account_id, {
      attributes: { exclude: ["hashPassword"] },
    })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err, null));
  });
};
