const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");

const getMeasurements = async (Anio, Codigo) => {
  try {
    const medidaCliente = await dbConnection.query(
      "SELECT * FROM JA_Medida WHERE Anio = :Anio AND Codigo = :Codigo AND Saldo > 0 ORDER BY Mes DESC",
      {
        replacements: { Anio,Codigo },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return medidaCliente;
  } catch (error) {
    // consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

module.exports = {
  getMeasurements,
};
