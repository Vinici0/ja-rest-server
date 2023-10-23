create table ja_empresa (
    idEmpresa int primary key identity(1,1),
    nombreEmpresa varchar(255),
    rucEmpresa varchar(255),
    direccionEmpresa varchar(255),
    telefonoEmpresa varchar(255),
    emailEmpresa varchar(255),
    imgEmpresa varchar(255),
    mensajeEmpresa varchar(255)
)

create table ja_interes (
    idInteres int primary key identity(1,1),
    interes decimal(10,2),
    descripcion varchar(255)
)