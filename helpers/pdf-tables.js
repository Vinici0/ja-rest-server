const MAX_ROWS = 4;

const generateTableClienteOne = async (
  doc,
  data,
  INTERES_BASE,
  multas = [],
  ja_tabla = []
) => {
  try {
    let INTERES = INTERES_BASE;
    let interesIcrement = 0;

    let tableTop = 180;
    const titleTableX = 50;
    const fechaX = 50;
    const lecturaAnteriorX = 110;
    const lecturaActualX = 190;
    const consumoX = 265;
    const subTotalX = 335; //335
    const alcantarilladoX = 395;
    const interesX = 445;
    const totalX = 500;

    const titleFontSize = 16;
    const rowFontSize = 10;
    const fontBold = "Helvetica-Bold";
    const fontRegular = "Helvetica";

    doc
      .font(fontBold)
      .fontSize(titleFontSize)
      .text("Consumo de Agua", titleTableX, 150);
    doc.moveTo(titleTableX, 170).lineTo(550, 170).stroke();

    doc
      .fontSize(rowFontSize)
      .font(fontBold)
      .text("Fecha", fechaX, tableTop)
      .text("Lec. Anterior", lecturaAnteriorX, tableTop)
      .text("Lec. Actual", lecturaActualX, tableTop)
      .text("Consumo", consumoX, tableTop)
      .text("Interes", interesX, tableTop)
      .text("Agua", subTotalX, tableTop)
      .text("Alc.", alcantarilladoX, tableTop)
      .text("Total", totalX, tableTop);

    doc.moveTo(titleTableX, 195).lineTo(550, 195).stroke();

    let rowData = data;
    let currentRow = tableTop + 18;
    let total = 0;
    let totalAgua = 0;
    let indexMultiplo = 2;
    let totalAlacantarillado = 0;
    let basico = 0;
    if (rowData.length !== 0) {
      for (let i = 0; i < rowData.length && i < MAX_ROWS; i++) {
        let ExcedenteNew =
          rowData[i].LecturaActual - rowData[i].LecturaAnterior;
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

        doc
          .font(fontRegular)
          .fontSize(rowFontSize)
          .text(rowData[i].Mes + "/" + rowData[i].Anio, fechaX, currentRow)
          .text(rowData[i].LecturaAnterior, lecturaAnteriorX, currentRow)
          .text(rowData[i].LecturaActual, lecturaActualX, currentRow)
          .text(
            rowData[i].LecturaActual - rowData[i].LecturaAnterior,
            consumoX,
            currentRow
          );

        if (INTERES_BASE === 0) {
          interesIcrement = 0;
        } else if (i === 0) {
          interesIcrement = 0;
        } else if (i === 1) {
          interesIcrement = INTERES_BASE;
        } else {
          // interesIcrement = INTERES_BASE * indexMultiplo;
          // INTERES = interesIcrement;
          // indexMultiplo = interesIcrement;
          interesIcrement = INTERES_BASE * indexMultiplo;
          indexMultiplo++;
        }

        doc
          .text(
            (interesIcrement * 100).toFixed(0) + "%",
            interesX,
            currentRow
          ) /* Aqui va el subTotal */
          .text(
            "$" + Number(rowData[i].Alcantarillado).toFixed(2),
            alcantarilladoX,
            currentRow
          )
          .text(
            "$" + (rowData[i].Basico + ExcedenteVNew).toFixed(2),
            subTotalX,
            currentRow
          )

          .text("$" + rowData[i].Saldo.toFixed(2), totalX, currentRow);
        total += rowData[i].Saldo;
        totalAgua += rowData[i].Total;
        totalAlacantarillado += rowData[i].Alcantarillado;
        currentRow += 15;
        basico = rowData[i].Basico;
      }
    }

    currentRow = currentRow - 5;

    const fontSizeDetaller = 10;
    const detallex = 300;
    const detallerValue = 400;
    const DETALLE_TEXT = "AGUA:";
    const SANAMIENTO_TEXT = `SERVICIO DE SANAMIENTO (${rowData.length}):`;
    const MULTA_TEXT = `TOTAL MULTAS (${multas.length}):`;
    const DETALLE_POSITION_Y = currentRow + 15;
    const SANAMIENTO_POSITION_Y = currentRow + 30;
    const MULTA_POSITION_Y = currentRow + 45;

    let totalSanamiento =
      basico === 5.5 / 2
        ? (1.5 * rowData.length).toFixed(2)
        : (rowData.length * 3.0).toFixed(2);

    const totalMultas = multas
      .map((multa) => multa.valor_pagar)
      .reduce((a, b) => a + b, 0)
      .toFixed(2);

    doc
      .fontSize(fontSizeDetaller)
      .text(DETALLE_TEXT, detallex, DETALLE_POSITION_Y)
      //redondear a dos decimales
      .text("$" + totalAgua.toFixed(2), detallerValue + 100, DETALLE_POSITION_Y)
      .text(SANAMIENTO_TEXT, detallex, SANAMIENTO_POSITION_Y)
      .text(
        `$${totalAlacantarillado.toFixed(2)}`,

        detallerValue + 100,
        SANAMIENTO_POSITION_Y
      )
      .text(MULTA_TEXT, detallex, MULTA_POSITION_Y)
      .text("$" + totalMultas, detallerValue + 100, MULTA_POSITION_Y);

    // Agregar el cuadro de texto
    const cuadroX = detallex - 10;
    const cuadroY = currentRow + 60;
    const cuadroWidth = 250; // Ajuste el ancho según su necesidad
    const cuadroHeight = 20;
    doc.rect(cuadroX, cuadroY, cuadroWidth, cuadroHeight).stroke();

    const textoCuadroX = cuadroX + 10;
    const textoCuadroY = cuadroY + 5;

    const totalValue = (
      parseFloat(totalAgua) +
      parseFloat(totalAlacantarillado) +
      parseFloat(totalMultas)
    ).toFixed(2);
    doc
      .fontSize(fontSizeDetaller)
      .text("TOTAL:", textoCuadroX, textoCuadroY)
      .text("$" + totalValue, detallerValue + 100, textoCuadroY);
  } catch (error) {
    // Manejo de errores
    console.error("Ha ocurrido un error:", error);
    // O puedes manejar el error de otra manera más adecuada para tu caso
  }
};

const generateTableClienteTwo = async (
  doc,
  data,
  INTERES_BASE,
  multas = [],
  ja_tabla = []
) => {
  try {
    let total = 0;
    let tableTop = 570;

    const titleTableX = 50;
    const fechaX = 50;
    const lecturaAnteriorX = 110;
    const lecturaActualX = 190;
    const consumoX = 265;
    const subTotalX = 335; //335
    const alcantarilladoX = 395;
    const interesX = 445;
    const totalX = 500;

    const titleFontSize = 16;
    const rowFontSize = 10;
    const fontBold = "Helvetica-Bold";
    const fontRegular = "Helvetica";

    doc
      .font(fontBold)
      .fontSize(titleFontSize)
      .text("Consumo de Agua", titleTableX, 540);
    doc.moveTo(titleTableX, 560).lineTo(550, 560).stroke();

    doc
      .fontSize(rowFontSize)
      .font(fontBold)
      .text("Fecha", fechaX, tableTop)
      .text("Lec. Anterior", lecturaAnteriorX, tableTop)
      .text("Lec. Actual", lecturaActualX, tableTop)
      .text("Consumo", consumoX, tableTop)
      .text("Interes", interesX, tableTop)
      .text("Agua", subTotalX, tableTop)
      .text("Alc.", alcantarilladoX, tableTop)
      .text("Total", totalX, tableTop);

    doc.moveTo(titleTableX, 585).lineTo(550, 585).stroke();

    let rowData = data;
    let currentRow = tableTop + 18;
    let indexMultiplo = 2;
    let totalAlacantarillado = 0;
    if (rowData.length !== 0) {
      for (let i = 0; i < rowData.length && i < MAX_ROWS; i++) {
        let ExcedenteNew =
          rowData[i].LecturaActual - rowData[i].LecturaAnterior;
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

        let interesIcrement = 0;

        if (INTERES_BASE === 0) {
          interesIcrement = 0;
        } else if (i === 0) {
          interesIcrement = 0;
        } else if (i === 1) {
          interesIcrement = INTERES_BASE;
        } else {
          interesIcrement = INTERES_BASE * indexMultiplo;
          indexMultiplo++;
        }

        doc
          .font(fontRegular)
          .fontSize(rowFontSize)
          .text(rowData[i].Mes + "/" + rowData[i].Anio, fechaX, currentRow)
          .text(rowData[i].LecturaAnterior, lecturaAnteriorX, currentRow)
          .text(rowData[i].LecturaActual, lecturaActualX, currentRow)
          .text(
            rowData[i].LecturaActual - rowData[i].LecturaAnterior,
            consumoX,
            currentRow
          )
          .text(
            (interesIcrement * 100).toFixed(0) + "%",
            interesX,
            currentRow
          )

          .text(
            "$" + Number(rowData[i].Alcantarillado).toFixed(2),
            alcantarilladoX,
            currentRow
          )

          .text(
            "$" + (rowData[i].Basico + ExcedenteVNew),
            subTotalX,
            currentRow
          )
          .text("$" + rowData[i].Saldo.toFixed(2), totalX, currentRow);

        // Actualizar el valor detotal
        total += rowData[i].Saldo;
        totalAlacantarillado += rowData[i].Alcantarillado;
        currentRow += 15;
      }

      currentRow = currentRow - 5;

      const fontSizeDetaller = 10;
      const detallex = 300;
      const detallerValue = 400;
      const DETALLE_TEXT = "AGUA:";
      const SANAMIENTO_TEXT = `SERVICIO DE SANAMIENTO (${rowData.length}):`;
      const MULTA_TEXT = `TOTAL MULTAS (${multas.length}):`;
      const DETALLE_POSITION_Y = currentRow + 15;
      const SANAMIENTO_POSITION_Y = currentRow + 30;
      const MULTA_POSITION_Y = currentRow + 45;

      const totalMultas = multas
        .map((multa) => multa.valor_pagar)
        .reduce((a, b) => a + b, 0)
        .toFixed(2);

      let totalSanamiento = parseFloat(
        rowData[0].Basico === 5.5 / 2
          ? (1.5 * rowData.length).toFixed(2)
          : (rowData.length * 3.0).toFixed(2)
      ).toFixed(2);

      doc
        .text(DETALLE_TEXT, detallex, DETALLE_POSITION_Y)
        .text("$" + total.toFixed(2), detallerValue + 100, DETALLE_POSITION_Y)
        .text(SANAMIENTO_TEXT, detallex, SANAMIENTO_POSITION_Y);

      doc
        .text(
          `$${totalAlacantarillado.toFixed(2)}`,
          detallerValue + 100,
          SANAMIENTO_POSITION_Y
        )
        .text(MULTA_TEXT, detallex, MULTA_POSITION_Y)
        .text("$" + totalMultas, detallerValue + 100, MULTA_POSITION_Y);

      // Agregar el cuadro de texto
      const cuadroX = detallex - 10;
      const cuadroY = currentRow + 60;
      const cuadroWidth = 250; // Ajuste el ancho según su necesidad
      const cuadroHeight = 20;
      doc.rect(cuadroX, cuadroY, cuadroWidth, cuadroHeight).stroke();

      const textoCuadroX = cuadroX + 10;
      const textoCuadroY = cuadroY + 5;

      const totalValue = (
        parseFloat(total) +
        parseFloat(totalAlacantarillado) +
        parseFloat(totalMultas)
      ).toFixed(2);

      doc
        .fontSize(fontSizeDetaller)
        .text("TOTAL:", textoCuadroX, textoCuadroY)
        .text("$" + totalValue, detallerValue + 100, textoCuadroY);
    }
  } catch (error) {
    console.error("Ha ocurrido un error:", error);
  }
};

const generateTableClienteTree = async (
  doc,
  data,
  INTERES_BASE,
  multas = [],
  ja_tabla = []
) => {
  try {
    let INTERES = INTERES_BASE;
    let interesIcrement = 0;

    let tableTop = 180;

    const titleTableX = 50;
    const fechaX = 50;
    const lecturaAnteriorX = 110;
    const lecturaActualX = 190;
    const consumoX = 265;
    const subTotalX = 335; //335
    const alcantarilladoX = 395;
    const interesX = 445;
    const totalX = 500;

    const titleFontSize = 16;
    const rowFontSize = 10;
    const fontBold = "Helvetica-Bold";
    const fontRegular = "Helvetica";

    // Títulos de la tabla
    doc
      .font(fontBold)
      .fontSize(titleFontSize)
      .text("Consumo de Agua", titleTableX, 150);
    doc.moveTo(titleTableX, 170).lineTo(550, 170).stroke();

    doc
      .fontSize(rowFontSize)
      .font(fontBold)
      .text("Fecha", fechaX, tableTop)
      .text("Lec. Anterior", lecturaAnteriorX, tableTop)
      .text("Lec. Actual", lecturaActualX, tableTop)
      .text("Consumo", consumoX, tableTop)
      .text("Interes", interesX, tableTop)
      .text("Agua", subTotalX, tableTop)
      .text("Alc.", alcantarilladoX, tableTop)
      .text("Total", totalX, tableTop);

    doc.moveTo(titleTableX, 195).lineTo(550, 195).stroke();

    let rowData = data;
    let currentRow = tableTop + 18;
    let total = 0;
    let totalAgua = 0;
    let indexMultiplo = 2;
    let totalAlacantarillado = 0;
    if (rowData.length !== 0) {
      for (let i = 0; i < rowData.length && i < 25; i++) {
        let ExcedenteNew =
          rowData[i].LecturaActual - rowData[i].LecturaAnterior;
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

        doc
          .font(fontRegular)
          .fontSize(rowFontSize)
          .text(rowData[i].Mes + "/" + rowData[i].Anio, fechaX, currentRow)
          .text(rowData[i].LecturaAnterior, lecturaAnteriorX, currentRow)
          .text(rowData[i].LecturaActual, lecturaActualX, currentRow)
          .text(
            (rowData[i].LecturaActual - rowData[i].LecturaAnterior).toFixed(2),
            consumoX,
            currentRow
          );

        if (INTERES_BASE === 0) {
          interesIcrement = 0;
        } else if (i === 0) {
          interesIcrement = 0;
        } else if (i === 1) {
          interesIcrement = INTERES_BASE;
        } else {
          // interesIcrement = INTERES_BASE * indexMultiplo;
          // INTERES = interesIcrement;
          // indexMultiplo = interesIcrement;
          interesIcrement = INTERES_BASE * indexMultiplo;
          indexMultiplo++;
        }

        doc
          .text(
            (interesIcrement * 100).toFixed(0) + "%",
            interesX,
            currentRow
          ) /* Aqui va el subTotal */
          .text(
            "$" + (rowData[i].Basico + ExcedenteVNew).toFixed(2),
            subTotalX,
            currentRow
          )
          .text(
            "$" + Number(rowData[i].Alcantarillado).toFixed(2),
            alcantarilladoX,
            currentRow
          )

          .text("$" + rowData[i].Saldo.toFixed(2), totalX, currentRow);
        total += rowData[i].Saldo;
        totalAgua += rowData[i].Total;
        totalAlacantarillado += rowData[i].Alcantarillado;
        currentRow += 15;
      }
    }

    currentRow = currentRow - 5;
    const fontSizeDetaller = 10;
    const detallex = 300;
    const detallerValue = 400;
    const DETALLE_TEXT = "AGUA:";
    const SANAMIENTO_TEXT = `SERVICIO DE SANAMIENTO (${rowData.length}):`;
    const MULTA_TEXT = `TOTAL MULTAS (${multas.length}):`;
    const DETALLE_POSITION_Y = currentRow + 15;
    const SANAMIENTO_POSITION_Y = currentRow + 30;
    const MULTA_POSITION_Y = currentRow + 45;

    let totalSanamiento = parseFloat(
      rowData[0].Basico === 5.5 / 2
        ? (1.5 * rowData.length).toFixed(2)
        : (rowData.length * 3.0).toFixed(2)
    ).toFixed(2);

    let totalMultas;

    if (multas.length > 0) {
      totalMultas = multas
        .map((multa) => multa.valor_pagar)
        .reduce((a, b) => a + b, 0)
        .toFixed(2);
    } else {
      totalMultas = 0;
    }

    doc
      .fontSize(fontSizeDetaller)
      .text(DETALLE_TEXT, detallex, DETALLE_POSITION_Y)
      //redondear a dos decimales
      .text("$" + totalAgua.toFixed(2), detallerValue + 100, DETALLE_POSITION_Y)
      .text(SANAMIENTO_TEXT, detallex, SANAMIENTO_POSITION_Y)
      .text(
        `$${totalAlacantarillado.toFixed(2)}`,
        detallerValue + 100,
        SANAMIENTO_POSITION_Y
      )
      .text(MULTA_TEXT, detallex, MULTA_POSITION_Y)

      .text("$" + totalMultas, detallerValue + 100, MULTA_POSITION_Y);

    // Agregar el cuadro de texto
    const cuadroX = detallex - 10;
    const cuadroY = currentRow + 60;
    const cuadroWidth = 250; // Ajuste el ancho según su necesidad
    const cuadroHeight = 20;
    doc.rect(cuadroX, cuadroY, cuadroWidth, cuadroHeight).stroke();

    const textoCuadroX = cuadroX + 10;
    const textoCuadroY = cuadroY + 5;

    const totalValue = (
      parseFloat(total) +
      parseFloat(totalAlacantarillado) +
      parseFloat(totalMultas)
    ).toFixed(2);
    doc
      .fontSize(fontSizeDetaller)
      .text("TOTAL:", textoCuadroX, textoCuadroY)
      .text("$" + totalValue, detallerValue + 100, textoCuadroY);
  } catch (error) {
    // Manejo de errores
    console.error("Ha ocurrido un error:", error);
    // O puedes manejar el error de otra manera más adecuada para tu caso
  }
};

module.exports = {
  generateTableClienteOne,
  generateTableClienteTwo,
  generateTableClienteTree,
};
