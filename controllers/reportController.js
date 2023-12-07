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
  generateHeadersClienteTree,
  generateHeadersClienteOneV2,
} = require("../helpers/pdf-templates");
const {
  generateTableClienteOne,
  generateTableClienteTwo,
  generateTableClienteTree,
  generateTableMeasureCourtOne,
  generateTableMeasureCourtTwo,
} = require("../helpers/pdf-tables");
const {
  getMeasurements,
  getInteresBase,
} = require("../services/reportService");

const configService = require("../services/configService");
const measureService = require("../services/measureService");
const { getFineReport, getMeasureReport } = require("../services/fineService");

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
    // getFineDetailsByIdClient
    const fineDetailsByIdClient = [];
    const INTERES_BASE = await getInteresBase();
    const ja_table = await configService.getTabla();

    // Preparar promesas para obtener mediciones y multas.
    for (let i = 0; i < data.length; i++) {
      measurementsPromises.push(getMeasurements(data[i].Codigo));
      multasPromises.push(userService.getFineByClient(data[i].idCliente));
      // fineDetailsByIdClient.push(userService.getFineDetailsByIdClient(data[i].idCliente));
    }

    // Esperar a que todas las promesas se resuelvan.
    const measurementsResults = await Promise.all(measurementsPromises);
    const multasResults = await Promise.all(multasPromises);
    // const fineDetailsByIdClientResults = await Promise.all(fineDetailsByIdClient);

    let conuntBasico = 0;
    // Procesar los datos y generar el PDF.
    for (let i = 0; i < data.length; i++) {
      const currentData = data[i];
      const currentMeasurements = measurementsResults[i];
      const currentFines = multasResults[i];

      // Decidir si se genera una tabla para un cliente o dos en la misma página.
      if (currentMeasurements.length > 4) {
        // Generar tabla que ocupa toda la hoja.
        generateHeadersClienteTree(doc, currentData);
        generateTableClienteTree(
          doc,
          currentMeasurements,
          INTERES_BASE,
          currentFines,
          ja_table
        );
      } else {
        // Generar tablas para dos clientes en la misma página si es posible.
        generateHeadersClienteOne(doc, currentData);
        generateTableClienteOne(
          doc,
          currentMeasurements,
          INTERES_BASE,
          currentFines,
          ja_table
          // fineDetailsByIdClientResults
        );

        // Verificar si hay un próximo cliente y si cabe en la misma página.
        if (i + 1 < data.length && measurementsResults[i + 1].length <= 4) {
          const nextData = data[i + 1];
          generateHeadersClienteTwo(doc, nextData);
          generateTableClienteTwo(
            doc,
            measurementsResults[i + 1],
            INTERES_BASE,
            multasResults[i + 1],
            ja_table
          );

          i++;
        }
      }

      // Añadir una nueva página si todavía hay más datos para procesar.
      if (i + 1 < data.length) {
        doc.addPage();
      }
    }

    if (process.env.NODE_ENV === "development") {
      doc.pipe(fs.createWriteStream(`${__dirname}/../file.pdf`));
    }

    doc.end();

    // Convertir el PDF a un buffer y devolverlo.
    const pdfStream = await getStream.buffer(doc);

    return pdfStream;
  } catch (error) {
    console.error("Error en la generación del PDF:", error);
    return null;
  }
};

const generateMeuserCourt = async (data, outputPath, dataAll) => {
  try {
    const doc = new PDFDocument();
    for (let i = 0; i < dataAll.length; i++) {
      if (i % 2 === 0) {
        await generateTableMeasureCourtOne(doc, dataAll[i], data);
      } else {
        await generateTableMeasureCourtTwo(doc, dataAll[i], data);
        doc.addPage();
      }
    }

    // Crea el stream de escritura y pipea el documento
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);
    doc.end(); // Asegúrate de cerrar el stream

    // Espera a que el stream de escritura termine
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // Devuelve el path del archivo creado
    return outputPath;
  } catch (error) {
    console.error("Error en la generación del PDF:", error);
    throw error;
  }
};

const showCourt = async (req, res) => {
  try {
    const data = req.body;

    //TODO: Get all customers
    const getAllCustomer = await configService.getMeasureCourt(data.meses);
    const outputPath = `${__dirname}/../confirmado.pdf`;

    // Genera el PDF y obtén el path del archivo creado
    const pdfPath = await generateMeuserCourt(data, outputPath, getAllCustomer);

    // Lee el stream desde el archivo y pipea la respuesta HTTP
    fs.createReadStream(pdfPath).pipe(res);
  } catch (error) {
    console.error("Error al mostrar la corte:", error);
    res.status(500).send("Error interno del servidor");
  }
};

const generateFineByIdCliente = async (
  countFinesByClientArray,
  getMeasureReportArray,
  outputPath
) => {
  try {
    const doc = new PDFDocument();

    generateHeadersClienteOneV2(doc, getMeasureReportArray);

    // Tabla de multas con los datos del cliente
    countFinesByClientArray.forEach((fine, index) => {
      const tableTop = 160 + index * 15; // Ajusta la posición vertical para cada fila

      // Imprimir datos de la multa en la tabla
      doc
        .fontSize(10)
        .text(fine.typeFine, 50, tableTop)
        .text(`$${fine.valor_pagar}`, 150, tableTop); // Ajusta las coordenadas según tus necesidades
    });


    // Terminar el documento
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    doc.end();

    // Espera a que el stream de escritura termine
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // Devuelve el path del archivo creado
    return outputPath;
  } catch (error) {
    console.error("Error en la generación del PDF:", error);
    return null;
  }
};

const showFine = async (req, res) => {
  try {
    const idCliente = req.params.idCliente;
    const countFinesByClientArray = await getFineReport(idCliente);
    const getMeasureReportArray = await getMeasureReport(idCliente);
    const outputPath = `${__dirname}/../fineCliente.pdf`;

    const pdfPath = await generateFineByIdCliente(
      countFinesByClientArray,
      getMeasureReportArray[0],
      outputPath
    );

    // Lee el stream desde el archivo y pipea la respuesta HTTP
    fs.createReadStream(pdfPath).pipe(res);
  } catch (error) {
    console.error("Error al mostrar la multa:", error);
    res.status(500).send("Error interno del servidor");
  }
};

const generateMeterTable = (doc, data) => {
  const titleTable = 50;
  const tableTop = 160;
  const maxRecordsPerPage = 20;

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

const generateMeterTableCourt = (doc, data = [], maxRecordsPerPage) => {
  let tableTop = 120;
  const codigoX = 50;
  const nombreX = 110;
  const loteX = 355;
  const manzanaX = 395;
  const saldoX = 450;
  const mesesX = 500;
  const headerTop = 100;

  let currentPage = 1;
  let currentRow = 0;

  // Imprimir el logo en la primera página
  if (currentPage === 1) {
    logoClientOne(doc);
  }

  // Mostrar el encabezado en todas las páginas
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Código", codigoX, headerTop)
    .text("Nombre", nombreX, headerTop)
    .text("Lote", loteX, headerTop)
    .text("Manzana", manzanaX, headerTop)
    .text("Saldo", saldoX, headerTop)
    .text("Meses", mesesX, headerTop);

  for (let i = 0; i < data.length; i++) {
    if (currentRow === maxRecordsPerPage) {
      // Cambiar de página cuando se llegue al número máximo de registros por página
      doc.addPage();
      currentRow = 0;
      tableTop = 110; // Ajustar la posición de la tabla en la nueva página
    }

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(data[i].codigo, codigoX, tableTop)
      .text(data[i].Nombre, nombreX, tableTop)
      .text(data[i].Lote, loteX, tableTop)
      .text(data[i].Manzana, manzanaX, tableTop)
      .text(`$${parseFloat(data[i].saldo).toFixed(2)}`, saldoX, tableTop)
      .text(data[i].meses, mesesX, tableTop);

    tableTop += 16;
    currentRow++;
  }
};

const getCustomerTable = (doc, data = [], maxRecordsPerPage) => {
  let tableTop = 125;
  const nombreX = 50;
  const rucX = 320;
  const firmaX = 425; // Nueva posición para la firma
  const headerTop = 100;

  let currentPage = 1;
  let currentRow = 0;

  // Imprimir el logo en la primera página
  if (currentPage === 1) {
    logoClientOne(doc);
  }

  // Mostrar el encabezado en todas las páginas
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Nombre", nombreX, headerTop)
    .text("RUC/C.I", rucX, headerTop)
    .text("Firma", firmaX, headerTop); // Agregar el encabezado para la firma

  for (let i = 0; i < data.length; i++) {
    if (currentRow === maxRecordsPerPage) {
      // Cambiar de página cuando se llegue al número máximo de registros por página
      doc.addPage();
      currentRow = 0;
      tableTop = 110; // Ajustar la posición de la tabla en la nueva página
    }

    let truncatedNombre = data[i].Nombre;
    if (truncatedNombre.length > 40) {
      truncatedNombre = truncatedNombre.substring(0, 40);
    }

    // Agregar líneas rectas para firmas
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(truncatedNombre, nombreX, tableTop)
      .text(data[i].Ruc, rucX, tableTop)
      .moveTo(firmaX, tableTop) // Mover a la posición de la firma
      .lineTo(firmaX + 100, tableTop) // Agregar una línea recta para la firma
      .stroke(); // Dibujar la línea

    tableTop += 20;
    currentRow++;
  }
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
    const maxRecordsPerPage = 35; // Número máximo de registros por página
    const totalPages = Math.ceil(data.length / maxRecordsPerPage);

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        doc.addPage();
      }

      const currentPageData = data.slice(
        i * maxRecordsPerPage,
        (i + 1) * maxRecordsPerPage
      ); // Obtén los datos para la página actual
      generateMeterTableCourt(doc, currentPageData, maxRecordsPerPage);
    }

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

const generatePdfCustomer = async (data) => {
  try {
    // SELECT Nombre,Ruc,Email FROM Cliente
    const doc = new PDFDocument();
    const maxRecordsPerPage = 30; // Número máximo de registros por página
    const totalPages = Math.ceil(data.length / maxRecordsPerPage);

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        doc.addPage();
      }

      const currentPageData = data.slice(
        //Sirve para cortar el array en el numero de registros que se le pase por parametro
        i * maxRecordsPerPage,
        (i + 1) * maxRecordsPerPage
      ); // Obtén los datos para la página actual
      getCustomerTable(doc, currentPageData, maxRecordsPerPage);
    }

    if (process.env.NODE_ENV === "development") {
      doc.pipe(fs.createWriteStream(`${__dirname}/../customerview.pdf`));
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
  const getAllMetersCute = await measureService.execCorte();
  const pdfStream = await generatePdfMeter(getAllMetersCute);
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

const showCustomer = async (req, res) => {
  const getAllCustomer = await configService.getAllClients();
  const pdfStream = await generatePdfCustomer(getAllCustomer);
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

  res.json({
    registros,
  });
};

module.exports = {
  showMeasure,
  showMeter,
  showMeasureCourt,
  showCustomer,
  calculoIntrest,
  showCourt,
  showFine,
};
