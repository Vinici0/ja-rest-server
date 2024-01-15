const sequelize = require("sequelize");

const dbConnection = new sequelize("JUNTADEAGUAELPORTON", "test2", "root", {
  host: "localhost", 
  dialect: "mssql", 
});

module.exports = {
  dbConnection,
};