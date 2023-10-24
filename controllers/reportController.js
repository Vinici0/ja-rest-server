const { request, response } = require("express");
const getStream = require("get-stream");
const fs = require("fs");
const PDFDocument = require("pdfkit-construct");
const userService = require("../services/reportService");
const Response = require("../helpers/response");
const {
  logoClientOne,
  logoClientTwo,
  generateHeadersClienteOne,
  generateHeadersClienteTwo,
} = require("../helpers/pdf-templates");
const {
  generateTableClienteOne,
  generateTableClienteTwo,
} = require("../helpers/pdf-tables");
const {
  getMeasurements,
  getInteresBase,
} = require("../services/reportService");

const generateFooter = (doc) => {
  doc.fontSize(10).text("Juntos por el agua", 50, 690, {
    align: "center",
    width: 500,
  });
};

const agregarPagosAnteriores = (doc, pagosAnteriores, startX, startY) => {
  doc.fontSize(10).font("Helvetica");

  pagosAnteriores.forEach((pago, index) => {
    const yPosition = startY + index * 15; // Ajusta la posición vertical para cada fila

    doc
      .text(pago.Mes, startX, yPosition)
      .text(pago.Anio, startX + 70, yPosition)
      .text("$" + pago.Saldo, startX + 140, yPosition)
      .text(pago.Codigo, startX + 220, yPosition)
      .text(pago.Lote, startX + 290, yPosition)
      .text(pago.Manzana, startX + 360, yPosition)
      .text(pago.Nombre, startX + 430, yPosition);
  });
};

const generatePdfMeasure = async (data) => {
  try {
    const doc = new PDFDocument();
    const measurementsPromises = [];
    const multasPromises = [];
    console.log(
      "const INTERES_BASE = await getInteresBase()[0].interes / 100;"
    );
    const INTERES_BASE = await getInteresBase();
    console.log(INTERES_BASE);
    for (let i = 0; i < data.length; i += 2) {
      let measureOne = data[i];
      let measureTwo = data[i + 1]; // Asegúrate de verificar si measureTwo no es undefined antes de usarlo

      measurementsPromises.push(
        getMeasurements(measureOne.Anio, measureOne.Codigo)
      );
      if (measureTwo) {
        measurementsPromises.push(
          getMeasurements(measureTwo.Anio, measureTwo.Codigo)
        );
      }

      multasPromises.push(userService.getFineByClient(measureOne.idCliente));
      if (measureTwo) {
        multasPromises.push(userService.getFineByClient(measureTwo.idCliente));
      }
    }

    const measurements = await Promise.all(measurementsPromises);
    const multas = await Promise.all(multasPromises);

    for (let i = 0; i < data.length; i += 2) {
      let measureOne = data[i];
      let measureTwo = data[i + 1];

      let tableRowOne = measurements[i];
      let tableRowTwo = measurements[i + 1];

      let multasClienteOne = multas[i];
      let multasClienteTwo = multas[i + 1];

      generateHeadersClienteOne(doc, measureOne);
      if (measureTwo) {
        generateHeadersClienteTwo(doc, measureTwo);
        if (tableRowTwo && tableRowTwo.length > 0) {
          generateTableClienteTwo(
            doc,
            tableRowTwo,
            INTERES_BASE,
            multasClienteTwo /* multas */
          );
        } else {
        }
      }
      if (tableRowOne && tableRowOne.length > 0) {
        generateTableClienteOne(
          doc,
          tableRowOne,
          INTERES_BASE,
          multasClienteOne /* multas */
        );
      } else {
      }
      if (i + 2 < data.length) {
        doc.addPage();
      }
    }

    if (process.env.NODE_ENV === "development") {
      doc.pipe(fs.createWriteStream(`${__dirname}/../file.pdf`));
    }

    doc.end();

    // Convertir el PDF a un buffer y devolverlo
    const pdfStream = await getStream.buffer(doc);

    return pdfStream;
  } catch (error) {
    return null;
  }
};

const generateMeterTable = (doc, data) => {
  const titleTable = 50;
  const tableTop = 160;
  const maxRecordsPerPage = 20; // Número máximo de registros por página

  const codigoX = 50;
  const nombreX = 110;
  const loteX = 355;
  const manzanaX = 395;
  const estadoX = 475;

  logoClientOne(doc);

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("ESTADO DE MEDIDORES", titleTable, 127);

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Código", codigoX, tableTop)
    .text("Nombre", nombreX, tableTop)
    .text("Lote", loteX, tableTop)
    .text("Manzana", manzanaX, tableTop)
    .text("Estado", estadoX, tableTop);

  let currentPage = 1;
  let currentRow = 0;

  data.forEach((item, index) => {
    if (currentRow === maxRecordsPerPage) {
      // Si se alcanza el límite de registros por página, agrega una nueva página
      doc.addPage();
      currentPage++;
      currentRow = 0;

      // Repite el encabezado en la nueva página si es necesario
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Código", codigoX, tableTop)
        .text("Nombre", nombreX, tableTop)
        .text("Lote", loteX, tableTop)
        .text("Manzana", manzanaX, tableTop)
        .text("Estado", estadoX, tableTop);
    }

    const rowTop = tableTop + (currentRow + 1) * 25;

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(item.Codigo, codigoX, rowTop)
      .text(item.Nombre.trim(), nombreX, rowTop)
      .text(item.Lote.trim(), loteX, rowTop)
      .text(item.Manzana.trim(), manzanaX, rowTop)
      .text(!item.Estado ? "BUENO" : "REPARACIÓN", estadoX, rowTop);

    currentRow++;

    // Verifica si estamos en el último registro
    if (index === data.length - 1) {
      // doc.text(`Página ${currentPage}`, 500, 700);
    }
  });
};

const generateMeterTableCourt = (doc, data) => {
  const titleTable = 50;
  let tableTop = 160;
  let maxRecordsPerPage = 20; // Número máximo de registros por página
  let rowTop = 0; // Declaración de rowTop fuera del bucle
  const codigoX = 50;
  const nombreX = 110;
  const loteX = 355;
  const manzanaX = 395;
  const saldoX = 450;
  const mesesX = 500;

  logoClientOne(doc);

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("CORTE DE MEDIDORES", titleTable, 127);

  let currentPage = 1;
  let currentRow = 0;
  let isLastPage = false;

  // Muestra el encabezado en la primera página
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Código", codigoX, tableTop)
    .text("Nombre", nombreX, tableTop)
    .text("Lote", loteX, tableTop)
    .text("Manzana", manzanaX, tableTop)
    .text("Saldo", saldoX, tableTop)
    .text("Meses", mesesX, tableTop);

  data.forEach((item, index) => {
    if (currentRow === maxRecordsPerPage) {
      console.log(index);
      // Si se alcanza el límite de registros por página, agrega una nueva página
      doc.addPage();
      currentPage++;
      currentRow = 0;
      // Restaura el valor de tableTop para la nueva página
      tableTop = 20;
      // maxRecordsPerPage = maxRecordsPerPageAfterFirstPage;

      // Muestra el encabezado en las páginas posteriores
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Código", codigoX, tableTop)
        .text("Nombre", nombreX, tableTop)
        .text("Lote", loteX, tableTop)
        .text("Manzana", manzanaX, tableTop)
        .text("Saldo", saldoX, tableTop)
        .text("Meses", mesesX, tableTop);
      9;
    }

    rowTop = tableTop + (currentRow + 1) * 25; // Usa la variable rowTop definida fuera del bucle

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(item.codigo, codigoX, rowTop)
      .text(item.Nombre.trim(), nombreX, rowTop)
      .text(item.Lote.trim(), loteX, rowTop)
      .text(item.Manzana.trim(), manzanaX, rowTop)
      .text("$" + item.saldo.toFixed(2), saldoX, rowTop)
      .text(item.meses, mesesX, rowTop);

    currentRow++;

    // Verifica si estamos en el último registro
    if (index === data.length - 1) {
      // doc.text(`Página ${currentPage}`, 500, 700);
    }
  });
};

const generatePdfMeter = async (data) => {
  try {
    const doc = new PDFDocument();

    generateMeterTable(doc, data);
    // generateFooter(doc);

    if (process.env.NODE_ENV === "development") {
      doc.pipe(fs.createWriteStream(`${__dirname}/../meter.pdf`));
    }

    doc.end();

    // Convertir el PDF a un buffer y devolverlo
    const pdfStream = await getStream.buffer(doc);

    return pdfStream;
  } catch (error) {
    return null;
  }
};

const generatePdfMeasureCourt = async (data) => {
  try {
    const doc = new PDFDocument();

    generateMeterTableCourt(doc, data);
    generateFooter(doc);

    if (process.env.NODE_ENV === "development") {
      doc.pipe(fs.createWriteStream(`${__dirname}/../meterCourt.pdf`));
    }

    doc.end();

    // Convertir el PDF a un buffer y devolverlo
    const pdfStream = await getStream.buffer(doc);

    return pdfStream;
  } catch (error) {
    return null;
  }
};

const showMeasure = async (req, res) => {
  const bodyArray = req.body;

  const pdfStream = await generatePdfMeasure(bodyArray);

  res
    .writeHead(200, {
      "Content-Length": Buffer.byteLength(pdfStream),
      "Content-Type": "application/pdf",
      "Content-disposition": "attachment;filename=test.pdf",
    })
    .end(pdfStream);
};

const showMeter = async (req, res) => {
  const bodyArray = req.body;
  const pdfStream = await generatePdfMeter(bodyArray);
  res
    .writeHead(200, {
      "Content-Length": Buffer.byteLength(pdfStream),
      "Content-Type": "application/pdf",
      "Content-disposition": "attachment;filename=test.pdf",
    })
    .end(pdfStream);
};

const showCuteMeter = async (req, res) => {
  const bodyArray = req.body;
  const pdfStream = await generatePdfMeter(bodyArray);
  res
    .writeHead(200, {
      "Content-Length": Buffer.byteLength(pdfStream),
      "Content-Type": "application/pdf",
      "Content-disposition": "attachment;filename=test.pdf",
    })
    .end(pdfStream);
};

const showMeasureCourt = async (req, res) => {
  const bodyArray = req.body;
  const pdfStream = await generatePdfMeasureCourt(bodyArray);
  res
    .writeHead(200, {
      "Content-Length": Buffer.byteLength(pdfStream),
      "Content-Type": "application/pdf",
      "Content-disposition": "attachment;filename=test.pdf",
    })
    .end(pdfStream);
};

const calculoIntrest = async (req, res) => {
  // Datos de entrada
  const registros = [
    {
      Acumulado: 5.5,
      Anio: 2023,
      Basico: 5.5,
      Codigo: "06-642628",
      Mes: 6,
      Nombre: "CURIPOMA BELTRAN ALFONSO MARIA",
      Saldo: 50,
      Total: 5.5,
      Usurario: "Administrador",
      InteresPorMora: 0,
    },
    {
      Acumulado: 5.5,
      Anio: 2023,
      Basico: 5.5,
      Codigo: "06-642628",
      Mes: 7,
      Nombre: "CURIPOMA BELTRAN ALFONSO MARIA",
      Saldo: 0,
      Total: 5.5,
      Usurario: "Administrador",
      InteresPorMora: 0,
    },
    {
      Acumulado: 5.5,
      Anio: 2023,
      Basico: 5.5,
      Codigo: "06-642628",
      Mes: 8,
      Nombre: "CURIPOMA BELTRAN ALFONSO MARIA",
      Saldo: 1,
      Total: 5.5,
      Usurario: "Administrador",
      InteresPorMora: 0,
    },
    {
      Acumulado: 7.2,
      Anio: 2023,
      Basico: 5.5,
      Codigo: "09-312634",
      Mes: 9,
      Nombre: "CURIPOMA BELTRAN ALFONSO MARIA",
      Saldo: 2.7,
      Total: 7.2,
      Usurario: "Administrador",
      InteresPorMora: 0,
    },
    {
      Acumulado: 12.6,
      Anio: 2023,
      Basico: 5.5,
      Codigo: "05-789012",
      Mes: 10,
      Nombre: "CURIPOMA BELTRAN ALFONSO MARIA",
      Saldo: 7.1,
      Total: 12.6,
      Usurario: "Administrador",
      InteresPorMora: 0,
    },
    {
      Acumulado: 18.3,
      Anio: 2023,
      Basico: 5.5,
      Codigo: "11-456789",
      Mes: 11,
      Nombre: "CURIPOMA BELTRAN ALFONSO MARIA",
      Saldo: 12.8,
      Total: 18.3,
      Usurario: "Administrador",
      InteresPorMora: 0,
    },
    {
      Acumulado: 18.3,
      Anio: 2023,
      Basico: 5.5,
      Codigo: "11-456789",
      Mes: 12,
      Nombre: "CURIPOMA BELTRAN ALFONSO MARIA",
      Saldo: 12.8,
      Total: 18.3,
      Usurario: "Administrador",
      InteresPorMora: 0,
    },
  ];

  // Función para calcular el interés por mora si el saldo es mayor que cero
  const calcularInteresPorMora = (registro) => {
    const mesActual = 12; // Mes actual
    const mesesAtraso = mesActual - registro.Mes;
    const tasaBase = 0.01; // Tasa base de interés por mes de atraso
    const porcentajeInteres = tasaBase + mesesAtraso * 0.01;
    return `${porcentajeInteres * 100}%`; // Devuelve el porcentaje de interés
  };

  // Cantidad de interés a ser pasada como parámetro
  const tasaInteres = 0.01; // Cantidad de interés a ser ajustada según sea necesario

  // Calcular e imprimir el resultado para cada registro
  registros.forEach((registro, index) => {
    registros[index].InteresPorMora = calcularInteresPorMora(
      registro,
      tasaInteres
    );
  });

  console.log(registros);

  res.json({
    registros,
  });
};

module.exports = {
  showMeasure,
  showMeter,
  showMeasureCourt,
  calculoIntrest,
};
