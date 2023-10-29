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
