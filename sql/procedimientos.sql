Ayudame a crear un registro de medida que donde los datos sean los siguientes:
Datos enviados por el cliente y default
,[Anio] =Cliente
,[Mes] =Cliente
,[idCliente] =Cliente
,[LecturaAnterior] = default 0
,[LecturaActual] = default 0
,[Consumo] = default null
,[Excedente] = default null
,[Basico] = default null
,[ExcedenteV]   = default null
,[Total] = default null
,[Acumulado] = default  null
,[Pago] = default 0
,[Saldo] = default 0
,[Cancelada] = default null
,[Usurario] = default Administrador
,[Estacion] = default DESKTOP-O1M5TLO
,[Nombre] =Cliente
,[Codigo] =Cliente
,[Lote] =Cliente
,[Manzana] =Cliente
,[Planilla] =Cliente

SELECT TOP (1000) [idMedida]
      ,[Anio]
      ,[Mes]
      ,[idCliente]
      ,[LecturaAnterior]
      ,[LecturaActual]
      ,[Consumo]
      ,[Excedente]
      ,[Basico]
      ,[ExcedenteV]
      ,[Total]
      ,[Acumulado]
      ,[Pago]
      ,[Saldo]
      ,[Cancelada]
      ,[Usurario]
      ,[Estacion]
      ,[Nombre]
      ,[Codigo]
      ,[Lote]
      ,[Manzana]
      ,[Planilla]
  FROM [JUNTADEAGUAELPORTON].[dbo].[JA_Medida]


