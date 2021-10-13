const { sequelize } = require("./dbConfig");

require("../models/index");

const SyncModel = async () => {
  await sequelize
    .sync({ alter: true, logging: false })
    .then(() => {
      console.log(`sync model successful!`);
    })
    .catch((err) => {
      console.log(`sync model error: ${err}`);
    });
};

module.exports = SyncModel;
