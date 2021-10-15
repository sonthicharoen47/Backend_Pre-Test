const passport = require("passport");
const { ensureAuthenticated } = require("../middleware/auth");

module.exports = (app) => {
  app.use("/", require("./basic.route"));

  app.use(
    "/product",
    ensureAuthenticated,
    passport.authenticate("jwt", { session: false }),
    require("./product.route")
  );

  app.use(
    "/order",
    ensureAuthenticated,
    passport.authenticate("jwt", { session: false }),
    require("./order.route")
  );
};
