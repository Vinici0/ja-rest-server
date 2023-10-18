const calculateAndUpdateMedidas = async (
  medidas,
  INTERES_BASE,
  dbConnection,
  sequelize
) => {
  let interestFactor = 0.0; // Factor de interés inicial
  for (let i = 1; i < medidas.length; i++) {
    const monthsDifference =
      (medidas[i - 1].Anio - medidas[i].Anio) * 12 +
      (medidas[i - 1].Mes - medidas[i].Mes);

    if (monthsDifference > 0) {
      let ExcedenteNew = medidas[i].LecturaActual - medidas[i].LecturaAnterior;
      let ExcedenteVNew = 0;

      if (ExcedenteNew >= 0 && ExcedenteNew <= 15) {
        ExcedenteNew = 0;
        ExcedenteVNew = 0;
      } else if (ExcedenteNew >= 16 && ExcedenteNew <= 39) {
        ExcedenteNew = ExcedenteNew - 15;
        ExcedenteVNew = 0.25 * ExcedenteNew;
      } else if (ExcedenteNew >= 40 && ExcedenteNew <= 49) {
        ExcedenteNew = ExcedenteNew - 15;
        ExcedenteVNew = 0.5 * ExcedenteNew;
      } else if (ExcedenteNew >= 50) {
        ExcedenteNew = ExcedenteNew - 15;
        ExcedenteVNew = 1 * ExcedenteNew;
      }
      let interesIncrement = 0;
      if (interestFactor === 0) {
        interesIncrement = 0.05;
      } else {
        interesIncrement = INTERES_BASE + interestFactor;
      }

      let totalExcedente = medidas[i].Basico + ExcedenteVNew;
      let interes = totalExcedente * interesIncrement;
      medidas[i].Total = (totalExcedente + interes).toFixed(2);
      medidas[i].Saldo = (totalExcedente + interes).toFixed(2);

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

      interestFactor += 0.01;
    }
  }
};

module.exports = {
  calculateAndUpdateMedidas,
};
