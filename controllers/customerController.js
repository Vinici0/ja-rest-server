const { request, response } = require("express");
const meterService = require("../services/customerService");
const Response = require("../helpers/response");

const getAllClients = async (req = request, res = response) => {
  try {
    const clients = await meterService.getAllClients();
    return new Response().success(res, "Clientes obtenidos correctamente", {
      clients: clients,
      total: clients.length,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const getClientById = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const client = await meterService.getClientById(id);
    return new Response().success(res, "Cliente obtenido correctamente", {
      client: client,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

module.exports = {
  getAllClients,
  getClientById,
};
