const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const Console = require("../helpers/console");
const consoleHelper = new Console("User Service");

/**
 * Obtener numero de registros
 * @returns 
 */
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


/**
 * Obtener datos para los list
 * @returns 
 */
const listRoles = async () => {
    try {
        const rol = await dbConnection.query("SELECT DISTINCT role FROM JA_Usuario", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Roles obtenidos correctamente");
        return rol;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}




/**
 * Obtener datos para la grafica
 * @returns 
 */
const graficaUser_todos = async () => {
    try {
        const todos = await dbConnection.query("SELECT role, COUNT(*) AS Total FROM JA_Usuario GROUP BY role", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Datos de la grafica obtenidos correctamente");
        return todos;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}

const graficaUser = async (customRole) => {
    try {
        const roleFilter = customRole ? `role = :role` : '';

        const admin = await dbConnection.query(
            `SELECT CONVERT(DATE, fecha_creacion) AS fechaIni, COUNT(*) AS Total FROM JA_Usuario WHERE ${roleFilter} GROUP BY CONVERT(DATE, fecha_creacion);`,
            {
                replacements: { role: customRole },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        consoleHelper.success("Datos de la gráfica obtenidos correctamente");
        return admin;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
};

const graficaUser_todos_fecha = async (fechIni, fechFin) => {
    try {
        console.log('Custom date:', fechIni, fechFin);

        const fechaInicio = fechIni ? `'${fechIni}'` : 'NULL';
        const fechaFin = fechFin ? `'${fechFin}'` : 'NULL';

        const admin = await dbConnection.query(
            `SELECT role, COUNT(*) AS Total FROM JA_Usuario WHERE fecha_creacion BETWEEN ${fechaInicio} AND ${fechaFin} GROUP BY role;`,
            {
                type: sequelize.QueryTypes.SELECT,
            }
        );

        consoleHelper.success("Datos de la gráfica obtenidos correctamente");
        return admin;
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

    listRoles,

    graficaUser_todos,
    graficaUser,
    graficaUser_todos_fecha,
};