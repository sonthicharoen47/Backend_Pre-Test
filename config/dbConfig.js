const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.NODE_ENV === "production") {
  //deploy on heroku
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  sequelize = new Sequelize(process.env.DATABASE_CONNECT, {
    //local
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database.", error);
  }
};

module.exports = { sequelize, testDatabaseConnection };
