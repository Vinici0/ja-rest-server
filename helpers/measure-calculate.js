const calculateAndUpdateMedidas = async (
  medidas,
  INTERES_BASE,
  dbConnection,
  sequelize,
  ja_tabla = [],
  alcantarillado = 3
) => {
  let interestMultiplier = 1;
  for (let i = 1; i < medidas.length; i++) {
    const monthsDifference =
      (medidas[i - 1].Anio - medidas[i].Anio) * 12 +
      (medidas[i - 1].Mes - medidas[i].Mes);

    if (monthsDifference > 0) {
      const ExcedenteNew =
        medidas[i].LecturaActual - medidas[i].LecturaAnterior;
      let ExcedenteVNew = 0;

      if (
        ExcedenteNew >= ja_tabla[0].Desde &&
        ExcedenteNew <= ja_tabla[0].Hasta
      ) {
        ExcedenteVNew = 0;
      } else if (
        ExcedenteNew >= ja_tabla[1].Desde &&
        ExcedenteNew <= ja_tabla[1].Hasta
      ) {
        ExcedenteVNew = ja_tabla[1].ValorExc * (ExcedenteNew - 15);
      } else if (
        ExcedenteNew >= ja_tabla[2].Desde &&
        ExcedenteNew <= ja_tabla[2].Hasta
      ) {
        ExcedenteVNew = ja_tabla[2].ValorExc * (ExcedenteNew - 15);
      } else if (ExcedenteNew >= ja_tabla[3].Desde) {
        ExcedenteVNew = ja_tabla[3].ValorExc * (ExcedenteNew - 15);
      }

      let interesIncrement = 0;
      if (INTERES_BASE === 0) {
        // No se cobra interés si INTERES_BASE es 0
        interesIncrement = 0;
      } else if (i === 1) {
        // No se cobra interés para la segunda medida
        interesIncrement = INTERES_BASE;
      } else if (i >= 2) {
        // Cálculo del interés basado en el múltiplo de INTERES_BASE
        interestMultiplier++;
        interesIncrement = INTERES_BASE * interestMultiplier;
      }

      //Medidas
      const totalExcedente = medidas[i].Basico + ExcedenteVNew;
      const interes = totalExcedente * interesIncrement;
      const calculoAlcantarillado = medidas[i].Basico === 2.75 ? 1.5 : 3.0;
      // Alcantarillado
      const interesAlcantarillado = calculoAlcantarillado * interesIncrement;
      const totalAlcantarillado = (
        interesAlcantarillado + calculoAlcantarillado
      ).toFixed(2);

      medidas[i].Total = (totalExcedente + interes).toFixed(2);
      medidas[i].Saldo = (totalExcedente + interes).toFixed(2);

      const totalSaldo = Number(medidas[i].Saldo) + Number(totalAlcantarillado);

      //TODO: Agergar el alcantarillado a la medida y actualizar la medida
      const ja_medidaQuery = await dbConnection.query(
        `UPDATE JA_Medida SET Total = :Total, Saldo = :Saldo , Alcantarillado = :Alcantarillado
         WHERE idMedida = :idMedida`,
        {
          replacements: {
            Total: medidas[i].Total,
            Saldo: totalSaldo,
            idMedida: medidas[i].idMedida,
            Alcantarillado: totalAlcantarillado,
          },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      if (ja_medidaQuery[1] === 0) {
        throw new Error("No se pudo actualizar la medida");
      }
    }
  }
};

const calculateMeasurementValues = async (
  LecturaActual,
  LecturaAnterior,
  Basico,
  ja_tabla,
) => {
  if (LecturaActual < LecturaAnterior) {
    throw new Error("La lectura actual no puede ser menor a la anterior");
  }

  let Excedente = LecturaActual - LecturaAnterior;
  let ExcedenteV = 0;

  if (Excedente >= ja_tabla[0].Desde && Excedente <= ja_tabla[0].Hasta) {
    Excedente = 0;
    ExcedenteV = 0;
  } else if (Excedente >= ja_tabla[1].Desde && Excedente <= ja_tabla[1].Hasta) {
    Excedente = Excedente - 15;
    ExcedenteV = ja_tabla[1].ValorExc * Excedente;
  } else if (Excedente >= ja_tabla[2].Desde && Excedente <= ja_tabla[2].Hasta) {
    Excedente = Excedente - 15;
    ExcedenteV = ja_tabla[2].ValorExc * Excedente;
  } else if (Excedente >= ja_tabla[3].Desde) {
    Excedente = Excedente - 15;
    ExcedenteV = ja_tabla[3].ValorExc * Excedente;
  }

  const Total = Basico + ExcedenteV;
  const Pago = 0;

  let Alcantarillado = Basico === 2.75 ? 1.5 : 3.0;

  return { Excedente, ExcedenteV, Total, Alcantarillado, Pago };
};

const updateMeasurementInDatabase = async (
  idMedida,
  LecturaActual,
  valuesToUpdate,
  dbConnection,
  sequelize
) => {
  const { Excedente, ExcedenteV, Total, Pago, Alcantarillado } = valuesToUpdate;

  const result = await dbConnection.query(
    `UPDATE JA_Medida SET LecturaActual = :LecturaActual, Excedente = :Excedente, ExcedenteV = :ExcedenteV, Total = :Total, Pago = :Pago, Saldo = :Saldo, Alcantarillado = :Alcantarillado WHERE idMedida = :idMedida`,
    {
      replacements: {
        LecturaActual,
        Excedente,
        ExcedenteV,
        Total,
        Pago,
        Saldo: Total + Alcantarillado,
        Alcantarillado,
        idMedida,
      },
      type: sequelize.QueryTypes.UPDATE,
    }
  );

  if (result[1] === 0) {
    throw new Error("No se encontró la medida");
  }
};
module.exports = {
  calculateAndUpdateMedidas,
  calculateMeasurementValues,
  updateMeasurementInDatabase,
};
