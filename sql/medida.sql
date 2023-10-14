



----------------------------------------------------------------
            Obtener todas las medidas por mes y año
----------------------------------------------------------------
CREATE PROCEDURE [dbo].[ObtenerMedidasPorMesYAnio]
    @Anio INT,
    @Mes INT
AS
BEGIN
    SELECT *
    FROM JA_Medida
    WHERE Anio = @Anio AND Mes = @Mes
    ORDER BY idMedida;

	  SELECT *
    FROM JA_Medida
END;
-- Ejemplo de ejecución del procedimiento almacenado
EXEC [dbo].[ObtenerMedidasPorMesYAnio] @Anio = 2023, @Mes = 9;

----------------------------------------------------------------
            Obtener todas las medidas por mes, año y cliente
----------------------------------------------------------------
CREATE PROCEDURE [dbo].[ObtenerMedidasPorMesAnioYCliente]
    @Anio INT,
    @Mes INT,
    @idCliente INT
AS
BEGIN
    SELECT *
    FROM JA_Medida
    WHERE Anio = @Anio AND Mes = @Mes AND idCliente = @idCliente
    ORDER BY idMedida;
END;

-- Ejemplo de ejecución del procedimiento almacenado
EXEC [dbo].[ObtenerMedidasPorMesAnioYCliente] @Anio = 2023, @Mes = 9, @idCliente = 1;

----------------------------------------------------------------
                Insertar una medida nueva
----------------------------------------------------------------
CREATE PROCEDURE [dbo].[InsertarMedida]
    @Anio INT,
    @Mes INT,
    @idCliente INT,
    @Nombre VARCHAR(600),
    @Codigo NVARCHAR(15),
    @Lote NVARCHAR(20),
    @Manzana NVARCHAR(20),
    @Planilla FLOAT
AS
BEGIN
    INSERT INTO [JUNTADEAGUAELPORTON].[dbo].[JA_Medida]
    (
        [Anio],
        [Mes],
        [idCliente],
        [LecturaAnterior],
        [LecturaActual],
        [Consumo],
        [Excedente],
        [Basico],
        [ExcedenteV],
        [Total],
        [Acumulado],
        [Pago],
        [Saldo],
        [Cancelada],
        [Usurario],
        [Estacion],
        [Nombre],
        [Codigo],
        [Lote],
        [Manzana],
        [Planilla]
    )
    VALUES
    (
        @Anio,
        @Mes,
        @idCliente,
        0,
        0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        0,
        0,
        NULL,
        'Administrador',
        'DESKTOP-O1M5TLO',
        @Nombre,
        @Codigo,
        @Lote,
        @Manzana,
        @Planilla
    );
END;

EXEC [dbo].[InsertarMedida]
    @Anio = 2023,
    @Mes = 10,
    @idCliente = 1,
    @Nombre = 'NombreCliente',
    @Codigo = 'CodigoCliente',
    @Lote = 'LoteCliente',
    @Manzana = 'ManzanaCliente',
    @Planilla = 100.00;

----------------------------------------------------------------
                Actualizar una medida
----------------------------------------------------------------
CREATE PROCEDURE [dbo].[ActualizarMedida]
    @Anio INT,
    @Mes INT,
    @idCliente INT,
    @LecturaActual FLOAT,
    @Excedente FLOAT,
    @Basico FLOAT,
    @ExcedenteV FLOAT,
    @Total FLOAT,
    @Acumulado FLOAT,
    @Pago FLOAT,
    @Saldo FLOAT,
    @Codigo NVARCHAR(15)
AS
BEGIN
    DECLARE @LecturaAnteriorAnterior FLOAT;
    DECLARE @AcumuladoAnterior FLOAT;

    -- Obtener la LecturaActual del mes anterior
    SELECT @LecturaAnteriorAnterior = LecturaActual, @AcumuladoAnterior = Acumulado
    FROM JA_Medida
    WHERE Anio = @Anio AND Mes = @Mes - 1 AND Codigo = @Codigo;

    IF EXISTS (SELECT * FROM JA_Medida WHERE Anio = @Anio AND Mes = @Mes AND Codigo = @Codigo)
    BEGIN
        -- Actualizar la medida anterior del mes con la LecturaActual del mes anterior
        UPDATE JA_Medida
        SET
            LecturaAnterior = @LecturaAnteriorAnterior,
            LecturaActual = @LecturaActual,
            Excedente = @Excedente,
            Basico = @Basico,
            ExcedenteV = @ExcedenteV,
            Total = @Total,
            Acumulado = @AcumuladoAnterior + @Total,
            Pago = @Pago,
            Saldo = @Saldo
        WHERE Anio = @Anio AND Mes = @Mes AND Codigo = @Codigo
    END
END;

EXEC [dbo].[ActualizarMedida]
    @Anio = 2023,
    @Mes = 10,
    @idCliente = 1,
    @LecturaActual = 100.00,
    @Excedente = 100.00,
    @Basico = 100.00,
    @ExcedenteV = 100.00,
    @Total = 100.00,
    @Acumulado = 100.00,
    @Pago = 100.00,
    @Saldo = 100.00,
    @Codigo = '20 000 325';

Update medida de milton

UPDATE [dbo].[JA_Medida]
   SET [LecturaActual] = 0
      ,[Excedente] = 0
      ,[Basico] = NULL
      ,[ExcedenteV] = NULL
      ,[Total] = NULL
      ,[Acumulado] = NULL
      ,[Pago] = 0
      ,[Saldo] = 0
 WHERE [idMedida] = 2051 AND [Anio] = 2023 AND [Mes] = 10 AND [idCliente] = 2051

---------------------------------------------------------------------------------------
                            Creando registros anuales - Aprovado
---------------------------------------------------------------------------------------
USE [JUNTADEAGUAELPORTON]
GO

CREATE PROCEDURE CrearRegistrosPredeterminados
AS
BEGIN
    DECLARE @Anio INT = 2024; -- Obtener el año actual
    
    -- Variable para contar la cantidad de registros para el año en curso
    DECLARE @CantidadRegistros INT;

    -- Verificar si ya existen registros para el año en curso
    SELECT @CantidadRegistros = COUNT(*)
    FROM JA_Medida
    WHERE Anio = @Anio;

    -- Si no hay registros para el año en curso, entonces procede a crearlos
    IF @CantidadRegistros = 0
    BEGIN
        -- Variables para almacenar el código de cliente, idCliente, nombre, lote y manzana
        DECLARE @Codigo NVARCHAR(15);
        DECLARE @idCliente INT;
        DECLARE @Nombre VARCHAR(600);
        DECLARE @Lote NVARCHAR(20);
        DECLARE @Manzana NVARCHAR(20);

        -- Cursor para recorrer todos los códigos de cliente existentes registrados en diciembre del año anterior (mes 12 del año anterior)
        DECLARE cursorCodigos CURSOR FOR
        SELECT idCliente, Codigo, Nombre, Lote, Manzana FROM JA_Medida
        WHERE Anio = @Anio - 1 AND Mes = 12;

        DECLARE @MesInicial INT = 1;
        DECLARE @MesFinal INT = 12;

        OPEN cursorCodigos;
        FETCH NEXT FROM cursorCodigos INTO @idCliente, @Codigo, @Nombre, @Lote, @Manzana;

        -- Loop a través de los códigos de cliente
        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Loop para crear registros para cada mes del año actual
            WHILE @MesInicial <= @MesFinal
            BEGIN
                -- Insertar un nuevo registro con valores predeterminados
                INSERT INTO JA_Medida (Anio, Mes, idCliente, Codigo, Nombre, Lote, Manzana, Usurario, Estacion) 
                VALUES (@Anio, @MesInicial, @idCliente, @Codigo, @Nombre, @Lote, @Manzana, 'Administrador', 'DESKTOP-O1M5TLO');

                SET @MesInicial = @MesInicial + 1;
            END

            -- Reiniciar el valor del mes inicial para el próximo código
            SET @MesInicial = 1;

            FETCH NEXT FROM cursorCodigos INTO @idCliente, @Codigo, @Nombre, @Lote, @Manzana;
        END

        CLOSE cursorCodigos;
        DEALLOCATE cursorCodigos;
    END
END;
GO

---------------------------------------------------------------------------------------
                    Copiar LecturaActual a LecturaAnterior - Comprobado
---------------------------------------------------------------------------------------
USE [JUNTADEAGUAELPORTON]
GO

CREATE PROCEDURE [dbo].[ActualizarLecturaActualParaTodos]
    @Anio INT,
    @Mes INT
AS
BEGIN
    -- Verificar si estamos en enero (mes 1)
    IF @Mes = 1
    BEGIN
        -- Configurar el mes y el año del mes anterior
        SET @Mes = 12;
        SET @Anio = @Anio - 1;
    END
    ELSE
    BEGIN
        -- Configurar el mes anterior
        SET @Mes = @Mes - 1;
    END

    -- Actualizar el Basico y Acumulado del mes anterior para todos los códigos
    UPDATE JA_Medida
    SET Basico = (
        SELECT TOP 1 Basico
        FROM JA_Medida AS M
        WHERE M.Anio = @Anio AND M.Mes = @Mes AND M.Codigo = JA_Medida.Codigo
    ),
    Acumulado = (
        SELECT TOP 1 Acumulado
        FROM JA_Medida AS M
        WHERE M.Anio = @Anio AND M.Mes = @Mes AND M.Codigo = JA_Medida.Codigo
    )
    WHERE Anio = @Anio AND Mes = @Mes + 1;

    -- Actualizar la LecturaAnterior del nuevo mes para todos los códigos
    UPDATE JA_Medida
    SET LecturaAnterior = (
        SELECT TOP 1 LecturaActual
        FROM JA_Medida AS M
        WHERE M.Anio = @Anio AND M.Mes = @Mes AND M.Codigo = JA_Medida.Codigo
    ) 
    WHERE Anio = @Anio AND Mes = @Mes + 1;

    SELECT * FROM JA_Medida WHERE Anio = @Anio AND Mes = @Mes + 1;
END;

EXEC [dbo].[ActualizarLecturaActualParaTodos] @Anio = 2023, @Mes = 10;


---------------------------------------------------------------------------------------
                    Editar Medida - Comprobado
---------------------------------------------------------------------------------------
CREATE PROCEDURE EditarMedida
(
    @idMedida INT,
    @LecturaActual FLOAT,
    @Excedente FLOAT,
    @Basico FLOAT,
    @ExcedenteV FLOAT,
    @Total FLOAT,
    @Acumulado FLOAT,
    @Pago FLOAT,
    @Saldo FLOAT
)
AS
BEGIN
    UPDATE JA_Medida
    SET
        LecturaActual = @LecturaActual,
        Excedente = @Excedente,
        Basico = @Basico,
        ExcedenteV = @ExcedenteV,
        Total = @Total,
        Acumulado = @Acumulado,
        Pago = @Pago,
        Saldo = @Saldo
    WHERE
        idMedida = @idMedida;
END;

exec EditarMedida
    @idMedida = 1,
    @LecturaActual = 100.00,
    @Excedente = 100.00,
    @Basico = 100.00,
    @ExcedenteV = 100.00,
    @Total = 100.00,
    @Acumulado = 100.00,
    @Pago = 100.00,
    @Saldo = 100.00;

---------------------------------------------------------------------------------------
                    Buscar Medida por Anio y Mes - Comprobado
---------------------------------------------------------------------------------------
CREATE PROCEDURE BuscarMedidaPorAnioMesCliente
(
    @Anio INT,
    @Mes INT,
    @Codigo varchar(30)
)
AS
BEGIN
    SELECT *
    FROM JA_Medida
    WHERE Anio = @Anio
      AND Mes = @Mes
      AND Codigo = @Codigo;
END;

exec BuscarMedidaPorAnioMesCliente
    @Anio = 2023,
    @Mes = 10,
    @Codigo = 62528;
