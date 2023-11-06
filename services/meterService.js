const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const Console = require("../helpers/console");
const consoleHelper = new Console("User Service");

const getMeter = async () => {
  try {
    const meters = await dbConnection.query("SELECT * FROM JA_Medidor", {
      type: sequelize.QueryTypes.SELECT,
    });
    consoleHelper.success("Medida obtenida correctamente");
    return meters;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const updateMeterStatus = async (idMedidor, estado) => {
  console.log(idMedidor, estado);
  try {
    const meters = await dbConnection.query(
      "EXEC ActualizarEstadoMedidor :idMedidor, :estado",
      {
        replacements: {
          idMedidor,
          estado,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    consoleHelper.success("Medida obtenida correctamente");
    return meters;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};





module.exports = {
  getMeter,
  updateMeterStatus,
};
