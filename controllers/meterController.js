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

const updateMeterStatus = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const meters = await meterService.updateMeterStatus(id, estado);
    return new Response().success(res, "Medidor actualizado correctamente", {
      meters: meters,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

module.exports = {
  getMeter,
  updateMeterStatus,
};
