const sequelize = require("sequelize");

const dbConnection = new sequelize("JUNTADEAGUAELPORTON", "test1", "root", {
  host: "localhost", 
  dialect: "mssql", 
});

module.exports = {
  dbConnection,
};