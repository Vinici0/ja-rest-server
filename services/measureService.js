const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const Console = require("../helpers/console");
const consoleHelper = new Console("User Service");

const getMeasurements = async () => {
  try {
    const measure = await dbConnection.query(
      "EXEC ObtenerMedidasPorMesYAnio @Anio = 2023, @Mes = 8",
      {
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
  Basico,
  Codigo,
  idCliente,
  idMedida,
  LecturaActual,
  LecturaAnterior,
  Mes
) => {
  try {
    const INTERES_BASE = 0.05;
    let interestFactor = 0.0; // Factor de interés inicial
    //si lectura actual es menor a la anterior no se puede guardar
    if (LecturaActual < LecturaAnterior) {
      throw new Error("La lectura actual no puede ser menor a la anterior");
    }
    let Excedente = LecturaActual - LecturaAnterior;
    let ExcedenteV = 0;

    if (Excedente >= 0 && Excedente <= 15) {
      Excedente = 0;
      ExcedenteV = 0;
    } else if (Excedente >= 16 && Excedente <= 39) {
      Excedente = Excedente - 15;
      ExcedenteV = 0.25 * Excedente;
    } else if (Excedente >= 40 && Excedente <= 49) {
      Excedente = Excedente - 15;
      ExcedenteV = 0.5 * Excedente;
    } else if (Excedente >= 50) {
      Excedente = Excedente - 15;
      ExcedenteV = 1 * Excedente;
    }

    const Total = Basico + ExcedenteV;
    const Pago = 0;

    const medida = await dbConnection.query(
      `EXEC BuscarMedidaPorAnioMesCliente @Anio = :Anio, @Mes = :Mes, @Codigo = :Codigo`,
      {
        replacements: { Anio, Mes: Mes - 1, Codigo },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    //TODO: Resolver el problema de la medida anterior cuando es el primer mes del Anio
    if (medida.length === 0) {
      throw new Error("No se encontró la medida anterior");
    }

    const EditarMedida = await dbConnection.query(
      `UPDATE JA_Medida SET LecturaActual = :LecturaActual, Excedente = :Excedente, Basico = :Basico, ExcedenteV = :ExcedenteV, Total = :Total, Acumulado = :Acumulado, Pago = :Pago, Saldo = :Saldo WHERE idMedida = :idMedida`,
      {
        replacements: {
          LecturaActual,
          Excedente,
          Basico: medida[0].Basico,
          ExcedenteV,
          Total,
          Acumulado: medida[0].Acumulado + Total,
          Pago,
          Saldo: Total,
          idMedida: idMedida,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    //traer todas las medidas del cliente deode saldos sean mayores a 0
    const medidas = await dbConnection.query(
      `SELECT * FROM JA_Medida WHERE Codigo = :Codigo AND Saldo > 0 ORDER BY Mes DESC`,
      {
        replacements: { Codigo: Codigo },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log(medidas);

    // Ordenar por Anio y mes en JavaScript
    medidas.sort((a, b) => {
      if (a.Anio < b.Anio) {
        return 1;
      }
      if (a.Anio > b.Anio) {
        return -1;
      }
      // Si los Anios son iguales, ordenar por Mes
      if (a.Mes < b.Mes) {
        return 1;
      }
      if (a.Mes > b.Mes) {
        return -1;
      }
      return 0;
    });

    let accumulatedInterest = 0; // Inicializar el interés acumulado

    for (let i = 1; i < medidas.length; i++) {
      const monthsDifference =
        (medidas[i - 1].Anio - medidas[i].Anio) * 12 +
        (medidas[i - 1].Mes - medidas[i].Mes);

      if (monthsDifference > 0) {
        let Excedente = medidas[i].LecturaActual - medidas[i].LecturaAnterior;
        let ExcedenteV = 0;

        if (Excedente >= 0 && Excedente <= 15) {
          Excedente = 0;
          ExcedenteV = 0;
        } else if (Excedente >= 16 && Excedente <= 39) {
          Excedente = Excedente - 15;
          ExcedenteV = 0.25 * Excedente;
        } else if (Excedente >= 40 && Excedente <= 49) {
          Excedente = Excedente - 15;
          ExcedenteV = 0.5 * Excedente;
        } else if (Excedente >= 50) {
          Excedente = Excedente - 15;
          ExcedenteV = 1 * Excedente;
        }
        let interesIncremtent = 0;
        if (interestFactor === 0) {
          interesIncremtent = 0.05;
        } else {
          interesIncremtent = INTERES_BASE + interestFactor;
        }

        let totalExcedente = medidas[i].Total + ExcedenteV; // Total más excedente
        let interest = interesIncremento * totalExcedente; // Cálculo del interés
        accumulatedInterest += interest; // Acumulación del interés
        
        medidas[i].Total += accumulatedInterest; // Actualización del total con el interés acumulado
        medidas[i].Saldo = medidas[i].Total; // Actualización del saldo con el nuevo total
        
        medidas[i].Total = Number(medidas[i].Total.toFixed(2)); // Redondeo del total
        accumulatedInterest = Number(accumulatedInterest.toFixed(2)); // Redondeo del interés acumulado
        medidas[i].Saldo = Number(medidas[i].Saldo.toFixed(2)); // Redondeo del saldo
        
        console.log(
          "medidas[i].Total",
          medidas[i].Total,
          "interest",
          interest,
          "medidas[i].Saldo",
          medidas[i].Saldo,
          "MES " + medidas[i].Mes,
          "ANIO " + medidas[i].Anio,
          "interestFactor",
          interestFactor
        );
        
        interestFactor += 0.01; // Incremento del factor de interés en 1%
      }
    }

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
      Acumulado: medida[0].Acumulado + Total,
      Saldo: Total,
    };
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const addInterestIfUnpaid = async (Anio, Mes) => {
  try {
    // Obtén la lista de clientes que tienen saldo pendiente en el mes seleccionado
    const unpaidClients = await dbConnection.query(
      "SELECT DISTINCT idCliente FROM JA_Medida WHERE Anio = :Anio AND Mes = :Mes AND Cancelada = 0 AND Saldo > 0",
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
        "SELECT TOP 1 * FROM JA_Medida WHERE Anio = :Anio AND Mes = :Mes AND idCliente = :idCliente ORDER BY LecturaActual DESC",
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
          "UPDATE JA_Medida SET Saldo = :nuevoSaldo, Total = :nuevoTotal WHERE idMedida = :idMedida",
          {
            replacements: {
              nuevoSaldo,
              nuevoTotal,
              idMedida: medidaCliente[0].idMedida, // Debes obtener el ID de la medida correspondiente
            },
            type: sequelize.QueryTypes.UPDATE,
          }
        );

        consoleHelper.success(
          `Interés agregado al cliente ${idCliente} para el mes ${Mes}/${Anio}`
        );
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
      "SELECT DISTINCT idCliente FROM JA_Medida WHERE Anio = :Anio AND Mes = :Mes AND Cancelada = 0 AND Saldo > 0",
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
        "SELECT TOP 1 * FROM JA_Medida WHERE Anio = :Anio AND Mes = :Mes AND idCliente = :idCliente ORDER BY LecturaActual DESC",
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
          "INSERT INTO RegistroIntereses (idMedida, FechaInteres, TasaInteres, InteresAplicado) VALUES (:idMedida, GETDATE(), :tasaInteres, :interes)",
          {
            replacements: {
              idMedida,
              tasaInteres,
              interes,
            },
            type: sequelize.QueryTypes.INSERT,
          }
        );

        consoleHelper.success(
          `Interés agregado al cliente ${idCliente} para el mes ${Mes}/${Anio}`
        );
      }
    }
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

// EXEC ActualizarLecturaActualParaTodos @Anio = 2023, @Mes = 11
const updateMeasurementForAll = async (Anio, Mes) => {
  console.log("Anio", Anio);
  console.log("Mes", Mes);
  try {
    const measure = await dbConnection.query(
      `EXEC ActualizarLecturaActualParaTodos @Anio = :Anio, @Mes = :Mes`,
      {
        replacements: { Anio, Mes },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    consoleHelper.success("Medida actualizada correctamente");
    return measure;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const calculoIntrest = async (Anio, Codigo, InteresPorMora) => {
  try {
    const registros = await dbConnection.query(
      `EXEC ObtenerRegistrosPorSaldoMayorACero @Anio = :Anio, @Codigo = :Codigo`,
      {
        replacements: { Anio, Codigo },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    console.log(registros);
    const calcularInteresPorMora = (registro, interesPorMora) => {
      const mesActual = 12; // Mes actual
      const mesesAtraso = mesActual - registro.Mes;
      const tasaBase = interesPorMora / 100;
      const porcentajeInteres = tasaBase + mesesAtraso * 0.01;
      return `${porcentajeInteres * 100}%`; // Devuelve el porcentaje de interés
    };

    registros.forEach((registro, index) => {
      registros[index].InteresPorMora = calcularInteresPorMora(
        registro,
        InteresPorMora
      );
    });

    consoleHelper.success("Medida actualizada correctamente");
    return registros;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const execCorte = async () => {
  try {
    const meters = await dbConnection.query("EXEC ja_corte", {
      type: sequelize.QueryTypes.SELECT,
    });
    consoleHelper.success("Medida obtenida correctamente");
    return meters;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

module.exports = {
  execCorte,
  getMeasurements,
  getMeasurementsByMonthAndYear,
  updateMeasurement,
  updateMeasurementForAll,
  calculoIntrest,
};
