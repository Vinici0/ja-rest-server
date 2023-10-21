const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const Console = require("../helpers/console");
const consoleHelper = new Console("Fine Service");

const getFines = async () => {
  try {
    const fines = await dbConnection.query("SELECT * FROM JA_Multa", {
      type: sequelize.QueryTypes.SELECT,
    });
    consoleHelper.success("Multas obtenidas correctamente");
    return fines;
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

const getFineById = async (idMulta) => {
  try {
    const fine = await dbConnection.query(
      "SELECT * FROM JA_Multa WHERE idMulta = :idMulta",
      {
        replacements: {
          idMulta,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    consoleHelper.success("Multa obtenida correctamente");
    return fine;
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

const createFine = async (fine) => {
  try {
    const newFine = await dbConnection.query(
      `INSERT INTO JA_Multa (typeFine, cost) VALUES (:typeFine, :cost)`,
      {
        replacements: {
          typeFine: fine.typeFine,
          cost: fine.cost,
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    consoleHelper.success("Multa creada correctamente");
    return newFine;
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

const updateFine = async (idMulta, fine) => {
  try {
    const updatedFine = await dbConnection.query(
      `UPDATE JA_Multa SET typeFine = :typeFine, cost = :cost WHERE idMulta = :idMulta`,
      {
        replacements: {
          typeFine: fine.typeFine,
          cost: fine.cost,
          idMulta,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    consoleHelper.success("Multa actualizada correctamente");
    return updatedFine;
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

const deleteFine = async (idMulta) => {
  try {
    const deletedFine = await dbConnection.query(
      `DELETE FROM JA_Multa WHERE idMulta = :idMulta`,
      {
        replacements: {
          idMulta,
        },
        type: sequelize.QueryTypes.DELETE,
      }
    );

    consoleHelper.success("Multa eliminada correctamente");
    return deletedFine;
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

const createFineDetail = async (fineDetail) => {
  try {
    const newFineDetail = await dbConnection.query(
      `INSERT INTO JA_MultaDetalle (id_cliente, id_multa, valor_pagar, date_fine, descripcion, tipo_multa) VALUES (:id_cliente, :id_multa, :valor_pagar, :date_fine, :descripcion, :tipo_multa)`,
      {
        replacements: {
          id_cliente: fineDetail.id_cliente,
          id_multa: fineDetail.id_multa,
          valor_pagar: fineDetail.valor_pagar,
          date_fine: fineDetail.date_fine,
          descripcion: fineDetail.descripcion,
          tipo_multa: fineDetail.tipo_multa,
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    consoleHelper.success("Detalle de multa creada correctamente");
    return newFineDetail;
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

const updateFineDetail = async (idMultaDetalle, fineDetail) => {
  try {
    const updatedFineDetail = await dbConnection.query(
      `UPDATE JA_MultaDetalle SET id_cliente = :id_cliente, id_multa = :id_multa, valor_pagar = :valor_pagar, date_fine = :date_fine, descripcion = :descripcion, tipo_multa = :tipo_multa WHERE idMultaDetalle = :idMultaDetalle`,
      {
        replacements: {
          id_cliente: fineDetail.id_cliente,
          id_multa: fineDetail.id_multa,
          valor_pagar: fineDetail.valor_pagar,
          date_fine: fineDetail.date_fine,
          descripcion: fineDetail.descripcion,
          tipo_multa: fineDetail.tipo_multa,
          idMultaDetalle,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    consoleHelper.success("Detalle de multa actualizada correctamente");
    return updatedFineDetail;
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

const togglePaymentStatus = async (idMultaDetalle, pagado) => {
  try {
    const updatedPaymentStatus = await dbConnection.query(
      `UPDATE JA_MultaDetalle SET pagado = :pagado WHERE idMultaDetalle = :idMultaDetalle`,
      {
        replacements: {
          pagado,
          idMultaDetalle,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    consoleHelper.success("Estado de pago actualizado correctamente");
    return updatedPaymentStatus;
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

const getFineDetails = async () => {
  try {
    const fineDetails = await dbConnection.query(
      "SELECT * FROM JA_MultaDetalle INNER JOIN Cliente ON JA_MultaDetalle.id_cliente = Cliente.idCliente",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    consoleHelper.success("Detalles de multas obtenidos correctamente");
    return fineDetails;
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  createFine,
  createFineDetail,
  deleteFine,
  getFineById,
  getFineDetails,
  getFines,
  togglePaymentStatus,
  updateFine,
  updateFineDetail,
};
