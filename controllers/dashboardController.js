const { request, response } = require("express");
// Obtener los servicios
const dashboardService = require("../services/dashboardService");
// Obtener las structuras de mensajes de respuesta
const Response = require("../helpers/response");

/**
 * Obtener numero de registros
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
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



/**
 * Obtener datos para los list
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
// Clientes
const listCiudad = async (req, res) => {
    try {
        // Llama a la función del servicio para obtener la lista de ciudades
        const city = await dashboardService.listCiudad();

        // Devuelve una respuesta exitosa con las ciudades
        return res.status(200).json({
            success: true,
            message: "Ciudades obtenidas correctamente",
            data: city,
        });
    } catch (error) {
        // Devuelve un error en caso de que ocurra algún problema
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const listPais = async (req, res) => {
    try {
        // Llama a la función del servicio para obtener la lista de ciudades
        const country = await dashboardService.listPais();

        // Devuelve una respuesta exitosa con las ciudades
        return res.status(200).json({
            success: true,
            message: "Paises obtenidos correctamente",
            data: country,
        });
    } catch (error) {
        // Devuelve un error en caso de que ocurra algún problema
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const listTipoCliente = async (req, res) => {
    try {
        // Llama a la función del servicio para obtener la lista de ciudades
        const type = await dashboardService.listTipoCliente();

        // Devuelve una respuesta exitosa con las ciudades
        return res.status(200).json({
            success: true,
            message: "Tipo cliente obtenidos correctamente",
            data: type,
        });
    } catch (error) {
        // Devuelve un error en caso de que ocurra algún problema
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// Medidores
const listEstados = async (req = request, res = response) => {
    try {
        const estado = await dashboardService.listEstado();
        return new Response().success(res, "Estados obtenidos correctamente", {
            total: estado,
        });
    } catch (error) {
        return new Response().error(res, error.message);
    }
};

const listCantidad = async (req = request, res = response) => {
    try {
        const cantidades = await dashboardService.listCantidad();
        return new Response().success(res, "Cantidades obtenidas correctamente", {
            total: cantidades,
        });
    } catch (error) {
        return new Response().error(res, error.message);
    }
};

const listLotes = async (req = request, res = response) => {
    try {
        const lotes = await dashboardService.listLote();
        return new Response().success(res, "Lotes obtenidos correctamente", {
            total: lotes,
        });
    } catch (error) {
        return new Response().error(res, error.message);
    }
};

const listManzanas = async (req = request, res = response) => {
    try {
        const manzanas = await dashboardService.listManzana();
        return new Response().success(res, "Manzanas obtenidas correctamente", {
            total: manzanas,
        });
    } catch (error) {
        return new Response().error(res, error.message);
    }
};



// Usuarios
const listRoles = async (req = request, res = response) => {
    try {
        const roles = await dashboardService.listRoles();
        return new Response().success(res, "Roles obtenidos correctamente", {
            total: roles,
        });
    } catch (error) {
        return new Response().error(res, error.message);
    }
};





/**
 * Obtener datos para la grafica
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
// Clientes
const datosFiltradosClients = async (req, res) => {
    try {
        const { idCiudad, idPais, idTipoCliente } = req.params;

        const filteredData = await dashboardService.getFilteredDataClients(idCiudad, idPais, idTipoCliente);

        return res.status(200).json({
            success: true,
            message: 'Datos filtrados obtenidos correctamente',
            data: filteredData,
        });
    } catch (error) {
        console.error('Error al obtener datos filtrados:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener datos filtrados',
            error: error.message,
        });
    }
};

// Medidores
const datosFiltradosMedidores = async (req, res) => {
    try {
        const { estado, numMedidores, lote, manzana } = req.params;

        const filteredData = await dashboardService.getFilteredDataMedidores(estado, numMedidores, lote, manzana);

        return res.status(200).json({
            success: true,
            message: 'Datos filtrados obtenidos correctamente',
            data: filteredData,
        });
    } catch (error) {
        console.error('Error al obtener datos filtrados:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener datos filtrados',
            error: error.message,
        });
    }
};



// Usuarios
const graficaUser_todos = async (req = request, res = response) => {
    try {
        const todos = await dashboardService.graficaUser_todos();
        return new Response().success(res, "Datos de la grafica obtenidos correctamente", {
            total: todos,
        });
    } catch (error) {
        return new Response().error(res, error.message);
    }
};

const graficaUser = async (req = request, res = response) => {
    try {
        const { customRole } = req.params;
        const result = await dashboardService.graficaUser(customRole);

        return new Response().success(res, "Datos de la gráfica obtenidos correctamente", {
            total: result,
        });
    } catch (error) {
        return new Response().error(res, error.message);
    }
};



/**
 * Exportar los modulos de los filtros
 */
module.exports = {
    contClients,
    contMeter,
    contReportMeter,
    contUsers,

    listEstados,
    listCiudad,
    listPais,
    listTipoCliente,

    listCantidad,
    listLotes,
    listManzanas,

    listRoles,

    datosFiltradosClients,
    datosFiltradosMedidores,

    graficaUser_todos,
    graficaUser,
};