const { request, response } = require("express");
const fineService = require("../services/fineService");
const Response = require("../helpers/response");

const getFines = async (req = request, res = response) => {
  try {
    const fines = await fineService.getFines();
    return new Response().success(res, "Multas obtenidas correctamente", {
      fines: fines,
      total: fines.length,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const getFineById = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const fine = await fineService.getFineById(id);
    return new Response().success(res, "Multa obtenida correctamente", {
      fine: fine,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const createFine = async (req = request, res = response) => {
  const { body } = req;
  try {
    const fine = await fineService.createFine(body);
    return new Response().success(res, "Multa creada correctamente", {
      fine: fine,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const updateFine = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const fine = await fineService.updateFine(id, body);
    return new Response().success(res, "Multa actualizada correctamente", {
      fine: fine,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const deleteFine = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const fine = await fineService.deleteFine(id);
    return new Response().success(res, "Multa eliminada correctamente", {
      fine: fine,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

/* 
    Fine Details
*/
const getFinesDetails = async (req = request, res = response) => {
  try {
    console.log("-------------------getFinesDetails--------------------------");
    const fineDetails = await fineService.getFineDetails();
    return new Response().success(
      res,
      "Detalles de multa obtenidos correctamente",
      {
        fineDetails: fineDetails,
      }
    );
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const createFineDetail = async (req = request, res = response) => {
  const { body } = req;
  try {
    const fineDetail = await fineService.createFineDetail(body);
    return new Response().success(
      res,
      "Detalle de multa creado correctamente",
      {
        fineDetail: fineDetail,
      }
    );
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const updateFineDetail = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  console.log("body", body);
  try {
    const fineDetail = await fineService.updateFineDetail(id, body);
    return new Response().success(
      res,
      "Detalle de multa actualizado correctamente",
      {
        fineDetail: fineDetail,
      }
    );
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const togglePaymentStatus = async (req = request, res = response) => {
  const { id } = req.params;
  const {  pagado} = req.body;
  try {
    const fineDetail = await fineService.togglePaymentStatus(id, !pagado);
    return new Response().success(
      res,
      "Estado de pago actualizado correctamente",
      {
        fineDetail: fineDetail,
      }
    );
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const deleteFineDetail = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const fineDetail = await fineService.deleteFineDetail(id);
    return new Response().success(
      res,
      "Detalle de multa eliminado correctamente",
      {
        fineDetail: fineDetail,
      }
    );
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const getFineDetailById = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const fineDetail = await fineService.getFineDetailById(id);
    return new Response().success(
      res,
      "Detalle de multa obtenido correctamente",
      {
        fineDetails: fineDetail,
      }
    );
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

module.exports = {
  createFine,
  createFineDetail,
  deleteFine,
  deleteFineDetail,
  getFineById,
  getFinesDetails,
  getFines,
  togglePaymentStatus,
  updateFine,
  updateFineDetail,
  getFineDetailById
};
