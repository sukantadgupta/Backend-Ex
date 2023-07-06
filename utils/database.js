const Sequelize = require("sequelize").Sequelize;

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_MAIN, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
});


module.exports = sequelize;
