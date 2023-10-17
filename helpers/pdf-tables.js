const MAX_ROWS = 4;
let INTERES = 0.02;
const generateTableClienteOne = async (doc, data) => {
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
  let currentRow = tableTop + 25;

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
        )
        .text(INTERES * 100 + i + "%", observacionX, currentRow)
        .text("$" + rowData[i].Total, subTotalX, currentRow)
        .text(
          "$" + (INTERES * rowData[i].Total + rowData[i].Total),
          totalX,
          currentRow
        );

      currentRow += 15;
    }
  }
};

const generateTableClienteTwo = async (doc, data) => {
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
  let currentRow = tableTop + 25;

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
        )
        .text(INTERES * 100 + i + "%", observacionX, currentRow)
        .text("$" + rowData[i].Total, subTotalX, currentRow)
        .text(
          "$" + (INTERES * rowData[i].Total + rowData[i].Total),
          totalX,
          currentRow
        );
      currentRow += 15;
    }
  }
};

module.exports = {
  generateTableClienteOne,
  generateTableClienteTwo,
};
