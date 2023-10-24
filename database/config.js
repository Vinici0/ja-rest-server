const sequelize = require("sequelize");

const dbConnection = new sequelize("JUNTADEAGUAELPORTON", "rest_server_v2", "root", {
  host: "192.168.3.21", 
  dialect: "mssql", 
});

module.exports = {
  dbConnection,
};