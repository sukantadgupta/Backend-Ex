const sequelize = require("sequelize");
const Sequelize = require("../utils/database");

const Expense = Sequelize.define("expenses", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: sequelize.INTEGER,
  description: sequelize.STRING,
  category: sequelize.STRING,
});

module.exports = Expense;
