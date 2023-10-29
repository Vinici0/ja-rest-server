const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const Console = require("../helpers/console");
const consoleHelper = new Console("Customer Service");

const getAllClients = async () => {
  try {
    const clients = await dbConnection.query(
      "select * from cliente ORDER BY FechaIngreso DESC",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
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
      "SELECT * FROM Cliente WHERE idCliente = :id",
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

const createClient = async (data) => {
  try {
    const rucExist = await dbConnection.query(
      "SELECT * FROM Cliente WHERE ruc = :ruc",
      {
        replacements: {
          ruc: data.ruc,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (rucExist.length > 0) {
      throw new Error("El ruc ya existe");
    }

    const emailExist = await dbConnection.query(
      "SELECT * FROM Cliente WHERE email = :email",
      {
        replacements: {
          email: data.email,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (emailExist.length > 0) {
      throw new Error("El email ya existe");
    }

    const client = await dbConnection.query(
      `INSERT INTO Cliente  
      (nombre, ruc, telefono, email, idPais, idCiudad, direccion, fechaNacimiento, fechaIngreso, fechaCaducidad, idTipoRuc, hombre, ja_discapacidad, ja_terceraEdad, estadoCivil)
      VALUES 
      (:nombre, :ruc, :telefono, :email, :idPais, :idCiudad, :direccion, :fechaNacimiento, :fechaIngreso, :fechaCaducidad, :idTipoRuc, :hombre, :ja_discapacidad, :ja_terceraEdad, :estadoCivil)
      `,
      {
        replacements: {
          nombre: data.nombre,
          ruc: data.ruc,
          telefono: data.telefono,
          email: data.email,
          idPais: data.idPais,
          idCiudad: data.idCiudad,
          direccion: data.direccion,
          fechaNacimiento: data.fechaNacimiento,
          fechaIngreso: data.fechaIngreso,
          fechaCaducidad: data.fechaCaducidad,
          idTipoRuc: data.idTipoRuc,
          hombre: data.hombre,
          ja_discapacidad: data.ja_discapacidad,
          ja_terceraEdad: data.ja_terceraEdad,
          estadoCivil: data.estadoCivil,
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    // Consultar el id del cliente creado
    const clientCreated = await dbConnection.query(
      "SELECT idCliente FROM Cliente WHERE ruc = :ruc",
      {
        replacements: {
          ruc: data.ruc,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    consoleHelper.success("Cliente creado correctamente");
    return clientCreated;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
};
