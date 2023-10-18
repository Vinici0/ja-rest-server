CREATE TABLE JA_Usuario (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    img NVARCHAR(255),
    role NVARCHAR(50) NOT NULL DEFAULT 'USER_ROLE',
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_ingreso DATETIME NOT NULL DEFAULT GETDATE(),
);
