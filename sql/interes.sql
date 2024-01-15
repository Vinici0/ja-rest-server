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