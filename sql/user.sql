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

EXEC InsertarUsuario 'Juan', '