const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const Console = require("../helpers/console");
const consoleHelper = new Console("User Service");

// Obtener numero de edatos para el dashboard
const contClients = async () => {
    try {
        const client = await dbConnection.query("SELECT COUNT(*) AS cont FROM Cliente", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Numero de clientes obtenido correctamente");
        return client;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
};

const contMeter = async () => {
    try {
        const meter = await dbConnection.query("SELECT COUNT(*) AS cont FROM JA_Medidor WHERE Estado = 0", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Numero de medidores obtenido correctamente");
        return meter;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
};

const contReportMeter = async () => {
    try {
        const repair_meter = await dbConnection.query("SELECT COUNT(*) AS cont FROM JA_Medidor WHERE Estado = 1", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Numero de medidores en reparación obtenido correctamente");
        return repair_meter;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
};

const contUsers = async () => {
    try {
        const user = await dbConnection.query("SELECT COUNT(*) AS cont FROM JA_Usuario", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Numero de usuarios obtenido correctamente");
        return user;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
};


module.exports = {
    contClients,
    contMeter,
    contReportMeter,
    contUsers,
};