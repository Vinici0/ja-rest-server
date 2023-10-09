const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const Console = require("../helpers/console");
const consoleHelper = new Console("User Service");

const getAllClients = async () => {
  try {
    const clients = await dbConnection.query("EXEC ja_ListarTodosClientes", {
      type: sequelize.QueryTypes.SELECT,
    });
    consoleHelper.success("Clientes obtenidos correctamente");
    return clients;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getClientById = async (id) => {
  try {
    const client = await dbConnection.query(
      "EXEC ja_ListarCliente @idCliente = :id",
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    consoleHelper.success("Cliente obtenido correctamente");
    return client;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

module.exports = {
  getAllClients,
  getClientById,
};
