const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const Console = require("../helpers/console");
const consoleHelper = new Console("User Service");

const calulateTable  = `
WITH SeleccionMedida AS (
    SELECT DISTINCT
        M.Nombre,
        C.Ruc,
        M.Anio,
        M.Mes,
        M.Codigo,
        COALESCE(M.Lote, 0) AS Lote,
        COALESCE(M.Manzana, 0) AS Manzana,
        CASE
            WHEN COALESCE(M.Saldo, 0) < 0 THEN 0
            ELSE COALESCE(M.Total, 0)
        END AS Agua,
        COALESCE(M.Alcantarillado, 0) AS Alcantarillado,
        CASE
            WHEN COALESCE(M.Saldo, 0) < 0 THEN COALESCE(M.Saldo, 0) + COALESCE(M.Pago, 0)
            ELSE COALESCE(M.Pago, 0)
        END AS Pago,
        CASE
            WHEN COALESCE(M.Saldo, 0) < 0 THEN 0
            ELSE COALESCE(M.Saldo, 0)
        END AS Saldo
    FROM JA_Medida AS M
    INNER JOIN Cliente AS C ON C.idCliente = M.idCliente
    --WHERE Anio >= 2022
), TotalMedidas AS (
    SELECT
        Nombre, Ruc, Anio, Mes, Codigo, Lote, Manzana,
        SUM(Agua) OVER (PARTITION BY Nombre, Anio, Mes, Codigo, Lote, Manzana) AS TotalAgua,
        SUM(Alcantarillado) OVER (PARTITION BY Nombre, Anio, Mes, Codigo, Lote, Manzana) AS TotalAlcantarillado,
        SUM(Pago) OVER (PARTITION BY Nombre, Anio, Mes, Codigo, Lote, Manzana) AS TotalPago,
        SUM(Saldo) OVER (PARTITION BY Nombre, Anio, Mes, Codigo, Lote, Manzana) AS TotalSaldo
    FROM SeleccionMedida
	--WHERE Agua + Alcantarillado <> Pago + Saldo;
), Medidas AS (
SELECT
    Nombre, Ruc, Anio, Mes, Lote, Manzana,
    SUM(TotalAgua) AS TotalAgua,
    SUM(TotalAlcantarillado) AS TotalAlcantarillado,
    SUM(TotalPago) AS TotalPago,
    SUM(TotalSaldo) AS TotalSaldo,
    STUFF((SELECT ', ' + Codigo FROM TotalMedidas t2
           WHERE t2.Nombre = t1.Nombre AND t2.Anio = t1.Anio AND t2.Mes = t1.Mes AND t2.Lote = t1.Lote AND t2.Manzana = t1.Manzana
           FOR XML PATH('')), 1, 2, '') AS Codigos
FROM TotalMedidas t1
GROUP BY Nombre, Ruc, Anio, Mes, Lote, Manzana
)`;

/**
 * Obtener Datos para list del filtro de medida
 * @returns 
 */

const listAnios = async () => {
    try {
        const anio = await dbConnection.query(
            `${calulateTable}
            SELECT DISTINCT Anio FROM Medidas ORDER BY Anio DESC`
        , {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Años obtenidos correctamente");
        return anio;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}

const listLotesG = async () => {
    try {
        const anio = await dbConnection.query(
            `${calulateTable}
            SELECT DISTINCT Lote FROM Medidas`
        , {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Años obtenidos correctamente");
        return anio;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}

const listManzanaG = async () => {
    try {
        const anio = await dbConnection.query(
            `${calulateTable}
            SELECT DISTINCT Manzana FROM Medidas`
        , {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Años obtenidos correctamente");
        return anio;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}

const getFilteredDataMedida = async (nombre, ruc, anio, mes, lote, manzana) => {
    try {
        const filteredData = await dbConnection.query(
            `${calulateTable}
            SELECT 
                ROUND(SUM(TotalPago) + SUM(TotalSaldo),2) AS TotalEstimado,
                ROUND(SUM(TotalPago), 2) AS TotalRecaudado,
                ROUND(SUM(TotalSaldo), 2) AS TotalPendiente,
                ROUND(SUM(TotalAgua), 2) AS AguaEstimado,
                ROUND(SUM(TotalAlcantarillado), 2) AS AlcantarilladoEstimado,
                ROUND(SUM(TotalAgua) + SUM(TotalAlcantarillado), 2) AS TotalReal,
                ROUND((SUM(TotalPago) + SUM(TotalSaldo)) - (SUM(TotalAgua) + SUM(TotalAlcantarillado)), 2) AS Exedente

            FROM Medidas
            WHERE (:nombre = \'\' OR Nombre = :nombre)
                AND (:ruc = \'\' OR Ruc = :ruc)
                AND (:anio = \'TODOS\' OR Anio = :anio)
                AND (:mes = \'TODOS\' OR Mes = :mes)
                AND (:lote = \'TODOS\' OR Lote = :lote)
                AND (:manzana = \'TODOS\' OR Manzana = :manzana)`,
            {
                replacements: { nombre, ruc, anio, mes, lote, manzana },
                type: dbConnection.QueryTypes.SELECT,
            }
        );

        return filteredData;
    } catch (error) {
        console.error('Error al obtener datos filtrados:', error);
        throw error;
    }
};





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

const contFade = async () => {
    try {
        const fade = await dbConnection.query("SELECT COUNT(*) AS cont FROM JA_MultaDetalle", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Numero de multas obtenidas correctamente");
        return fade;
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
            `SELECT DISTINCT
               CASE Estado
                   WHEN 0 THEN CAST(0 AS VARCHAR(20))
                   WHEN 1 THEN CAST(1 AS VARCHAR(20))
                   ELSE CAST(Estado AS VARCHAR(20))
               END AS 'idEstado',
               CASE Estado
                   WHEN 0 THEN CAST('ESTABLE' AS VARCHAR(20))
                   WHEN 1 THEN CAST('REPARACIÓN' AS VARCHAR(20))
                   ELSE CAST(Estado AS VARCHAR(20))
               END AS 'Estado'
            FROM JA_Medidor;`, {
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
            `WITH TotalMedidores AS (
                SELECT Nombre, COUNT(*) AS Total
                FROM JA_Medidor
                GROUP BY Nombre
            )
            SELECT DISTINCT T.Total
            FROM JA_Medidor AS M
            INNER JOIN TotalMedidores T ON M.Nombre = T.Nombre
            ORDER BY T.Total ASC`, {
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
        const lote = await dbConnection.query("SELECT DISTINCT COALESCE(Lote, 0) AS Lote FROM JA_Medidor ORDER BY Lote ASC;", {
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
        const manzana = await dbConnection.query("SELECT DISTINCT COALESCE(Manzana, 0) AS Manzana FROM JA_Medidor ORDER BY Manzana ASC", {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Manzanas obtenidos correctamente");
        return manzana;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}


// Multas
const listMultas = async () => {
    try {
        const multas = await dbConnection.query(
            `SELECT DISTINCT	M.idMulta, M.typeFine AS Multa
            FROM JA_Multa AS M
            INNER JOIN JA_MultaDetalle AS MD ON MD.id_multa = M.idMulta`, {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Multa obtenida correctamente");
        return multas;
    } catch (error) {
        consoleHelper.error(error.msg);
        throw new Error(error.msg);
    }
}

const listPagado = async () => {
    try {
        const estado = await dbConnection.query(
            `SELECT DISTINCT
            CASE pagado
                WHEN 0 THEN CAST(0 AS VARCHAR(20))
                WHEN 1 THEN CAST(1 AS VARCHAR(20))
                ELSE CAST(pagado AS VARCHAR(20))
            END AS 'idPagado',
            CASE pagado
                WHEN 0 THEN CAST('PENDIENTE' AS VARCHAR(20))
                WHEN 1 THEN CAST('PAGADO' AS VARCHAR(20))
                ELSE CAST(pagado AS VARCHAR(20))
            END AS 'Pagado'
         FROM JA_MultaDetalle;`, {
            type: sequelize.QueryTypes.SELECT,
        });
        consoleHelper.success("Estado de pago obtenido correctamente");
        return estado;
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
            `SELECT C.Nombre, COUNT(*) AS Total
            FROM Cliente AS C
            INNER JOIN ClienteCiudad AS CC ON CC.idCiudad = C.idCiudad
            WHERE (:idCiudad = \'TODOS\' OR C.idCiudad = :idCiudad)
               AND (:idPais = \'TODOS\' OR C.idPais = :idPais)
               AND (:idTipoCliente = \'TODOS\' OR C.idClienteTipo = :idTipoCliente)
            GROUP BY C.Nombre`,
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
                AND (:lote = 'TODOS' OR COALESCE(M.Lote, 0) = :lote) 
                AND (:manzana = 'TODOS' OR COALESCE(M.Manzana, 0) = :manzana);`,
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


// Multas
const getFilteredDataMultas = async (multa, estado) => {
    try {
        const filteredData = await dbConnection.query(
            `SELECT C.Nombre, M.idMulta, SUM(M.cost) AS TotalCost
            FROM JA_Multa AS M
            INNER JOIN JA_MultaDetalle AS MD ON MD.id_multa = M.idMulta
            INNER JOIN Cliente AS C ON C.idCliente = MD.id_cliente
            WHERE (:multa = 'TODOS' OR M.idMulta = :multa)
                AND (:estado = 'TODOS' OR MD.pagado = :estado)
            GROUP BY C.Nombre, M.idMulta;`,
            {
                replacements: { multa, estado },
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
    listAnios,
    listLotesG,
    listManzanaG,
    getFilteredDataMedida,

    contClients,
    contMeter,
    contFade,
    contUsers,

    listEstado,
    listCiudad,
    listPais,
    listTipoCliente,

    listCantidad,
    listLote,
    listManzana,

    listMultas,
    listPagado,

    listRoles,

    getFilteredDataClients,
    getFilteredDataMedidores,
    getFilteredDataMultas,

    graficaUser_todos,
    graficaUser,
};