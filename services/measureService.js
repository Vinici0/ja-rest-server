const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const Console = require("../helpers/console");
const consoleHelper = new Console("User Service");

const getMeasurements = async () => {
  try {
    const measure = await dbConnection.query("EXEC ObtenerMedidasPorMesYAnio @Anio = 2023, @Mes = 8", {
      type: sequelize.QueryTypes.SELECT,
    });
    consoleHelper.success("Medida obtenida correctamente");
    return measure;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};


const getMeasurementsByMonthAndYear = async (Mes, Anio) => {
  try {
    const measure = await dbConnection.query(
      `EXEC ObtenerMedidasPorMesYAnio @Mes = :Mes, @Anio = :Anio`,
      {
        replacements: { Mes, Anio },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    consoleHelper.success("Medida obtenida correctamente");
    return measure;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const updateMeasurement = async (
  Anio,
  Mes,
  LecturaAnterior,
  LecturaActual,
  idCliente,
  Codigo
) => {
  const Excedente = LecturaActual - LecturaAnterior - 15;
  const Basico = 5.5;
  let ExcedenteV = 0;

  if (Excedente >= 0 && Excedente <= 15) {
    ExcedenteV = 5.5;
  } else if (Excedente >= 16 && Excedente <= 39) {
    ExcedenteV = 0.25;
  } else if (Excedente >= 40 && Excedente <= 49) {
    ExcedenteV = 0.5;
  } else if (Excedente >= 50) {
    ExcedenteV = 1;
  }

  const Total = Basico + ExcedenteV;
  const Pago = 0; //TODO: implementar en la base de datos
  // Aquí obtén el valor de Acumulado y Pago de la base de datos,
  // dependiendo de la lógica de tu aplicación

  // Inserta los valores en la base de datos
  // Debes usar el código SQL adecuado para insertar los valores en la tabla JA_Medida

  // Ejemplo de inserción en SQL Server:
  const values = {
    Anio,
    Mes,
    idCliente,
    LecturaAnterior,
    LecturaActual,
    Excedente,
    Basico,
    ExcedenteV,
    Total,
    // Acumulado: Saldo,
    Pago,
  };

  return {
    Anio,
    Mes,
    LecturaAnterior,
    LecturaActual,
    idCliente,
    Excedente,
    Basico,
    ExcedenteV,
    Total,
  };
};


const addInterestIfUnpaid = async (Anio, Mes) => {
  try {
    // Obtén la lista de clientes que tienen saldo pendiente en el mes seleccionado
    const unpaidClients = await dbConnection.query(
      'SELECT DISTINCT idCliente FROM JA_Medida WHERE Anio = :Anio AND Mes = :Mes AND Cancelada = 0 AND Saldo > 0',
      {
        replacements: { Anio, Mes },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Define la tasa de interés que deseas aplicar
    const tasaInteres = 0.05; // Por ejemplo, 5% de interés

    // Itera sobre la lista de clientes con saldo pendiente
    for (const cliente of unpaidClients) {
      const { idCliente } = cliente;

      // Obtén la medida más reciente de ese cliente en el mes seleccionado
      const medidaCliente = await dbConnection.query(
        'SELECT TOP 1 * FROM JA_Medida WHERE Anio = :Anio AND Mes = :Mes AND idCliente = :idCliente ORDER BY LecturaActual DESC',
        {
          replacements: { Anio, Mes, idCliente },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (medidaCliente.length > 0) {
        const { Saldo, Total } = medidaCliente[0];

        // Calcula el interés a agregar al saldo pendiente
        const interes = Saldo * tasaInteres;

        // Actualiza el saldo y el total con el interés agregado
        const nuevoSaldo = Saldo + interes;
        const nuevoTotal = Total + interes;

        // Actualiza la medida en la base de datos con el nuevo saldo y total
        await dbConnection.query(
          'UPDATE JA_Medida SET Saldo = :nuevoSaldo, Total = :nuevoTotal WHERE idMedida = :idMedida',
          {
            replacements: {
              nuevoSaldo,
              nuevoTotal,
              idMedida: medidaCliente[0].idMedida, // Debes obtener el ID de la medida correspondiente
            },
            type: sequelize.QueryTypes.UPDATE,
          }
        );

        consoleHelper.success(`Interés agregado al cliente ${idCliente} para el mes ${Mes}/${Anio}`);
      }
    }
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const addInterestIfUnpaidV2 = async (Anio, Mes) => {
  try {
    // Obtén la lista de clientes que tienen saldo pendiente en el mes seleccionado
    const unpaidClients = await dbConnection.query(
      'SELECT DISTINCT idCliente FROM JA_Medida WHERE Anio = :Anio AND Mes = :Mes AND Cancelada = 0 AND Saldo > 0',
      {
        replacements: { Anio, Mes },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Define la tasa de interés que deseas aplicar
    const tasaInteres = 0.05; // Por ejemplo, 5% de interés

    // Itera sobre la lista de clientes con saldo pendiente
    for (const cliente of unpaidClients) {
      const { idCliente } = cliente;

      // Obtén la medida más reciente de ese cliente en el mes seleccionado
      const medidaCliente = await dbConnection.query(
        'SELECT TOP 1 * FROM JA_Medida WHERE Anio = :Anio AND Mes = :Mes AND idCliente = :idCliente ORDER BY LecturaActual DESC',
        {
          replacements: { Anio, Mes, idCliente },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (medidaCliente.length > 0) {
        const { Saldo, Total, idMedida } = medidaCliente[0];

        // Calcula el interés a agregar al saldo pendiente
        const interes = Saldo * tasaInteres;

        // Actualiza la medida en la base de datos con el nuevo saldo y total
        const nuevoSaldo = Saldo + interes;
        const nuevoTotal = Total + interes;

        // Inserta un registro en la tabla RegistroIntereses
        await dbConnection.query(
          'INSERT INTO RegistroIntereses (idMedida, FechaInteres, TasaInteres, InteresAplicado) VALUES (:idMedida, GETDATE(), :tasaInteres, :interes)',
          {
            replacements: {
              idMedida,
              tasaInteres,
              interes,
            },
            type: sequelize.QueryTypes.INSERT,
          }
        );

        consoleHelper.success(`Interés agregado al cliente ${idCliente} para el mes ${Mes}/${Anio}`);
      }
    }
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};



module.exports = {
  getMeasurements,
  getMeasurementsByMonthAndYear,
  updateMeasurement,
};
