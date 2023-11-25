const { request, response } = require("express");
const getStream = require("get-stream");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const measureService = require("../services/measureService");
const Response = require("../helpers/response");

const getMeasurements = async (req = request, res = response) => {
  const { limite = 10, desde = 0 } = req.query;
  try {
    const measure = await measureService.getMeasurements();
    // const measurePagination = .slice(Number(desde), Number(limite) + Number(desde))
    return new Response().success(res, "Medidas obtenidas correctamente", {
      measure: measure,
      total: measure.length,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const getMeasurementsByMonthAndYear = async (req = request, res = response) => {
  const { Mes, Anio } = req.query;
  try {
    const measure = await measureService.getMeasurementsByMonthAndYear(
      Mes,
      Anio
    );
    return new Response().success(res, "Medidas obtenidas correctamente", {
      measure: measure,
      total: measure.length,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const updateMeasurement = async (req, res) => {
  const {
    Anio,
    Basico,
    Codigo,
    idCliente,
    idMedida,
    LecturaActual,
    LecturaAnterior,
    Mes,
  } = req.body;
  try {
    const result = await measureService.updateMeasurement(
      Anio,
      Basico,
      Codigo,
      idCliente,
      idMedida,
      LecturaActual,
      LecturaAnterior,
      Mes
    );

    return new Response().success(res, "Medida guardada correctamente", {
      measure: result,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const execCorte = async (req, res) => {
  try {
    const result = await measureService.execCorte();
    return new Response().success(res, "Corte ejecutado correctamente", {
      measure: result,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const updateMeasurementForAll = async (req, res) => {
  const { Anio, Mes } = req.body;
  try {
    const result = await measureService.updateMeasurementForAll(Anio, Mes);
    return new Response().success(res, "Medidas actualizadas correctamente", {
      measure: result,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const calculoIntrest = async (req, res) => {
  const { Anio, Codigo, InteresPorMora } = req.body;
  try {
    const result = await measureService.calculoIntrest(Anio, Codigo, 1);
    return new Response().success(res, "Medidas actualizadas correctamente", {
      measure: result,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const updateAllMeasurements = async (req, res) => {
  try {
    const result = await measureService.updateAllMeasurements();
    return new Response().success(res, "Medidas actualizadas correctamente", {
      measure: result,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const createMeusereAndUpdateCustomer = async (req, res) => {
  const body = req.body;
  try {
    const result = await measureService.createMeusereAndUpdateCustomer(body);
    return new Response().success(res, "Medida guardada correctamente", {
      measure: result,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const getMeasureById = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const measure = await measureService.getMeasureById(id);
    return new Response().success(res, "Medida obtenida correctamente", {
      measure: measure,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const updateMeauseAndCustomer = async (req, res) => {
  const body = req.body;
  try {
    const result = await measureService.updateMeauseAndCustomer(body);
    return new Response().success(res, "Medida actualizada correctamente", {
      measure: result,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const generaAndCalculo = async (req, res) => {
  const { Anio, Mes } = req.body;
  try {
    const result = await measureService.generaAndCalculo(Anio, Mes);
    return new Response().success(res, "Medida actualizada correctamente", {
      measure: result,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const calculateAllAndUpdateMedidasAcumulado = async (req, res) => {
  try {
    const result = await measureService.calculateAllAndUpdateMedidasAcumulado();
    return new Response().success(res, "Medida actualizada correctamente", {
      measure: result,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const updateDatosAlcantarilladoConSaldoPositivo = async (req, res) => {
  try {
    const result =
      await measureService.updateDatosAlcantarilladoConSaldoPositivo();
    return new Response().success(res, "Medida actualizada correctamente", {
      measure: result,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const getCustomerInformation = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await measureService.getCustomerInformation(id);
    return new Response().success(res, "Medida actualizada correctamente", {
      measure: result,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

module.exports = {
  execCorte,
  getMeasurements,
  getMeasurementsByMonthAndYear,
  updateMeasurement,
  updateMeasurementForAll,
  calculoIntrest,
  updateAllMeasurements,
  createMeusereAndUpdateCustomer,
  getMeasureById,
  updateMeauseAndCustomer,
  generaAndCalculo,
  calculateAllAndUpdateMedidasAcumulado,
  getCustomerInformation,
  updateDatosAlcantarilladoConSaldoPositivo,
};
