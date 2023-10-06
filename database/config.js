const sequelize = require("sequelize");

const dbConnection = new sequelize("JUNTADEAGUAELPORTON", "Maria2", "root", {
  host: "localhost", // Cambia el host si es necesario
  dialect: "mssql", // Utiliza 'mssql' para SQL Server
});

module.exports = {
  dbConnection,
};