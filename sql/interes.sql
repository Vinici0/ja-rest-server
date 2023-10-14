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

donde saldo sea mayor a 0
Por cada mes de retraso el interes se duplica
mes,anio, total, InteresPorRetraso
02,2023, 1000, total * 
03,2023, 1000, total * 
04,2023, 1000, total * 
05,2023, 1000, total * 
06,2023, 1000, total *  (InteresPorRetraso * 2)
07,2023, 1000, total * (InteresPorRetraso * 1)

//aactualizar interes por retraso
UPDATE [dbo].[JA_Medida]
SET [InteresPorRetraso] = 0
WHERE idCliente = 1325 and anio = 2023 and mes = 7
