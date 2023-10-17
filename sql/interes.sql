UPDATE [dbo].[JA_Medida]
SET [InteresPorRetraso] =
CASE
WHEN Saldo > 0 THEN
CASE
WHEN Mes = (SELECT MIN(Mes) FROM [dbo].[JA_Medida]) THEN (Mes - 1) * 0.5 
WHEN Mes = (SELECT MAX(Mes) FROM [dbo].[JA_Medida]) THEN (12 - Mes) * 1.5 
ELSE (Mes - 1) * 1 -- para otros meses
END
ELSE 0
END;

SELECT * FROM JA_Medida WHERE idCliente = 1325 and anio = 2023 order by mes asc

--------------------------------------------------------------
-- ObtenerRegistrosPorSaldoMayorACero
--------------------------------------------------------------


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