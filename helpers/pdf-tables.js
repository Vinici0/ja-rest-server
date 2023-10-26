const MAX_ROWS = 4;

const generateTableClienteOne = async (
  doc,
  data,
  INTERES_BASE,
  multas = []
) => {
  try {
    let INTERES = INTERES_BASE;
    let interesIcrement = 0;

    const titleTableX = 50;
    let tableTop = 180;
    const fechaX = 50;
    const lecturaAnteriorX = 110;
    const lecturaActualX = 210;
    const consumoX = 300;
    const observacionX = 370;
    const subTotalX = 430;
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
      .text("Lectura Anterior", lecturaAnteriorX, tableTop)
      .text("Lectura Actual", lecturaActualX, tableTop)
      .text("Consumo", consumoX, tableTop)
      .text("Interes", observacionX, tableTop)
      .text("Sub Total", subTotalX, tableTop)
      .text("Total", totalX, tableTop);

    doc.moveTo(titleTableX, 195).lineTo(550, 195).stroke();

    let rowData = data;
    let currentRow = tableTop + 18;
    let total = 0;

    if (rowData.length !== 0) {
      for (let i = 0; i < rowData.length && i < MAX_ROWS; i++) {
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

        if (i === 0) {
          interesIcrement = 0;
        } else if (i === 1) {
          interesIcrement = INTERES_BASE;
        } else {
          interesIcrement = INTERES_BASE = INTERES_BASE + 0.01;
        }

        doc
          .text(
            (interesIcrement * 100).toFixed(2) + "%",
            observacionX,
            currentRow
          )
          .text("$" + rowData[i].Total, subTotalX, currentRow)
          .text(
            "$" + (INTERES / rowData[i].Total + rowData[i].Total).toFixed(2),
            totalX,
            currentRow
          );
        total += rowData[i].Total;
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

    let totalSanamiento =
      rowData[0].Basico === 5.5 / 2
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
      .text("$" + total.toFixed(2), detallerValue + 100, DETALLE_POSITION_Y)
      .text(SANAMIENTO_TEXT, detallex, SANAMIENTO_POSITION_Y)
      .text(
        `$${totalSanamiento}`,

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
      parseFloat(totalSanamiento) +
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
  multas = []
) => {
  try {
    let INTERES = INTERES_BASE;
    let total = 0;
    const titleTableX = 50;
    let tableTop = 570;
    const fechaX = 50;
    const lecturaAnteriorX = 110;
    const lecturaActualX = 210;
    const consumoX = 300;
    const observacionX = 370;
    const subTotalX = 430;
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
      .text("Lectura Anterior", lecturaAnteriorX, tableTop)
      .text("Lectura Actual", lecturaActualX, tableTop)
      .text("Consumo", consumoX, tableTop)
      .text("Interes", observacionX, tableTop)
      .text("Sub Total", subTotalX, tableTop)
      .text("Total", totalX, tableTop);

    doc.moveTo(titleTableX, 585).lineTo(550, 585).stroke();

    let rowData = data;
    let currentRow = tableTop + 18;

    if (rowData.length !== 0) {
      for (let i = 0; i < rowData.length && i < MAX_ROWS; i++) {
        let interesIcrement = 0;
        if (i === 0) {
          interesIcrement = 0;
        } else if (i === 1) {
          interesIcrement = INTERES_BASE;
        } else {
          interesIcrement = INTERES_BASE + 0.01;
          INTERES_BASE = interesIcrement;
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
          .text((interesIcrement * 100).toFixed(2) + "%", observacionX, currentRow)
          .text("$" + rowData[i].Total, subTotalX, currentRow)
          .text(
            "$" + (interesIcrement * rowData[i].Total + rowData[i].Total).toFixed(2),
            totalX,
            currentRow
          );

        // Actualizar el valor de total
        total += parseFloat(rowData[i].Total);
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

      let totalSanamiento =
        rowData[0].Basico === 5.5 / 2
          ? (1.5 * rowData.length).toFixed(2)
          : (rowData.length * 3.0).toFixed(2);

      const totalMultas = multas
        .map((multa) => multa.valor_pagar)
        .reduce((a, b) => a + b, 0)
        .toFixed(2);

      doc
        .text(DETALLE_TEXT, detallex, DETALLE_POSITION_Y)
        .text("$" + total.toFixed(2), detallerValue + 100, DETALLE_POSITION_Y)
        .text(SANAMIENTO_TEXT, detallex, SANAMIENTO_POSITION_Y)
        .text(
          `$${totalSanamiento}`,
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
        parseFloat(totalSanamiento) +
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

module.exports = {
  generateTableClienteOne,
  generateTableClienteTwo,
};
