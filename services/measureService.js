const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const Console = require("../helpers/console");
const { calculateAndUpdateMedidas } = require("../helpers/measure-calculate");
const consoleHelper = new Console("Measure Service");

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
    const ja_tabla = await dbConnection.query(
      `SELECT * FROM JA_Tabla ORDER BY idTabla`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const interes = await dbConnection.query(
      `SELECT * FROM JA_Interes ORDER BY idInteres DESC`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    let INTERES_BASE = interes[0].interes / 100;
    let interestFactor = 0.0; // Factor de interés inicial
    //si lectura actual es menor a la anterior no se puede guardar
    if (LecturaActual < LecturaAnterior) {
      throw new Error("La lectura actual no puede ser menor a la anterior");
    }

    //TODO: CAMBIO DE MEDIDOR: En caso ingresar un medidor nuevo que traiga los datos

    let Excedente = LecturaActual - LecturaAnterior;
    let ExcedenteV = 0;

    if (Excedente >= ja_tabla[0].Desde && Excedente <= ja_tabla[0].Hasta) {
      Excedente = 0;
      ExcedenteV = 0;
    } else if (
      Excedente >= ja_tabla[1].Desde &&
      Excedente <= ja_tabla[1].Hasta
    ) {
      Excedente = Excedente - 15;
      ExcedenteV = ja_tabla[1].ValorExc * Excedente;
    } else if (
      Excedente >= ja_tabla[2].Desde &&
      Excedente <= ja_tabla[2].Hasta
    ) {
      Excedente = Excedente - 15;
      ExcedenteV = ja_tabla[2].ValorExc * Excedente;
    } else if (Excedente >= ja_tabla[3].Desde) {
      Excedente = Excedente - 15;
      ExcedenteV = ja_tabla[3].ValorExc * Excedente;
    }

    const Total = Basico + ExcedenteV;
    const Pago = 0;

    //TODO: Corregir la parte del mes

    let Alcantarillado = 3;
    const EditarMedida = await dbConnection.query(
      `UPDATE JA_Medida SET LecturaActual = :LecturaActual, Excedente = :Excedente, ExcedenteV = :ExcedenteV, Total = :Total, Pago = :Pago, Saldo = :Saldo, Alcantarillado = :Alcantarillado WHERE idMedida = :idMedida`,
      {
        replacements: {
          LecturaActual,
          Excedente,
          ExcedenteV,
          Total: Total,
          Pago,
          Saldo: Total + Alcantarillado,
          Alcantarillado: Alcantarillado,
          idMedida: idMedida,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (EditarMedida[1] === 0) {
      throw new Error("No se encontró la medida");
    }

    //traer todas las medidas del cliente deode saldos sean mayores a 0
    const medidas = await dbConnection.query(
      `SELECT * FROM JA_Medida WHERE Codigo = :Codigo AND Saldo > 0 ORDER BY Anio DESC, Mes DESC`,
      {
        replacements: { Codigo: Codigo },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (medidas.length === 0) {
      throw new Error("No se encontró la medida anterior");
    }

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

    await calculateAndUpdateMedidas(
      medidas,
      INTERES_BASE,
      dbConnection,
      sequelize,
      ja_tabla
    );

    await calculateAndUpdateMedidasAcumulado(Codigo);

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
      Saldo: Total,
    };
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const calculateAndUpdateMedidasAcumulado = async (Codigo) => {
  // Iniciar una transacción
  const transaction = await dbConnection.transaction();

  try {
    const medidas = await dbConnection.query(
      `SELECT * FROM JA_Medida WHERE Codigo = :Codigo AND Saldo > 0 ORDER BY Anio , Mes `,
      {
        replacements: { Codigo },
        type: sequelize.QueryTypes.SELECT,
        transaction, // asegúrate de pasar la transacción a cada consulta
      }
    );

    let acumulado = 0;

    for (const medida of medidas) {
      acumulado += medida.Saldo; // Suma el saldo al acumulado.

      // Actualiza el acumulado para cada medida.
      await dbConnection.query(
        `UPDATE JA_Medida SET Acumulado = :Acumulado WHERE idMedida = :idMedida`,
        {
          replacements: {
            Acumulado: acumulado,
            idMedida: medida.idMedida,
          },
          type: sequelize.QueryTypes.UPDATE,
          transaction, // asegúrate de pasar la transacción a cada consulta
        }
      );
    }

    // Si todo fue bien, realiza los cambios en la base de datos.
    await transaction.commit();
  } catch (error) {
    // Si algo falla, deshace cualquier cambio en la base de datos.
    await transaction.rollback();
    throw error; // Luego lanza el error para manejarlo más arriba en la pila de llamadas.
  }
};

const updateAllMeasurements = async () => {
  const ja_tabla = await dbConnection.query(
    `SELECT * FROM JA_Tabla ORDER BY idTabla`,
    {
      type: sequelize.QueryTypes.SELECT,
    }
  );

  const interes = await dbConnection.query(
    `SELECT * FROM JA_Interes ORDER BY idInteres DESC`,
    {
      type: sequelize.QueryTypes.SELECT,
    }
  );
  let INTERES_BASE = interes[0].interes / 100;

  const getAllMedidas = await dbConnection.query(
    `SELECT codigo
    FROM JA_Medida 
    WHERE Saldo > 0 
    group by codigo
    having count(*)>1`,
    {
      type: sequelize.QueryTypes.SELECT,
    }
  );

  for (const medida of getAllMedidas) {
    const { codigo } = medida;

    const getAllMedidasByCodigo = await dbConnection.query(
      `SELECT * FROM JA_Medida WHERE Codigo = :Codigo AND Saldo > 0 ORDER BY Anio DESC, Mes DESC`,
      {
        replacements: { Codigo: codigo },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    getAllMedidasByCodigo.sort((a, b) => {
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

    //aqui no es
    await calculateAndUpdateMedidas(
      getAllMedidasByCodigo,
      INTERES_BASE,
      dbConnection,
      sequelize,
      ja_tabla
    );

    // for (const medida of getAllMedidasByCodigo) {
    //   console.log("ingreasndo");
    //  await  calculateAndUpdateMedidasAcumulado(medida.Codigo);
    // }
  }

  return {
    message: "Medidas actualizadas correctamente",
  };
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

// EXEC ActualizarLecturaActualParaTodos @Anio = 2023, @Mes = 11
const updateMeasurementForAll = async (Anio, Mes) => {
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
    const meters = await dbConnection.query("EXEC JA_Corte", {
      type: sequelize.QueryTypes.SELECT,
    });
    consoleHelper.success("Medida obtenida correctamente");
    return meters;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const createMeusereAndUpdateCustomer = async (data) => {
  try {
    await dbConnection.query(
      `UPDATE Cliente SET JA_LoteVacio = :JA_LoteVacio, Codigo = :Codigo WHERE idCliente = :idCliente`,
      {
        replacements: {
          JA_LoteVacio: data.JA_LoteVacio,
          Codigo: data.codigo,
          idCliente: data.idCliente,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    // TODO: No esta generado
    await dbConnection.query(
      `EXEC JA_Genera @anio = :anio, @mes=:mes, @idCliente=:idCliente`,
      {
        replacements: {
          anio: data.Anio,
          mes: data.Mes,
          idCliente: data.idCliente,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    //actualicar   ja_medida lote, manzana,
    await dbConnection.query(
      `UPDATE JA_Medida SET Lote = :Lote, Manzana = :Manzana WHERE Codigo = :Codigo`,
      {
        replacements: {
          Lote: data.lote,
          Manzana: data.manzana,
          Codigo: data.codigo,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    await dbConnection.query(
      `EXEC JA_Calculo @anio = :anio, @mes=:mes, @idCliente=:idCliente`,
      {
        replacements: {
          anio: data.Anio,
          mes: data.Mes,
          idCliente: data.idCliente,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    return {
      message: "Medidas actualizadas correctamente",
    };
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getMeasureById = async (id) => {
  try {
    const measure = await dbConnection.query(
      "SELECT * FROM JA_Medida WHERE idMedida = :idMedida",
      {
        replacements: { idMedida: id },
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

const updateMeauseAndCustomer = async (data) => {
  try {
    await dbConnection.query(
      `UPDATE JA_Medida SET Lote = :Lote, Manzana = :Manzana WHERE Codigo = :Codigo`,
      {
        replacements: {
          Lote: data.lote,
          Manzana: data.manzana,
          Codigo: data.codigo,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    await dbConnection.query(
      `UPDATE Cliente SET JA_LoteVacio = :JA_LoteVacio WHERE idCliente = :idCliente`,
      {
        replacements: {
          JA_LoteVacio: data.JA_LoteVacio,
          idCliente: data.idCliente,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    // await dbConnection.query(`EXEC JA_Calculo @anio = :anio, @mes=:mes`, {
    //   replacements: {
    //     anio: data.Anio,
    //     mes: data.Mes,
    //   },
    //   type: sequelize.QueryTypes.UPDATE,
    // });

    return {
      message: "Medidas actualizadas correctamente",
    };
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const generaAndCalculo = async (Anio, Mes) => {
  try {
    //verificar si ya esta generado las medidas en el mes y año
    console.log(Anio, Mes);
    const medidas = await dbConnection.query(
      `SELECT * FROM JA_Medida WHERE Anio = :Anio AND Mes = :Mes`,
      {
        replacements: {
          Anio,
          Mes,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (medidas.length > 100) {
      console.log("Ya se generaron las medidas para el mes y año seleccionado");
      throw new Error(
        "Ya se generaron las medidas para el mes y año seleccionado"
      );
    } else {
      console.log("Generando medidas");
      await dbConnection.query(`EXEC JA_Genera @anio = :anio, @mes=:mes`, {
        replacements: {
          anio: Anio,
          mes: Mes,
        },
        type: sequelize.QueryTypes.SELECT,
      });

      await dbConnection.query(`EXEC JA_Calculo @anio = :anio, @mes=:mes`, {
        replacements: {
          anio: Anio,
          mes: Mes,
        },
        type: sequelize.QueryTypes.SELECT,
      });

      return {
        message: "Medidas actualizadas correctamente" + Anio + Mes,
      };
    }
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
  updateAllMeasurements,
  createMeusereAndUpdateCustomer,
  getMeasureById,
  updateMeauseAndCustomer,
  generaAndCalculo,
};
