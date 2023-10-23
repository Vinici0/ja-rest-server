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

const updateEmpresa = async (idEmpresa, data) => {
  try {
    const empresa = await dbConnection.query(
      "UPDATE JA_Empresa SET nombreEmpresa = :nombreEmpresa, rucEmpresa = :rucEmpresa, direccionEmpresa = :direccionEmpresa, telefonoEmpresa = :telefonoEmpresa, emailEmpresa = :emailEmpresa, imgEmpresa = :imgEmpresa, mensajeEmpresa = :mensajeEmpresa WHERE idEmpresa = :idEmpresa",
      {
        replacements: {
          idEmpresa,
          nombreEmpresa: data.nombreEmpresa,
          rucEmpresa: data.rucEmpresa,
          direccionEmpresa: data.direccionEmpresa,
          telefonoEmpresa: data.telefonoEmpresa,
          emailEmpresa: data.emailEmpresa,
          imgEmpresa: data.imgEmpresa,
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
      "UPDATE JA_Interes SET interes = :interes, descripcion = :descripcion WHERE idInteres = :idInteres",
      {
        replacements: {
          idInteres,
          interes: data.interes,
          descripcion: data.descripcion,
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

module.exports = {
  getEmpresaById,
  updateEmpresa,
  getTabla,
  updateTabla,
  getInteres,
  updateInteres,
};
