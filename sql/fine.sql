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
    descripcion VARCHAR(255),
    tipo_multa VARCHAR(50),
    pagado BIT DEFAULT 0,
    FOREIGN KEY (id_multa) REFERENCES JA_Multa(idMulta)
)
