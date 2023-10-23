const { request, response } = require("express");
const configService = require("../services/configService");
const Response = require("../helpers/response");

const getEmpresaById = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const empresa = await configService.getEmpresaById(id);
    return new Response().success(res, "Empresa obtenida correctamente", {
      empresa: empresa,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const updateEmpresa = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const empresa = await configService.updateEmpresa(id, body);
    return new Response().success(res, "Empresa actualizada correctamente", {
      empresa: empresa,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const getTabla = async (req = request, res = response) => {
  try {
    const tabla = await configService.getTabla();
    return new Response().success(res, "Tabla obtenida correctamente", {
      tabla: tabla,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const updateTabla = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const tabla = await configService.updateTabla(id, body);
    return new Response().success(res, "Tabla actualizada correctamente", {
      tabla: tabla,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const getInteres = async (req = request, res = response) => {
  try {
    const interes = await configService.getInteres();
    return new Response().success(res, "Interes obtenido correctamente", {
      interes: interes,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

const updateInteres = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const interes = await configService.updateInteres(id, body);
    return new Response().success(res, "Interes actualizado correctamente", {
      interes: interes,
    });
  } catch (error) {
    return new Response().error(res, error.message);
  }
};

module.exports = {
  getEmpresaById,
  updateEmpresa,
  getTabla,
  updateTabla,
  getInteres,
  updateInteres,
};
