const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");

const getMeasurements = async (Anio, Codigo) => {
  try {
    const medidaCliente = await dbConnection.query(
      "SELECT * FROM JA_Medida WHERE Anio = :Anio AND Codigo = :Codigo AND Saldo > 0 ORDER BY Mes DESC",
      {
        replacements: { Anio, Codigo },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return medidaCliente;
  } catch (error) {
    // consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getDetatailFinesByClient = async (id_cliente) => {
  try {
    const detalleMultas = await dbConnection.query(
      "SELECT * FROM JA_MultaDetalle WHERE id_cliente = :id_cliente",
      {
        replacements: { id_cliente },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return detalleMultas;
  } catch (error) {
    // consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getInteresBase = async () => {
  try {
    const interesBase = await dbConnection.query("SELECT * FROM JA_Interes", {
      type: sequelize.QueryTypes.SELECT,
    });
    return interesBase[0].interes / 100;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getFineByClient = async (id_cliente) => {
  console.log(id_cliente);
  try {
    const multaCliente = await dbConnection.query(
      "SELECT * FROM JA_MultaDetalle WHERE id_cliente = :id_cliente and pagado = 0",
      {
        replacements: { id_cliente },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return multaCliente;
  } catch (error) {
    throw new Error(error.message || 'Ocurrió un error en la obtención de multas del cliente');
  }
};

module.exports = {
  getMeasurements,
  getDetatailFinesByClient,
  getInteresBase,
  getFineByClient
};
