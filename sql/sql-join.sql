CREATE LOGIN test1 WITH PASSWORD = 'root', CHECK_POLICY = OFF;
GO

-- Asignar el rol sysadmin al usuario
ALTER SERVER ROLE sysadmin ADD MEMBER test1;
GO


-------------------------------------------------------------------------------------------
create table ja_empresa (
    idEmpresa int primary key identity(1,1),
    nombreEmpresa varchar(255),
    rucEmpresa varchar(255),
    direccionEmpresa varchar(255),
    telefonoEmpresa varchar(255),
    emailEmpresa varchar(255),
    img varchar(255),
    mensajeEmpresa varchar(255)
)

INSERT INTO ja_empresa (nombreEmpresa, rucEmpresa, direccionEmpresa, telefonoEmpresa, emailEmpresa, img, mensajeEmpresa) VALUES ('Empresa', '123456789', 'Direccion', '123456789', 'empresa@gmail.com', 'img.jpg', 'Mensaje de la empresa')

create table ja_interes (
    idInteres int primary key identity(1,1),
    interes int,
    descripcion varchar(255)
)

insert into ja_interes (interes, descripcion) values (3, 'Sin interes')

-- Altarando una tabla
ALTER TABLE ja_medida
ADD Alcantarillado DECIMAL (8, 2);

-- Se altera la tabla para agregar el campo Discapacidad
ALTER TABLE CLIENTE
ADD Discapacidad BIT;
-- Se actualiza la tabla para que no tenga valores nulos
UPDATE CLIENTE SET Discapacidad = 0 WHERE Discapacidad IS NULL;


---------------------------------------------------------------------
CREATE TABLE JA_Multa (
        idMulta INT PRIMARY KEY IDENTITY(1,1),
        typeFine NVARCHAR(255),
        cost DECIMAL(10, 2)
)

CREATE TABLE JA_MultaDetalle (
    idMultaDetalle INT PRIMARY KEY IDENTITY(1,1),
    id_cliente INT NOT NULL,
    id_multa INT NOT NULL,
    valor_pagar DECIMAL(10, 2),
    date_fine DATE,
    fecha_pago DATE, -- Nueva columna para la fecha de pago
    descripcion VARCHAR(255),
    pagado BIT DEFAULT 0,
    FOREIGN KEY (id_multa) REFERENCES JA_Multa(idMulta)
)

INSERT INTO JA_Multa (typeFine, cost) VALUES ('Falta a la reunión', 0.50)
INSERT INTO JA_Multa (typeFine, cost) VALUES ('Falta a la reunión', 0.50)


    CREATE PROCEDURE sp_CalcularTotalesMultas
AS
BEGIN
    SELECT
        c.nombre,
        c.ruc,
        COUNT(m.id_cliente) AS cantidadMultas,
        SUM(m.valor_pagar) AS totalPagar
    FROM
        cliente c
    INNER JOIN
        JA_MultaDetalle m ON m.id_cliente = c.idCliente
    GROUP BY
        c.Nombre, c.ruc;
END;
 
-------------------------------------------------------------------------------------------

CREATE PROCEDURE ObtenerRegistrosPorSaldoMayorACero
    @Anio INT,
    @Codigo NVARCHAR(50)
AS
BEGIN
    SELECT jm.Manzana, jm.Lote, jm.Nombre, cl.codigo, COUNT(*) as meses, SUM(jm.saldo) as saldo
    FROM ja_medida  jm
    INNER JOIN Cliente cl ON jm.idcliente = cl.idcliente
    WHERE ISNULL(jm.Saldo, 0) > 0.01 AND jm.Anio = @Anio AND cl.codigo = @Codigo
    GROUP BY jm.Manzana, jm.Lote, jm.Nombre, cl.codigo
    HAVING COUNT(ISNULL(jm.Saldo, 0)) >= (SELECT COUNT(*) FROM ja_medida WHERE ISNULL(Saldo, 0) > 0.01)
END;

EXEC ObtenerRegistrosPorSaldoMayorACero @Anio = 2023, @Codigo = '67187';


-----------------------------------------------------------------------------------------------
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
    ORDER BY  Manzana, Lote;
    
END;
-- Ejemplo de ejecución del procedimiento almacenado
EXEC [dbo].[ObtenerMedidasPorMesYAnio] @Anio = 2023, @Mes = 9;


---------------------------------------------------------------------------------------
                            Creando registros anuales - Aprovado
---------------------------------------------------------------------------------------


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



---------------------------------------------------------------------------------------------

CREATE PROCEDURE ActualizarEstadoMedidor
    @idMedidor INT,
    @estado BIT
AS
BEGIN
    UPDATE JA_Medidor SET estado = @estado WHERE idMedidor = @idMedidor;
END;


CREATE TABLE JA_Usuario (
    idJaUsuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    img NVARCHAR(255),
    role NVARCHAR(50) NOT NULL DEFAULT 'USER_ROLE',
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_ingreso DATETIME NOT NULL DEFAULT GETDATE(),
);


UPDATE JA_Usuario SET role = 'ADMIN_ROLE' WHERE idJaUsuario = 1;


    CREATE PROCEDURE InsertarUsuario
        @Nombre NVARCHAR(255),
        @Email NVARCHAR(255),
        @Password NVARCHAR(255),
        @Role NVARCHAR(50)
    AS
    BEGIN
        SET NOCOUNT ON;

        DECLARE @InsertedRows TABLE (
            idJaUsuario INT,
            nombre NVARCHAR(255),
            email NVARCHAR(255),
            password NVARCHAR(255),
            img NVARCHAR(255),
            role NVARCHAR(50),
            fecha_creacion DATETIME,
            fecha_modificacion DATETIME,
            fecha_ingreso DATETIME
        );

        -- Insertar el nuevo usuario
        INSERT INTO JA_Usuario (Nombre, Email, Password, Role, fecha_creacion, fecha_modificacion, fecha_ingreso)
        OUTPUT inserted.idJaUsuario, inserted.Nombre, inserted.Email, inserted.Password, inserted.img, inserted.Role, inserted.fecha_creacion, inserted.fecha_modificacion, inserted.fecha_ingreso INTO @InsertedRows
        VALUES (@Nombre, @Email, @Password, @Role, GETDATE(), GETDATE(), GETDATE());

        -- Devolver los datos del usuario recién insertado
        SELECT * FROM @InsertedRows;
    END;
    GO

-- Ejemplo de ejecución del procedimiento almacenado
CREATE PROCEDURE ObtenerInformacionCliente
@idCliente int
AS
BEGIN
SELECT Nombre,Ruc, Direccion, Email, Telefono, id_cliente, JA_MultaDetalle.idMultaDetalle,Fecha, typeFine
FROM JA_MultaDetalle
INNER JOIN JA_Multa ON JA_MultaDetalle .id_multa = JA_Multa.idMulta
INNER JOIN Cliente ON Cliente.idCliente = JA_MultaDetalle.id_cliente
where id_cliente = @idCliente
END