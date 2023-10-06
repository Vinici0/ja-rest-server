const { request, response } = require("express");
const getStream = require("get-stream");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const userService = require("../services/measureService");
const Response = require("../helpers/response");

const getMeasurements = async (req = request, res = response) => {
  const { limite = 10, desde = 0 } = req.query;
  try {
    const measure = await userService.getMeasurements();
    // const measurePagination = .slice(Number(desde), Number(limite) + Number(desde))
    return new Response().success(res, "Medidas obtenidas correctamente", {
      measure: measure,
      total: measure.length,
    });
    measure;
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const getMeasurementsByMonthAndYear = async (req = request, res = response) => {
  const { Mes, Anio } = req.query;
  try {
    const measure = await userService.getMeasurementsByMonthAndYear(Mes, Anio);
    return new Response().success(res, "Medidas obtenidas correctamente", {
      measure: measure,
      total: measure.length,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const updateMeasurement = async (req, res) => {
  const { Anio, Mes, LecturaAnterior, LecturaActual, idCliente, Codigo } =
    req.body;

  try {
    const result = await userService.updateMeasurement(
      Anio,
      Mes,
      LecturaAnterior,
      LecturaActual,
      idCliente,
      Codigo
    );

    return new Response().success(res, "Medida guardada correctamente", {
      measure: result,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};



module.exports = {
  getMeasurements,
  getMeasurementsByMonthAndYear,
  updateMeasurement,
};
