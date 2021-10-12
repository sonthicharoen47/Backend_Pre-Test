const express = require("express");
const cors = require("cors");

require("dotenv").config();
const { testDatabaseConnection } = require("./config/dbConfig");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

testDatabaseConnection();

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}.`);
});
