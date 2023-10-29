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
      let ExcedenteNew = medidas[i].LecturaActual - medidas[i].LecturaAnterior;
      let ExcedenteVNew = 0;

      if (
        ExcedenteNew >= ja_tabla[0].Desde &&
        ExcedenteNew <= ja_tabla[0].Hasta
      ) {
        ExcedenteNew = 0;
        ExcedenteVNew = 0;
      } else if (
        ExcedenteNew >= ja_tabla[1].Desde &&
        ExcedenteNew <= ja_tabla[1].Hasta
      ) {
        ExcedenteNew = ExcedenteNew - 15;
        ExcedenteVNew = ja_tabla[1].ValorExc * ExcedenteNew;
      } else if (
        ExcedenteNew >= ja_tabla[2].Desde &&
        ExcedenteNew <= ja_tabla[2].Hasta
      ) {
        ExcedenteNew = ExcedenteNew - 15;
        ExcedenteVNew = ja_tabla[2].ValorExc * ExcedenteNew;
      } else if (ExcedenteNew >= ja_tabla[3].Desde) {
        ExcedenteNew = ExcedenteNew - 15;
        ExcedenteVNew = ja_tabla[3].ValorExc * ExcedenteNew;
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
        interestMultiplier++; // Incrementar el multiplicador de interés por cada iteración
        interesIncrement = INTERES_BASE * interestMultiplier;
      }

      let totalExcedente = medidas[i].Basico + ExcedenteVNew;
      let interes = totalExcedente * interesIncrement;
      let interesAlcantarillado = alcantarillado * interesIncrement;
      console.log(interesIncrement,"interesIncrement");
      console.log("---------------------------------------------------------------------------------------");
      console.log(interesAlcantarillado, "interesAlcantarillado");

      medidas[i].Total = (totalExcedente + interes).toFixed(2);
      medidas[i].Saldo = (totalExcedente + interes).toFixed(2);

      medidas[i].Alcantarillado = (totalExcedente + interesAlcantarillado).toFixed(2);
      // console.log("console.log(medidas[i].Alcantarillado);");
      // console.log(medidas[i].Alcantarillado);

      await dbConnection.query(
        `UPDATE JA_Medida SET Total = :Total, Saldo = :Saldo WHERE idMedida = :idMedida`,
        {
          replacements: {
            Total: medidas[i].Total,
            Saldo: medidas[i].Saldo,
            idMedida: medidas[i].idMedida,
          },
          type: sequelize.QueryTypes.UPDATE,
        }
      );
    }
  }
};

module.exports = {
  calculateAndUpdateMedidas,
};
