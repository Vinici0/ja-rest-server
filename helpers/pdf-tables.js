const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const { months } = require("moment/moment");
const { getMeasurementsByCode } = require("../services/measureService");
const MAX_ROWS = 4;

const generateTableClienteOne = async (
  doc,
  data,
  INTERES_BASE,
  multas = [],
  ja_tabla = [],
  fineDetailsByIdClient = []
) => {
  try {
    let INTERES = INTERES_BASE;
    let interesIcrement = 0;

    let tableTop = 180;
    const titleTableX = 50;
    const fechaX = 50;
    const lecturaAnteriorX = 95;
    const lecturaActualX = 170;
    const consumoX = 240;
    const subTotalX = 305; //335
    const alcantarilladoX = 355;
    const interesX = 395;
    const totalX = 440;
    const AcumuladoX = 485;

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
      .text("Total", totalX, tableTop)
      .text("Acumulado", AcumuladoX, tableTop);

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

        if (ExcedenteNew >= ja_tabla.Desde && ExcedenteNew <= ja_tabla.Hasta) {
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

          .text("$" + rowData[i].Saldo.toFixed(2), totalX, currentRow)
          .text("$" + rowData[i].Acumulado.toFixed(2), AcumuladoX, currentRow);
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
    const SANAMIENTO_TEXT = `SERVICIO DE ALCANTARILLADO (${rowData.length}):`;
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

    //ubicar a la derecho de agua un titulo en negrtita que diga "Multas"
    //Texto en negrita
    // doc.
    //   font(fontBold)
    //   .fontSize(14)
    //   .text("MULTAS DE ASAMBLEA", 50, DETALLE_POSITION_Y);


    // const maxDetalles = 4;
    // const detallesRecorridos = Math.min(
    //   fineDetailsByIdClient.length,
    //   maxDetalles
    // );

    // // Quitar texto en negrita
    // doc.font(fontRegular);

    // for (let index = 0; index < detallesRecorridos; index++) {
    //   const detalle = fineDetailsByIdClient[index];
    //   const detalleText = `${detalle[index].typeFine}:`;
    //   const detalleValue = `$${detalle[index].valor_pagar.toFixed(2)}`;
    //   // const detalleValue = `$${detalle.valor_pagar.toFixed(2)}`;

    //   // Calcular la posición vertical para cada detalle
    //   const detallePositionY = DETALLE_POSITION_Y + 15 + index * 15;

    //   // Imprimir el tipo de detalle y su valor
    //   doc
    //     .fontSize(fontSizeDetaller)
    //     .text(
    //       `${detalleText} ${detalleValue}`,
    //       50,
    //       detallePositionY
    //     );
    //   // .text(detalleValue, 50 + 100, detallePositionY);
    // }

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
    const lecturaAnteriorX = 95;
    const lecturaActualX = 170;
    const consumoX = 240;
    const subTotalX = 305; //335
    const alcantarilladoX = 355;
    const interesX = 395;
    const totalX = 440;
    const AcumuladoX = 485;

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
      .text("Total", totalX, tableTop)
      .text("Acumulado", AcumuladoX, tableTop);

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

        if (ExcedenteNew >= ja_tabla.Desde && ExcedenteNew <= ja_tabla.Hasta) {
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
          .text((interesIcrement * 100).toFixed(0) + "%", interesX, currentRow)

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
          .text("$" + rowData[i].Saldo.toFixed(2), totalX, currentRow)
          .text("$" + rowData[i].Acumulado.toFixed(2), AcumuladoX, currentRow);

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
        rowData.Basico === 5.5 / 2
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
    const lecturaAnteriorX = 95;
    const lecturaActualX = 170;
    const consumoX = 240;
    const subTotalX = 305; //335
    const alcantarilladoX = 355;
    const interesX = 395;
    const totalX = 440;
    const AcumuladoX = 485;

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
      .text("Total", totalX, tableTop)
      .text("Acumulado", AcumuladoX, tableTop);

    doc.moveTo(titleTableX, 195).lineTo(550, 195).stroke();

    let rowData = data;
    //Sumar el total de consumo de agua
    let totalSumaALL = 0;
    let totalAlcantarrilladoAll = 0;
    for (let i = 0; i < rowData.length; i++) {
      totalSumaALL += rowData[i].Total;
      totalAlcantarrilladoAll += rowData[i].Alcantarillado;
    }
    let currentRow = tableTop + 18;
    let total = 0;
    let totalAgua = 0;
    let indexMultiplo = 2;
    let totalAlacantarillado = 0;
    // let resGetSum = [];
    if (rowData.length !== 0) {
      for (let i = 0; i < rowData.length && i < 25; i++) {
        // resGetSum = await getSum(rowData[i].idCliente);
        let ExcedenteNew =
          rowData[i].LecturaActual - rowData[i].LecturaAnterior;
        let ExcedenteVNew = 0;

        if (ExcedenteNew >= ja_tabla.Desde && ExcedenteNew <= ja_tabla.Hasta) {
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

          .text("$" + rowData[i].Saldo.toFixed(2), totalX, currentRow)
          .text("$" + rowData[i].Acumulado.toFixed(2), AcumuladoX, currentRow);
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
      rowData.Basico === 5.5 / 2
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
      .text(
        "$" + totalSumaALL.toFixed(2),
        detallerValue + 100,
        DETALLE_POSITION_Y
      )
      .text(SANAMIENTO_TEXT, detallex, SANAMIENTO_POSITION_Y)
      .text(
        `$${totalAlcantarrilladoAll.toFixed(2)}`,
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
      .text(
        "$" + rowData[0].Acumulado.toFixed(2),
        detallerValue + 100,
        textoCuadroY
      );
  } catch (error) {
    // Manejo de errores
    console.error("Ha ocurrido un error:", error);
    // O puedes manejar el error de otra manera más adecuada para tu caso
  }
};

const getSum = async (idCliente) => {
  const totales = await dbConnection.query(
    `SELECT SUM(Saldo) as totalSaldo, SUM(Total) as totalTotal, SUM(Alcantarillado) as totalAlcantarillado FROM JA_Medida WHERE idCliente = :idCliente`,
    {
      replacements: { idCliente: idCliente },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return totales;
};
//////////////////////////////////////////////////////////////////////////////////////////////
//                                        Cortes
//////////////////////////////////////////////////////////////////////////////////////////////
const generateTableMeasureCourtOne = async (doc, data, dataAll) => {
  try {
    const totalPagar = await getMeasurementsByCode(data.codigo);
    const year = new Date().getFullYear();
    //Cnter text
    const { day, month, monthsCorte } = dataAll;
    // arreglo de fechas de corte por numero de meses llave valor
    const fechasCorteMes = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    //Busqur que dia de la semana es en base al dya o mes
    const dayWeek = new Date(year, dataAll.month, dataAll.day).getDay();

    const dayWeekText = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
    ];

    const dayWeekTextValue = dayWeekText[dayWeek];

    const titleFontSize = 12;
    const commonFontSize = 12;
    const fontBold = "Helvetica-Bold";
    const fontRegular = "Helvetica";

    const ubicValo = 50; // Posición X común
    const ubicValoY = 150; // Posición Y común
    const textoInX = 50; // Posición X común

    const tituloTitle = "JUNTA ADM DE AGUA POTABLE DE LA URB";
    const tituloSubtitle = "EL PORTON";
    const tituloSubtitleSub = "NOTIFICACION DE CORTE";

    const textInformation = `Sr(a): ${data.Nombre}`.trim();
    const textInformationFontSize = commonFontSize;

    const textPresente = "Presente.-";
    const textPresenteFontSize = commonFontSize;

    const textEnUso = `En uso de las atribuciones establecidas en el Art. 18 del Reglamento Interno, se notifica que a partir del día ${dayWeekTextValue} ${day} de ${
      fechasCorteMes[month]
    }, ${year} se iniciará el programa de corte y suspensión del servicio de agua por encontrarse en mora con ${monthsCorte} meses, del medidor ${
      data.codigo
    }, de la manzana ${data.Manzana.trim()}, Solar nro ${data.Lote.trim()}, El monto adeudado es $${totalPagar[0].Acumulado.toFixed(
      2
    )} USD por efecto del consumo.`;
    const textEnUsoFontSize = commonFontSize;

    const textLaJunta = `La Junta previene que una vez suspendido el servicio, la reconexión será dentro de las 24 horas después que usted haya efectuado el pago, rogamos respetar el horario.`;
    const textLaJuntaFontSize = commonFontSize;

    const textEvitese = `Evítese molestias y cancele a tiempo sus planillas.`;
    const textEviteseFontSize = commonFontSize;

    const textAtte = `ATTE`;
    const textAtteFontSize = commonFontSize;

    const textLaDirectiva = `LA DIRECTIVA`;
    const textLaDirectivaFontSize = commonFontSize;

    //Agreggar el titulo y centrar el texto horizontalmente

    // doc.image('assets/logo2.png', {
    //   fit: [50, 50],
    //   align: 'center',
    //   valign: 'center'
    // });
    doc.font(fontBold).fontSize(16);

    doc.text(tituloTitle, {
      width: 500,
      height: 5,
      align: "center",
    });

    doc.text(tituloSubtitle, {
      width: 500,
      height: 40,
      align: "center",
    });

    doc.text(tituloSubtitleSub, {
      width: 500,
      height: 55,
      align: "center",
    });

    const sumY = 10;
    const fontTextSize = 10;
    //Letras tamaño 12
    //Quitar la negrita del texto
    doc.font(fontRegular).fontSize(fontTextSize);

    // ...
    doc
      .fontSize(fontTextSize)
      .text(textInformation, textoInX, ubicValoY, { align: "justify" });
    doc
      .fontSize(fontTextSize)
      .text(textPresente, textoInX, ubicValoY + 20 + sumY, {
        align: "justify",
      });
    doc
      .fontSize(fontTextSize)
      .text(textEnUso, textoInX, ubicValoY + 35 + sumY, { align: "justify" });
    doc
      .fontSize(fontTextSize)
      .text(textLaJunta, textoInX, ubicValoY + 100 + sumY, {
        align: "justify",
      });
    doc
      .fontSize(fontTextSize)
      .text(textEvitese, textoInX, ubicValoY + 140 + sumY, {
        align: "justify",
      });

    doc
      .fontSize(fontTextSize)
      .text(textAtte, textoInX, ubicValoY + 175 + sumY, {
        align: "center",
      });

    doc
      .fontSize(fontTextSize)
      .text(textLaDirectiva, textoInX, ubicValoY + 190 + sumY, {
        align: "center",
      });

    doc.fontSize(fontTextSize).text("", textoInX, ubicValoY + 230 + sumY, {
      align: "center",
    });
  } catch (error) {
    console.error("Ha ocurrido un error:", error);
  }
};

const generateTableMeasureCourtTwo = async (doc, data, dataAll) => {
  try {
    const totalPagar = await getMeasurementsByCode(data.codigo);
    const year = new Date().getFullYear();
    //Cnter text
    const { day, month, monthsCorte } = dataAll;
    // arreglo de fechas de corte por numero de meses llave valor
    const fechasCorteMes = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    //Busqur que dia de la semana es en base al dya o mes
    const dayWeek = new Date(year, dataAll.month, dataAll.day).getDay();

    const dayWeekText = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
    ];

    const dayWeekTextValue = dayWeekText[dayWeek];

    const titleFontSize = 12;
    const commonFontSize = 12;
    const fontBold = "Helvetica-Bold";
    const fontRegular = "Helvetica";

    const ubicValo = 50; // Posición X común
    const ubicValoY = 470; // Posición Y común
    const textoInX = 50; // Posición X común

    const tituloTitle = "JUNTA ADM DE AGUA POTABLE DE LA URB";
    const tituloSubtitle = "EL PORTON";
    const tituloSubtitleSub = "NOTIFICACION DE CORTE";

    const textInformation = `Sr(a): ${data.Nombre}`.trim();
    const textInformationFontSize = commonFontSize;

    const textPresente = "Presente.-";
    const textPresenteFontSize = commonFontSize;

    const textEnUso = `En uso de las atribuciones establecidas en el Art. 18 del Reglamento Interno, se notifica que a partir del día ${dayWeekTextValue}, ${day} ${
      fechasCorteMes[month]
    }, ${year} se iniciará el programa de corte y suspensión del servicio de agua por encontrarse en mora con ${monthsCorte} meses, del medidor ${
      data.codigo
    }, de la manzana ${data.Manzana.trim()}, Solar nro ${data.Lote.trim()}, El monto adeudado es $${totalPagar[0].Acumulado.toFixed(
      2
    )} USD por efecto del consumo.`;
    const textEnUsoFontSize = commonFontSize;

    const textLaJunta = `La Junta previene que una vez suspendido el servicio, la reconexión será dentro de las 24 horas después que usted haya efectuado el pago, rogamos respetar el horario.`;
    const textLaJuntaFontSize = commonFontSize;

    const textEvitese = `Evítese molestias y cancele a tiempo sus planillas.`;
    const textEviteseFontSize = commonFontSize;

    const textAtte = `ATTE`;
    const textAtteFontSize = commonFontSize;

    const textLaDirectiva = `LA DIRECTIVA`;
    const textLaDirectivaFontSize = commonFontSize;

    //Agreggar el titulo y centrar el texto horizontalmente
    doc.font(fontBold).fontSize(16);

    doc.text(tituloTitle, {
      width: 500,
      height: 380,
      align: "center", // Centrar horizontalmente
    });

    doc.text(tituloSubtitle, {
      width: 500,
      height: 40,
      align: "center", // Centrar horizontalmente
    });

    doc.text(tituloSubtitleSub, {
      width: 500,
      height: 55,
      align: "center", // Centrar horizontalmente
    });

    const sumY = 10;
    const fontTextSize = 10;
    //Letras tamaño 12
    //Quitar la negrita del texto
    doc.font(fontRegular).fontSize(fontTextSize);

    // ...
    doc
      .fontSize(fontTextSize)
      .text(textInformation, textoInX, ubicValoY, { align: "justify" });
    doc
      .fontSize(fontTextSize)
      .text(textPresente, textoInX, ubicValoY + 20 + sumY, {
        align: "justify",
      });
    doc
      .fontSize(fontTextSize)
      .text(textEnUso, textoInX, ubicValoY + 35 + sumY, { align: "justify" });
    doc
      .fontSize(fontTextSize)
      .text(textLaJunta, textoInX, ubicValoY + 100 + sumY, {
        align: "justify",
      });
    doc
      .fontSize(fontTextSize)
      .text(textEvitese, textoInX, ubicValoY + 140 + sumY, {
        align: "justify",
      });
    doc
      .fontSize(fontTextSize)
      .text(textAtte, textoInX + 220, ubicValoY + 175 + sumY, {
        align: "justify",
      });
    doc
      .fontSize(fontTextSize)
      .text(textLaDirectiva, textoInX + 200, ubicValoY + 190 + sumY, {
        align: "justify",
      });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  generateTableClienteOne,
  generateTableClienteTwo,
  generateTableClienteTree,
  generateTableMeasureCourtOne,
  generateTableMeasureCourtTwo,
};
