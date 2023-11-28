const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const Console = require("../helpers/console");
const consoleHelper = new Console("Config Service");

/* Empresa */
const getEmpresaById = async (idEmpresa) => {
  try {
    const empresa = await dbConnection.query(
      "SELECT * FROM JA_Empresa WHERE idEmpresa = :idEmpresa",
      {
        replacements: { idEmpresa },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return empresa;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getEmpresa = async () => {
  try {
    const empresa = await dbConnection.query("SELECT * FROM JA_Empresa", {
      type: sequelize.QueryTypes.SELECT,
    });
    return empresa;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const updateEmpresa = async (idEmpresa, data) => {
  try {
    const empresa = await dbConnection.query(
      "UPDATE JA_Empresa SET nombreEmpresa = :nombreEmpresa, rucEmpresa = :rucEmpresa, direccionEmpresa = :direccionEmpresa, telefonoEmpresa = :telefonoEmpresa, emailEmpresa = :emailEmpresa, img = :img, mensajeEmpresa = :mensajeEmpresa WHERE idEmpresa = :idEmpresa",
      {
        replacements: {
          idEmpresa,
          nombreEmpresa: data.nombreEmpresa,
          rucEmpresa: data.rucEmpresa,
          direccionEmpresa: data.direccionEmpresa,
          telefonoEmpresa: data.telefonoEmpresa,
          emailEmpresa: data.emailEmpresa,
          img: data.img,
          mensajeEmpresa: data.mensajeEmpresa,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    return empresa;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

/* Tatla */
const getTabla = async () => {
  try {
    const tabla = await dbConnection.query("SELECT * FROM JA_Tabla", {
      type: sequelize.QueryTypes.SELECT,
    });
    return tabla;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const updateTabla = async (idTabla, data) => {
  try {
    const tabla = await dbConnection.query(
      "UPDATE JA_Tabla SET Desde = :Desde, Hasta = :Hasta, Basico = :Basico, ValorExc = :ValorExc WHERE idTabla = :idTabla",
      {
        replacements: {
          idTabla,
          Desde: data.Desde,
          Hasta: data.Hasta,
          Basico: data.Basico,
          ValorExc: data.ValorExc,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    return tabla;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getInteres = async () => {
  try {
    const interes = await dbConnection.query("SELECT * FROM JA_Interes", {
      type: sequelize.QueryTypes.SELECT,
    });
    return interes;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const updateInteres = async (idInteres, data) => {
  try {
    const interes = await dbConnection.query(
      "UPDATE JA_Interes SET interes = :interes WHERE idInteres = :idInteres",
      {
        replacements: {
          idInteres,
          interes: data.interes,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    return interes;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getClientPais = async () => {
  try {
    const client = await dbConnection.query(
      "SELECT * FROM ClientePais where pais = 'Ecuador'",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return client;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getClienteCiudad = async () => {
  try {
    const client = await dbConnection.query(
      "SELECT * FROM ClienteCiudad ORDER BY ciudad",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return client;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getClienteTipoRuc = async () => {
  try {
    const client = await dbConnection.query(
      "SELECT * FROM ClienteTipoRuc ORDER BY TipoRuc ",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return client;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getClienteTipo = async () => {
  try {
    const client = await dbConnection.query(
      "SELECT * FROM ClienteTipo ORDER BY TipoCliente ",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return client;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getAllClients = async () => {
  try {
    const client = await dbConnection.query(
      "SELECT Nombre,Ruc,Email FROM Cliente ORDER BY NOMBRE",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return client;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getMeasureCourt = async () => {
  try {
    const client = await dbConnection.query(
      "EXEC JA_Corte",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return client;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

module.exports = {
  getEmpresaById,
  updateEmpresa,
  getTabla,
  updateTabla,
  getInteres,
  updateInteres,
  getEmpresa,
  getClientPais,
  getClienteCiudad,
  getClienteTipoRuc,
  getClienteTipo,
  getAllClients,
  getMeasureCourt
};
