const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const DownloadedFiles = sequelize.define("downlodedfile", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  url: Sequelize.STRING,
});

module.exports = DownloadedFiles;
