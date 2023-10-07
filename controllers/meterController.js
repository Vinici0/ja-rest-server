const { request, response } = require("express");
const meterService = require("../services/meterService");
const Response = require("../helpers/response");

const getMeter = async (req = request, res = response) => {
  try {
    const meters = await meterService.getMeter();
    return new Response().success(res, "Medidores obtenidos correctamente", {
      meters: meters,
      total: meters.length,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

module.exports = {
  getMeter,
};