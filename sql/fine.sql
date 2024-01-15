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
 
