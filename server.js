const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

require("dotenv").config();
require("./config/passport")(passport);

const { testDatabaseConnection } = require("./config/dbConfig");
const SyncModel = require("./config/dbSyncModel");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//passport initial
app.use(passport.initialize());
app.use(passport.session());

//check database connection
testDatabaseConnection();

//sync all model
SyncModel();

require("./routes/index")(app);

app.listen(PORT, async () => {
  console.log(`server is running on port ${PORT}.`);
});
