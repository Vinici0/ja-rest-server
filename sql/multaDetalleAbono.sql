CREATE TABLE JA_MultaDetalleAbono (
    idMultaDetalleAbono INT PRIMARY KEY IDENTITY(1,1),
    id_cliente INT,
    id_multaDetalle INT,
    total_abono DECIMAL(10, 2),
    descripcion nchar(100)
);

ALTER TABLE JA_MultaDetalleAbono
ADD CONSTRAINT PK_JA_MultaDetalleAbono PRIMARY KEY (idMultaDetalleAbono);

-- Agregar restricción de clave externa para id_cliente
ALTER TABLE JA_MultaDetalleAbono
ADD CONSTRAINT FK_Cliente_JA_MultaDetalleAbono
FOREIGN KEY (id_cliente)
REFERENCES Cliente (idCliente);

-- Agregar restricción de clave externa para id_multaDetalle
ALTER TABLE JA_MultaDetalleAbono
ADD CONSTRAINT FK_MultaDetalle_JA_MultaDetalleAbono
FOREIGN KEY (id_multaDetalle)
REFERENCES JA_MultaDetalle (idMultaDetalle);