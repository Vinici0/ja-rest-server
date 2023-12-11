const { request, response } = require("express");
// Obtener los servicios
const dashboardService = require("../services/dashboardService");
// Obtener las structuras de mensajes de respuesta
const Response = require("../helpers/response");

const contClients = async (req = request, res = response) => {
    try {
        const client = await dashboardService.contClients();
        return new Response().success(res, "Numero de clientes obtenidos correctamente", {
            total: client,
        });
    } catch (error) {
        return new Response().error(res, error.message);
    }
};

const contMeter = async (req = request, res = response) => {
    try {
        const meter = await dashboardService.contMeter();
        return new Response().success(res, "Numero de medidores obtenidos correctamente", {
            total: meter,
        });
    } catch (error) {
        return new Response().error(res, error.message);
    }
};

const contReportMeter = async (req = request, res = response) => {
    try {
        const reportMeter = await dashboardService.contReportMeter();
        return new Response().success(res, "Numero de medidores dañados obtenidos correctamente", {
            total: reportMeter,
        });
    } catch (error) {
        return new Response().error(res, error.message);
    }
};

const contUsers = async (req = request, res = response) => {
    try {
        const users = await dashboardService.contUsers();
        return new Response().success(res, "Numero de usuarios obtenidos correctamente", {
            total: users,
        });
    } catch (error) {
        return new Response().error(res, error.message);
    }
};

// Exportar los modulos de los filtros
module.exports = {
    contClients,
    contMeter,
    contReportMeter,
    contUsers,
};