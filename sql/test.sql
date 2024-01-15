use [YourDatabaseName] EXEC sp_changedbowner 'sa'
USE [JUNTADEAGUAELPORTON]
GO

/****** Object:  Table [dbo].[JA_Medida]    Script Date: 9/30/2023 3:30:27 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[JA_Medida](
	[idMedida] [int] IDENTITY(1,1) NOT NULL,
	[Anio] [int] NULL,
	[Mes] [int] NULL,
	[idCliente] [int] NULL,
	[LecturaAnterior] [float] NULL,
	[LecturaActual] [float] NULL,
	[Consumo] [float] NULL,
	[Excedente] [float] NULL,
	[Basico] [float] NULL,
	[ExcedenteV] [float] NULL,
	[Total] [float] NULL,
	[Acumulado] [float] NULL,
	[Pago] [float] NULL,
	[Saldo] [float] NULL,
	[Cancelada] [bit] NULL,
	[Usurario] [varchar](50) NULL,
	[Estacion] [varchar](50) NULL,
	[Nombre] [varchar](600) NULL,
	[Codigo] [nvarchar](15) NULL,
	[Lote] [nvarchar](20) NULL,
	[Manzana] [nvarchar](20) NULL,
	[Planilla] [float] NULL,
 CONSTRAINT [PK_JA_Medida] PRIMARY KEY CLUSTERED 
(
	[idMedida] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- -------------------------------------------------------------------------------------
EXEC sp_GetTableRecordCounts;
-- -------------------------------------------------------------------------------------


calculos 
[Excedente] = [LecturaActual]-[LecturaAnterior]-15
[Basico]=5.5
[ExcedenteV]=[Excedente]*Dependiendo en que rango este
Tabla relacionada con [ExcedenteV]
0 - 15 paga 5.50
16 - 39 paga = 0.25
40 - 49 paga = 0.5
50 en adelanta paga 1

[Total]=[Basico] + [ExcedenteV]
[Acumulado]=[Total]+[Acumulado]
[Pago]=[Pago] - [Total]
