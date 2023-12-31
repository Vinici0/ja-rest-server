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

/* 
    Fine Details
*/
const createFineDetail = async (fineDetail) => {
  try {
    const clients = fineDetail.clients;
    const fileDetalle = fineDetail.fineDetalle;
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      await dbConnection.query(
        `INSERT INTO JA_MultaDetalle (id_cliente, id_multa, valor_pagar, date_fine, descripcion) VALUES (:id_cliente, :id_multa, :valor_pagar, :date_fine, :descripcion)`,
        {
          replacements: {
            id_cliente: client.idCliente,
            id_multa: fileDetalle.id_multa,
            valor_pagar: fileDetalle.valor_pagar,
            date_fine: fileDetalle.date_fine,
            descripcion: fileDetalle.descripcion,
            tipo_multa: fileDetalle.tipo_multa,
          },
          type: sequelize.QueryTypes.INSERT,
        }
      );
    }

    consoleHelper.success("Detalle de multa creada correctamente");
    return "Detalle de multa creada correctamente";
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

const updateFineDetail = async (idMultaDetalle, fineDetail) => {
  try {
    const updatedFineDetail = await dbConnection.query(
      `UPDATE JA_MultaDetalle SET id_cliente = :id_cliente, id_multa = :id_multa, valor_pagar = :valor_pagar, date_fine = :date_fine, descripcion = :descripcion WHERE idMultaDetalle = :idMultaDetalle`,
      {
        replacements: {
          id_cliente: fineDetail.id_cliente,
          id_multa: fineDetail.id_multa,
          valor_pagar: fineDetail.valor_pagar,
          date_fine: fineDetail.date_fine,
          descripcion: fineDetail.descripcion,
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

const togglePaymentStatus = async (idMultaDetalle, pagado, fecha) => {
  try {
    let fechaPagoValue = pagado === true ? new Date() : null;
    console.log(fechaPagoValue);
    const updatedPaymentStatus = await dbConnection.query(
      `UPDATE JA_MultaDetalle SET pagado = :pagado, fecha_pago = :fechaPago WHERE idMultaDetalle = :idMultaDetalle`,
      {
        replacements: {
          pagado,
          fechaPago: fechaPagoValue,
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
      "SELECT JA_MultaDetalle.id_cliente,date_fine,descripcion,pagado,valor_pagar,idMultaDetalle,nombre, ruc,typeFine  FROM JA_MultaDetalle INNER JOIN Cliente ON JA_MultaDetalle.id_cliente = Cliente.idCliente INNER JOIN JA_Multa ON JA_MultaDetalle.id_multa = JA_Multa.idMulta",
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

const getFineDetailsByIdClient = async (idCliente) => {
  try {
    const fineDetails = await dbConnection.query(
      "SELECT JA_MultaDetalle.id_cliente,date_fine,descripcion,pagado,valor_pagar,idMultaDetalle,nombre, ruc,typeFine, telefono  FROM JA_MultaDetalle INNER JOIN Cliente ON JA_MultaDetalle.id_cliente = Cliente.idCliente INNER JOIN JA_Multa ON JA_MultaDetalle.id_multa = JA_Multa.idMulta WHERE JA_MultaDetalle.id_cliente = :idCliente",
      {
        replacements: {
          idCliente,
        },
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

const deleteFineDetail = async (idMultaDetalle) => {
  try {
    const deletedFineDetail = await dbConnection.query(
      `DELETE FROM JA_MultaDetalle WHERE idMultaDetalle = :idMultaDetalle`,
      {
        replacements: {
          idMultaDetalle,
        },
        type: sequelize.QueryTypes.DELETE,
      }
    );

    consoleHelper.success("Detalle de multa eliminada correctamente");
    return deletedFineDetail;
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

//Obtener por id fineDetail
const getFineDetailById = async (idMultaDetalle) => {
  try {
    const fineDetail = await dbConnection.query(
      "SELECT JA_MultaDetalle.idMultaDetalle, Cliente.Nombre, Cliente.Ruc, Cliente.Telefono, JA_Multa.typeFine, JA_Multa.cost, JA_MultaDetalle.descripcion, JA_MultaDetalle.date_fine, JA_MultaDetalle.id_cliente, JA_MultaDetalle.id_multa, JA_MultaDetalle.valor_pagar FROM JA_MultaDetalle INNER JOIN Cliente ON JA_MultaDetalle.id_cliente = Cliente.idCliente INNER JOIN JA_Multa ON JA_MultaDetalle.id_multa = JA_Multa.idMulta WHERE JA_MultaDetalle.idMultaDetalle = :idMultaDetalle",
      {
        replacements: {
          idMultaDetalle,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    consoleHelper.success("Detalle de multa obtenida correctamente");
    return fineDetail;
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

const calculateTotalAmount = async () => {
  try {
    const result = await dbConnection.query(
      "SELECT  c.idCliente ,c.nombre, c.ruc, COUNT(m.id_cliente) AS cantidadMultas, SUM(m.valor_pagar) AS totalPagar FROM cliente c INNER JOIN JA_MultaDetalle m ON m.id_cliente = c.idCliente GROUP BY c.Nombre, c.ruc, c.idCliente",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    consoleHelper.success("Total calculado correctamente");
    return result;
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};


const getFineReport = async (idCliente) => {
  try {
    const result = await dbConnection.query(
      "SELECT id_cliente,* FROM JA_MultaDetalle INNER JOIN JA_Multa ON JA_MultaDetalle.id_multa = JA_Multa.idMulta WHERE id_cliente = :idCliente AND pagado = 0 ORDER BY date_fine ASC",
      {
        replacements: {
          idCliente,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    consoleHelper.success("Total calculado correctamente");
    return result;
  }
  catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

const getMeasureReport = async (idCliente) => {
  try {
    const result = await dbConnection.query(
      "SELECT TOP 1 * FROM JA_Medida WHERE idCliente = :idCliente"
      ,
      {
        replacements: {
          idCliente,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    consoleHelper.success("Total calculado correctamente");
    return result;
  }
  catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};



module.exports = {
  deleteFineDetail,
  createFine,
  createFineDetail,
  deleteFine,
  getFineById,
  getFineDetails,
  getFines,
  togglePaymentStatus,
  updateFine,
  updateFineDetail,
  getFineDetailById,
  calculateTotalAmount,
  getFineDetailsByIdClient,
  getFineReport,
  getMeasureReport
};
