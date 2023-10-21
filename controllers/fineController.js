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

module.exports = {
  getFines,
  getFineById,
  createFine,
  updateFine,
  deleteFine,
};
