const sequelize = require("sequelize");

const dbConnection = new sequelize("JUNTADEAGUAELPORTON_ANGULAR", "test1", "root", {
  host: "localhost", 
  dialect: "mssql", 
});

module.exports = {
  dbConnection,
};