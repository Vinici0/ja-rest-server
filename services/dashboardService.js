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
        const client = await dbConnection.query("SELECT COUNT( DISTINCT Nombre) AS cont FROM Cliente", {
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
        const meter = await dbConnection.query("SELECT COUNT(DISTINCT idMedidor) AS cont FROM JA_Medidor", {
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
        const repair_meter = await dbConnection.query("SELECT COUNT(idMedidor) AS cont FROM JA_Medidor WHERE Estado = 1", {
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
// Clientes
const listCiudad = async () => {
    try {
        const city = await dbConnection.query("SELECT DISTINCT C.idCiudad, CC.Ciudad FROM Cliente AS C INNER JOIN ClienteCiudad AS CC ON CC.idCiudad = C.idCiudad", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Ciudades obtenidas correctamente");
        return city;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}

const listPais = async () => {
    try {
        const country = await dbConnection.query("SELECT DISTINCT C.idPais, CP.Pais FROM Cliente AS C INNER JOIN ClientePais AS CP ON CP.idClientePais = C.idPais", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Países obtenidos correctamente");
        return country;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}

const listTipoCliente = async () => {
    try {
        const tipe = await dbConnection.query("SELECT DISTINCT C.idClienteTipo, CT.TipoCliente FROM Cliente AS C INNER JOIN ClienteTipo AS CT ON CT.idTipoCliente = C.idClienteTipo", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Tipo de clientes obtenidos correctamente");
        return tipe;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}



// Medidores
const listEstado = async () => {
    try {
        const estado = await dbConnection.query(
            "SELECT DISTINCT " +
            "   CASE Estado " +
            "       WHEN 0 THEN CAST(0 AS VARCHAR(20)) " +
            "       WHEN 1 THEN CAST(1 AS VARCHAR(20)) " +
            "       ELSE CAST(Estado AS VARCHAR(20)) " +
            "   END AS 'idEstado', " +
            "   CASE Estado " +
            "       WHEN 0 THEN CAST('ESTABLE' AS VARCHAR(20))" +
            "       WHEN 1 THEN CAST('REPARACIÓN' AS VARCHAR(20)) " +
            "       ELSE CAST(Estado AS VARCHAR(20)) " +
            "   END AS 'Estado' " +
            "FROM JA_Medidor;", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Estado obtenido correctamente");
        return estado;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}

const listCantidad = async () => {
    try {
        const cantidad = await dbConnection.query(
            "WITH TotalMedidores AS ( " +
            "    SELECT Nombre, COUNT(*) AS Total " +
            "    FROM JA_Medidor " +
            "    GROUP BY Nombre " +
            ") " +
            "SELECT DISTINCT T.Total " +
            "FROM JA_Medidor AS M " +
            "INNER JOIN TotalMedidores T ON M.Nombre = T.Nombre " +
            "ORDER BY T.Total ASC ", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Cantidad obtenida correctamente");
        return cantidad;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}

const listLote = async () => {
    try {
        const lote = await dbConnection.query("SELECT DISTINCT Lote FROM JA_Medidor WHERE Lote IS NOT NULL ORDER BY Lote ASC;", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Lotes obtenidos correctamente");
        return lote;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}

const listManzana = async () => {
    try {
        const manzana = await dbConnection.query("SELECT DISTINCT Manzana FROM JA_Medidor WHERE Manzana IS NOT NULL ORDER BY Manzana ASC", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Manzanas obtenidos correctamente");
        return manzana;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}





// Usuarios
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
// Clientes
const getFilteredDataClients = async (idCiudad, idPais, idTipoCliente) => {
    try {
        const filteredData = await dbConnection.query(
            'SELECT C.Nombre, COUNT(*) AS Total ' +
            'FROM Cliente AS C ' +
            'INNER JOIN ClienteCiudad AS CC ON CC.idCiudad = C.idCiudad ' +
            'WHERE ' +
            '   (:idCiudad = \'TODOS\' OR C.idCiudad = :idCiudad) ' +
            '   AND (:idPais = \'TODOS\' OR C.idPais = :idPais) ' +
            '   AND (:idTipoCliente = \'TODOS\' OR C.idClienteTipo = :idTipoCliente) ' +
            'GROUP BY C.Nombre',
            {
                replacements: { idCiudad, idPais, idTipoCliente },
                type: dbConnection.QueryTypes.SELECT,
            }
        );

        return filteredData;
    } catch (error) {
        console.error('Error al obtener datos filtrados:', error);
        throw error;
    }
};


// Medidores
const getFilteredDataMedidores = async (estado, numMedidores, lote, manzana) => {
    try {
        const filteredData = await dbConnection.query(
            `WITH TotalesMedidores AS ( 
                 SELECT Nombre, COUNT(*) AS Total, STRING_AGG(Codigo, ', ') AS Codigos 
                 FROM JA_Medidor 
                 GROUP BY Nombre 
            ) 
            SELECT DISTINCT M.Nombre, T.Total, T.Codigos 
            FROM JA_Medidor M 
            INNER JOIN TotalesMedidores T ON M.Nombre = T.Nombre 
            WHERE (:estado = 'TODOS' OR M.Estado = :estado) 
                AND (:numMedidores = 'TODOS' OR T.Total = :numMedidores) 
                AND (:lote = 'TODOS' OR M.Lote = :lote) 
                AND (:manzana = 'TODOS' OR M.Manzana = :manzana);`,
            {
                replacements: { estado, numMedidores, lote, manzana },
                type: dbConnection.QueryTypes.SELECT,
            }
        );

        return filteredData;
    } catch (error) {
        console.error('Error al obtener datos filtrados:', error);
        throw error;
    }
};




// Usuarios
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



module.exports = {
    contClients,
    contMeter,
    contReportMeter,
    contUsers,

    listEstado,
    listCiudad,
    listPais,
    listTipoCliente,

    listCantidad,
    listLote,
    listManzana,

    listRoles,

    getFilteredDataClients,
    getFilteredDataMedidores,

    graficaUser_todos,
    graficaUser,
};