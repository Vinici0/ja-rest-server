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

const getAllClientsAndManzadaAndLote = async () => {
  try {
    const clients = await dbConnection.query(
      "select distinct JA_Medida.idCliente, JA_Medida.nombre, lote, manzana, JA_Medida.codigo, ruc  from JA_Medida  INNER JOIN cliente ON JA_Medida.idCliente = cliente.idCliente where  lote is not null and manzana is not null order by manzana asc , lote asc",
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

const updateClient = async (id, body) => {
  try {
    const client = await dbConnection.query(
      `UPDATE Cliente SET 
      nombre = :nombre, 
      ruc = :ruc, 
      telefono = :telefono, 
      email = :email, 
      idPais = :idPais, 
      idCiudad = :idCiudad, 
      direccion = :direccion, 
      fechaNacimiento = :fechaNacimiento, 
      fechaIngreso = :fechaIngreso, 
      fechaCaducidad = :fechaCaducidad, 
      idTipoRuc = :idTipoRuc, 
      hombre = :hombre, 
      ja_discapacidad = :ja_discapacidad, 
      ja_terceraEdad = :ja_terceraEdad, 
      estadoCivil = :estadoCivil
      WHERE idCliente = :id`,
      {
        replacements: {
          nombre: body.nombre,
          ruc: body.ruc,
          telefono: body.telefono,
          email: body.email,
          idPais: body.idPais,
          idCiudad: body.idCiudad,
          direccion: body.direccion,
          fechaNacimiento: body.fechaNacimiento,
          fechaIngreso: body.fechaIngreso,
          fechaCaducidad: body.fechaCaducidad,
          idTipoRuc: body.idTipoRuc,
          hombre: body.hombre,
          ja_discapacidad: body.ja_discapacidad,
          ja_terceraEdad: body.ja_terceraEdad,
          estadoCivil: body.estadoCivil,
          id,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    consoleHelper.success("Cliente actualizado correctamente");
    return client;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};



module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  getAllClientsAndManzadaAndLote
};
