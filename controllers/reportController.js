const { request, response } = require("express");
const getStream = require("get-stream");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const userService = require("../services/reportService");
const Response = require("../helpers/response");

const logo = (doc) => {
  const logoX = (doc.page.width - 50) / 2;
  doc
    .image("assets/logo2.png", logoX, 0, { width: 70, align: "center" })
    .fillColor("#000")
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("JUNTOS POR EL AGUA", { align: "center" })
    .fontSize(10)
    .text("URBANIZACION EL PORTON", { align: "center" })
    .moveDown();
};

const generateFooter = (doc) => {
  doc.fontSize(10).text("Juntos por el agua", 50, 690, {
    align: "center",
    width: 500,
  });
};

const generateHeaders = (doc, factura) => {
  const logoX = (doc.page.width - 50) / 2;
  logo(doc);

  const inicioPagina = 50;
  const finPagina = 550;

  doc.moveTo(inicioPagina, 125).lineTo(finPagina, 125).stroke();
  // Columna izquierda (negrita)
  doc.font("Helvetica-Bold").text("Nombre:", inicioPagina, 130);
  doc.font("Helvetica-Bold").text("Direccion:", inicioPagina, 145);
  doc.font("Helvetica-Bold").text("Manzana:", inicioPagina, 160);
  // Columna derecha (fuente predeterminada)
  doc.font("Helvetica").text(factura.Nombre, inicioPagina + 80, 130);
  doc.font("Helvetica").text("El Porton", inicioPagina + 80, 145);
  doc.font("Helvetica").text(factura.Manzana, inicioPagina + 80, 160);
  // Columna del medio (negrita)
  doc.font("Helvetica-Bold").text("Lote:", inicioPagina + 220, 145);
  doc.font("Helvetica-Bold").text("Medidor:", inicioPagina + 220, 160);

  // Columna de la mitad derecha (fuente predeterminada)
  doc.font("Helvetica").text(factura.Lote, inicioPagina + 320, 145);
  doc.font("Helvetica").text(factura.Codigo, inicioPagina + 320, 160);
  doc.moveTo(inicioPagina, 175).lineTo(finPagina, 175).stroke();
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

const generateTable = (doc, data) => {
  const titleTable = 50;
  const tableTop = 230;
  const fechaX = 50; // Posición X de la fecha
  const lecturaAnteriorX = 120; // Ajusta la posición X
  const lecturaActualX = 220; // Ajusta la posición X
  const consumoX = 320; // Ajusta la posición X
  const observacionX = 395; // Ajusta la posición X
  const totalX = 500; // Ajusta la posición X
  // doc.fillColor("blue");
  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("Consumo de Agua", titleTable, 200);
  doc.moveTo(titleTable, 220).lineTo(550, 220).stroke();
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Fecha", fechaX, tableTop) // Agrega la fecha al principio
    .text("Lectura Anterior", lecturaAnteriorX, tableTop)
    .text("Lectura Actual", lecturaActualX, tableTop)
    .text("Consumo", consumoX, tableTop)
    .text("Observacion", observacionX, tableTop)
    .text("Total", totalX, tableTop);
  // doc.fillColor("black");
  doc.moveTo(titleTable, 245).lineTo(550, 245).stroke();
  //imprimie la data en cada fila
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(data.Mes + "/" + data.Anio, fechaX, tableTop + 25)
    .text(data.LecturaAnterior, lecturaAnteriorX, tableTop + 25)
    .text(data.LecturaActual, lecturaActualX, tableTop + 25)
    .text(data.LecturaActual - data.LecturaAnterior, consumoX, tableTop + 25)
    .text("S/N", observacionX, tableTop + 25)
    .text("$" + data.Total, totalX, tableTop + 25);

  //pagaos anteriores
  const pagosAnteriores = [
    {
      Mes: 6,
      Anio: 2021,
      Saldo: 100,
      Codigo: "123",
      Lote: "1",
      Manzana: "A",
      Nombre: "Juan",
    },
    {
      Mes: 7,
      Anio: 2021,
      Saldo: 150,
      Codigo: "123",
      Lote: "1",
      Manzana: "A",
      Nombre: "Juan",
    },
    {
      Mes: 8,
      Anio: 2021,
      Saldo: 200,
      Codigo: "123",
      Lote: "1",
      Manzana: "A",
      Nombre: "Juan",
    },
    {
      Mes: 9,
      Anio: 2021,
      Saldo: 50,
      Codigo: "123",
      Lote: "1",
      Manzana: "A",
      Nombre: "Juan",
    },
  ];

  // doc.moveTo(titleTable, 500).lineTo(550, 500).stroke();
  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("Pagos Pendientes", titleTable, 320);
  doc.moveTo(titleTable, 340).lineTo(550, 340).stroke();

  agregarPagosAnteriores(doc, pagosAnteriores, titleTable, 350);
};

const generatePdfMeasure = async (data) => {
  try {
    const doc = new PDFDocument();

    for (const item of data) {
      // Llama a generateHeaders al comienzo de cada página
      generateHeaders(doc, item);
      generateTable(doc, item);
      generateFooter(doc);
      // Agregar una nueva página para la siguiente iteración (excepto la última)
      if (item !== data[data.length - 1]) {
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

  logo(doc);

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

  logo(doc);

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

module.exports = {
  showMeasure,
  showMeter,
  showMeasureCourt,
};
