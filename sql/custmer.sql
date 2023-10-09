--------------------------------------------
-- Listar Cliente por id
--------------------------------------------
CREATE PROCEDURE ja_ListarCliente
    @idCliente INT
AS
BEGIN
    SELECT
  [idCliente],
        [Nombre],
        [Ruc],
        [Telefono],
        [Email],
        [Direccion],
        [idCiudad]
        FechaNacimiento,
        [EstadoContribuyente],
        [ObligadoContabilidad],
        [Observacion],
		FechaIngreso
        
    FROM [JUNTADEAGUAELPORTON].[dbo].[Cliente]
    WHERE [idCliente] = @idCliente;
END;

EXEC ja_ListarCliente 1;

--------------------------------------------
-- Listar todos los clientes
--------------------------------------------

CREATE PROCEDURE ja_ListarTodosClientes
AS
BEGIN
    SELECT
        [idCliente],
        [Nombre],
        [Ruc],
        [Telefono],
        [Email],
        [Direccion],
        [idCiudad]
        FechaNacimiento,
        [EstadoContribuyente],
        [ObligadoContabilidad],
        [Observacion],
		FechaIngreso
    FROM [JUNTADEAGUAELPORTON].[dbo].[Cliente];
END;

EXEC ja_ListarTodosClientes;

--------------------------------------------
-- Insertar Cliente
--------------------------------------------
CREATE PROCEDURE sp_InsertarClienteReducido
    @Nombre NVARCHAR(255),
    @Ruc NVARCHAR(15),
    @Teléfono NVARCHAR(20),
    @Email NVARCHAR(255),
    @Direccion NVARCHAR(255),
    @Ciudad NVARCHAR(255),
    @FechaNacimiento DATE,
    @EstadoContribuyente NVARCHAR(255),
    @ObligadoContabilidad NVARCHAR(255),
    @Observacion NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO [JUNTADEAGUAELPORTON].[dbo].[Cliente]
    (
        [Nombre],
        [Ruc],
        [Teléfono],
        [Email],
        [Direccion],
        [Ciudad],
        [FechaNacimiento],
        [EstadoContribuyente],
        [ObligadoContabilidad],
        [Observacion]
    )
    VALUES
    (
        @Nombre,
        @Ruc,
        @Teléfono,
        @Email,
        @Direccion,
        @Ciudad,
        @FechaNacimiento,
        @EstadoContribuyente,
        @ObligadoContabilidad,
        @Observacion
    );
END;

