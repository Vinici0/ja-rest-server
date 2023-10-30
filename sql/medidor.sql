CREATE TABLE JA_Medidor
(
    idMedidor INT IDENTITY(1,1) PRIMARY KEY,
    idCliente INT,
    Usurario VARCHAR(255),
    Nombre VARCHAR(255),
    Codigo VARCHAR(50),
    Lote VARCHAR(50),
    Manzana VARCHAR(50),
    Estado BIT DEFAULT 0
);



-- Crear la tabla JA_Medidor si no existe
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'JA_Medidor')
BEGIN
    CREATE TABLE JA_Medidor
    (
        idMedidor INT IDENTITY(1,1) PRIMARY KEY,
        idCliente INT,
        Usurario VARCHAR(255),
        Nombre VARCHAR(255),
        Codigo VARCHAR(50),
        Lote VARCHAR(50),
        Manzana VARCHAR(50),
        Estado BIT DEFAULT 0

    );
END;

-- Insertar registros únicos en JA_Medidor a partir del año 2023 en JA_Medida
INSERT INTO JA_Medidor (idCliente, Usurario, Nombre, Codigo, Lote, Manzana)
SELECT DISTINCT
    m.idCliente,
    m.Usurario,
    m.Nombre,
    m.Codigo,
    m.Lote,
    m.Manzana
FROM [JUNTADEAGUAELPORTON].[dbo].[JA_Medida] AS m
WHERE m.Anio >= 2023
    AND m.Codigo IS NOT NULL
    AND NOT EXISTS (
        SELECT 1
        FROM JA_Medidor AS mm
        WHERE mm.Codigo = m.Codigo
    );


-- Crear el procedimiento almacenado
CREATE PROCEDURE ObtenerTodosLosMedidores
AS
BEGIN
    -- Consulta para seleccionar todos los medidores
    SELECT * FROM JA_Medidor;
END;

--------------------------------------------------------------
--  Actualizar el estado de un medidor en JA_Medidor
--------------------------------------------------------------
CREATE PROCEDURE ActualizarEstadoMedidor
    @idMedidor INT,
    @estado BIT
AS
BEGIN
    UPDATE JA_Medidor SET estado = @estado WHERE idMedidor = @idMedidor;
END;

EXEC ActualizarEstadoMedidor 1, 0;

--------------------------------------------------------------
--  Cortes por id de medidor
CREATE Procedure [dbo].[JA_CortesMedidor] @meses int = 3, @codigoMedidor nvarchar(255)
as
BEGIN
    UPDATE ja
    SET ja.nombre = cl.nombre, ja.codigo = cl.codigo, ja.manzana = cl.referencia, ja.lote = cl.RefTelefono
    FROM ja_medida ja
    INNER JOIN cliente cl ON ja.idCliente = cl.idcliente
    WHERE (ja.Nombre != cl.nombre OR ja.Manzana != cl.Referencia OR ja.lote != cl.RefTelefono OR ja.codigo != cl.codigo)
        AND ja.codigo = @codigoMedidor;

    SELECT jm.Manzana, jm.Lote, jm.Nombre, cl.codigo, COUNT(*) as meses, SUM(jm.saldo) as saldo
    FROM ja_medida jm
    INNER JOIN Cliente cl ON jm.idcliente = cl.idcliente
    WHERE ISNULL(jm.Saldo, 0) > 0.01 AND jm.Anio = 2023 AND jm.codigo = @codigoMedidor
    GROUP BY jm.Manzana, jm.Lote, jm.Nombre, cl.codigo
    HAVING COUNT(ISNULL(jm.Saldo, 0)) >= @meses;
END;

exec JA_CortesMedidor @codigoMedidor = '67187'


--------------------------------------------------------------
--  Información anterior por id de medidor y mes
--------------------------------------------------------------
CREATE Procedure [dbo].[JA_SaldosPendientesDesde2022] @mes int, @codigoMedidor nvarchar(255)
as
BEGIN
    SELECT jm.Manzana, jm.Lote, jm.Nombre, cl.codigo, jm.mes, jm.saldo, jm.anio, jm.LecturaAnterior, jm.LecturaActual
    FROM ja_medida jm
    INNER JOIN Cliente cl ON jm.idcliente = cl.idcliente
    WHERE ISNULL(jm.Saldo, 0) > 0.01 AND jm.codigo = @codigoMedidor
        AND (jm.Anio = 2022 AND jm.mes >= @mes-1 OR jm.Anio > 2022);
END;

drop Procedure[JA_SaldosPendientesDesde2022]
EXEC [JA_SaldosPendientesDesde2022] @mes = 7, @codigoMedidor = '67187';

--------------------------------------------------------------
--  prueba
--------------------------------------------------------------
CREATE Procedure [dbo].[JA_SaldosPendientesDesde2022] @mes int, @codigoMedidor nvarchar(255)
as
BEGIN
    SELECT jm.Manzana, jm.Lote, jm.Nombre, cl.codigo, jm.mes, jm.saldo, jm.anio, jm.LecturaAnterior, jm.LecturaActual,
           CASE
               WHEN jm.Anio = 2022 AND jm.mes >= @mes-1 THEN jm.saldo + (jm.saldo * TasaInteres / 100)
               WHEN jm.Anio > 2022 THEN jm.saldo + (jm.saldo * TasaInteres / 100)
               ELSE jm.saldo
           END AS SaldoConInteres
    FROM ja_medida jm
    INNER JOIN Cliente cl ON jm.idcliente = cl.idcliente
    LEFT JOIN TarifasAgua ta ON 1=1 -- Asegúrate de tener una tabla TarifasAgua con la tasa de interés
    WHERE ISNULL(jm.Saldo, 0) > 0.01 AND jm.codigo = @codigoMedidor
        AND (jm.Anio = 2022 AND jm.mes >= @mes-1 OR jm.Anio > 2022);
END;

