-- Se altera la tabla para agregar el campo Discapacidad
ALTER TABLE CLIENTE
ADD Discapacidad BIT;
-- Se actualiza la tabla para que no tenga valores nulos
UPDATE CLIENTE SET Discapacidad = 0 WHERE Discapacidad IS NULL;

