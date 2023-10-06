const { request, response } = require("express");
const getStream = require("get-stream");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const userService = require("../services/reportService");
const Response = require("../helpers/response");

const generateFooter = (doc) => {
  doc.fontSize(10).text("El Porton - Junta de Agua - 2023", 50, 690, {
    align: "center",
    width: 500,
  });
};

const generateHeaders = (doc, factura) => {
  const logoX = (doc.page.width - 50) / 2;
  doc
    .image("assets/logo.png", logoX, 0, { width: 50, align: "center" })
    .fillColor("#000")
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("El Porton", { align: "center" })
    .fontSize(10)
    .text("Junta de Agua", { align: "center" })
    .moveDown();

  const inicioPagina = 50;
  const finPagina = 550;

  doc.moveTo(inicioPagina, 125).lineTo(finPagina, 125).stroke();
  // Columna izquierda (negrita)
  doc.font("Helvetica-Bold").text("Nombre:", inicioPagina, 130);
  doc.font("Helvetica-Bold").text("Direccion:", inicioPagina, 145);
  doc.font("Helvetica-Bold").text("Manzana:", inicioPagina, 160);
  // Columna derecha (fuente predeterminada)
  doc.font("Helvetica").text(factura.Nombre, inicioPagina + 80, 130);
  doc.font("Helvetica").text('El Porton',inicioPagina + 80, 145);
  doc.font("Helvetica").text(factura.Manzana, inicioPagina + 80, 160);
  // Columna del medio (negrita)
  doc.font("Helvetica-Bold").text("Lote:", inicioPagina + 220, 145);
  doc.font("Helvetica-Bold").text("Medidor:", inicioPagina + 220, 160);

  // Columna de la mitad derecha (fuente predeterminada)
  doc.font("Helvetica").text(factura.Lote, inicioPagina + 320, 145);
  doc.font("Helvetica").text(factura.Codigo, inicioPagina + 320, 160);
  doc.moveTo(inicioPagina, 175).lineTo(finPagina, 175).stroke();
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
  doc.font("Helvetica-Bold").fontSize(16).text("Consumo de Agua", titleTable, 200);
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
  .font("Helvetica").fontSize(10)
  .text(data.Mes, fechaX, tableTop + 25)
  .text(data.LecturaAnterior, lecturaAnteriorX, tableTop + 25)
  .text(data.LecturaActual, lecturaActualX, tableTop + 25)
  .text(data.LecturaActual - data.LecturaAnterior, consumoX, tableTop + 25)
  .text('S/N', observacionX, tableTop + 25)
  .text('$'+data.Total, totalX, tableTop + 25);
  

};

const generatePdf = async (data) => {
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

const show = async (req, res) => {
  const bodyArray = req.body; 

  const pdfStream = await generatePdf(bodyArray);
  res
    .writeHead(200, {
      "Content-Length": Buffer.byteLength(pdfStream),
      "Content-Type": "application/pdf",
      "Content-disposition": "attachment;filename=test.pdf",
    })
    .end(pdfStream);
};

module.exports = {
  show,
};
