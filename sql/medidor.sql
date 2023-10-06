CREATE TABLE JA_Medidor
(
    idMedidor INT IDENTITY(1,1) PRIMARY KEY,
    idCliente INT,
    Usurario VARCHAR(255),
    Nombre VARCHAR(255),
    Codigo VARCHAR(50),
    Lote VARCHAR(50),
    Manzana VARCHAR(50),
    Danado BIT DEFAULT 0
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
        Manzana VARCHAR(50)
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
