const sequelize = require("sequelize");

const dbConnection = new sequelize("JUNTADEAGUAELPORTON_ANGULAR", "rest_server_v2", "root", {
  host: "localhost", 
  dialect: "mssql", 
});

module.exports = {
  dbConnection,
};