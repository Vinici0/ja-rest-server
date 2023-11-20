const sequelize = require("sequelize");

const dbConnection = new sequelize("JUNTADEAGUAELPORTON_ANGULAR_V2", "test1", "root", {
  host: "localhost", 
  dialect: "mssql", 
});

module.exports = {
  dbConnection,
};