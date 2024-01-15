const logoClientOne = (doc) => {
  const logoX = 50;
  const logoWidth = 50;
  const logoText = "JUNTOS POR EL AGUA";
  const subText = "URBANIZACION EL PORTON";
  const textColor = "#000";
  const fontSizeLarge = 20;
  const fontSizeSmall = 10;
  const fontBold = "Helvetica-Bold";
  const fontRegular = "Helvetica";

  doc
    .image("assets/logo2.png", logoX, 20, { width: logoWidth })
    .fillColor(textColor)
    .fontSize(fontSizeLarge)
    .font(fontBold)
    .text(logoText, logoX, 30, { align: "center" })
    .fontSize(fontSizeSmall)
    .text(subText, { align: "center" })
    .moveDown();
};

const logoClientTwo = (doc) => {
  const logoX = 50;
  const logoWidth = 50;
  const logoText = "JUNTOS POR EL AGUA";
  const subText = "URBANIZACION EL PORTON";
  const textColor = "#000";
  const fontSizeLarge = 20;
  const fontSizeSmall = 10;
  const fontBold = "Helvetica-Bold";
  const fontRegular = "Helvetica";

  doc
    .image("assets/logo2.png", logoX, 410, { width: logoWidth })
    .fillColor(textColor)
    .fontSize(fontSizeLarge)
    .font(fontBold)
    .text(logoText, logoX, 420, { align: "center" })
    .fontSize(fontSizeSmall)
    .text(subText, { align: "center" })
    .moveDown();
};

const generateHeadersClienteOne = (doc, factura) => {
  try {
    logoClientOne(doc);
    logoClientTwo(doc);
    const inicioPagina = 50;
    const finPagina = 550;
    const headerY = 75;
    const defaultFont = "Helvetica";
    const boldFont = "Helvetica-Bold";
    const leftColumnX = inicioPagina;
    const middleColumnX = inicioPagina + 220;
    const rightColumnX = inicioPagina + 320;
    const firstRowY = 85;
    const secondRowY = 100;
    const thirdRowY = 115;
    const separatorY = 130;

    doc.moveTo(inicioPagina, headerY).lineTo(finPagina, headerY).stroke();
    // Columna izquierda (negrita)
    doc.font(boldFont).text("Nombre:", leftColumnX, firstRowY, { width: 500 });
    doc.font(boldFont).text("Direccion:", leftColumnX, secondRowY);
    doc.font(boldFont).text("Manzana:", leftColumnX, thirdRowY);
    // Columna derecha (fuente predeterminada)
    doc.font(defaultFont).text(factura.Nombre, leftColumnX + 80, firstRowY);
    doc.font(defaultFont).text("El Porton", leftColumnX + 80, secondRowY);
    doc.font(defaultFont).text(factura.Manzana, leftColumnX + 80, thirdRowY);
    // Columna del medio (negrita)
    doc.font(boldFont).text("Lote:", middleColumnX, secondRowY);
    doc.font(boldFont).text("Medidor:", middleColumnX, thirdRowY);

    // Columna de la mitad derecha (fuente predeterminada)
    doc.font(defaultFont).text(factura.Lote, rightColumnX, secondRowY);
    doc.font(defaultFont).text(factura.Codigo, rightColumnX, thirdRowY);
    doc.moveTo(inicioPagina, separatorY).lineTo(finPagina, separatorY).stroke();
  } catch (error) {
    // Manejo de errores
    console.error("Ha ocurrido un error:", error);
    // O puedes manejar el error de otra manera más adecuada para tu caso
  }
};

const generateHeadersClienteTwo = (doc, factura) => {
  try {
    const logoY = 200; // Ajusta esto según la posición en Y donde deseas que comience el encabezado
    const inicioPagina = 50;
    const finPagina = 550;
    const headerY = logoY + 270; // Ajusta esto según la posición en Y donde deseas que comience el encabezado
    const defaultFont = "Helvetica";
    const boldFont = "Helvetica-Bold";
    const leftColumnX = inicioPagina;
    const middleColumnX = inicioPagina + 220;
    const rightColumnX = inicioPagina + 320;
    const firstRowY = headerY + 10;
    const secondRowY = headerY + 25;
    const thirdRowY = headerY + 40;
    const separatorY = headerY + 55;

    doc.moveTo(inicioPagina, headerY).lineTo(finPagina, headerY).stroke();
    // Columna izquierda (negrita)
    doc.font(boldFont).text("Nombre:", leftColumnX, firstRowY, { width: 500 });
    doc.font(boldFont).text("Direccion:", leftColumnX, secondRowY);
    doc.font(boldFont).text("Manzana:", leftColumnX, thirdRowY);
    // Columna derecha (fuente predeterminada)
    doc.font(defaultFont).text(factura.Nombre, leftColumnX + 80, firstRowY);
    doc.font(defaultFont).text("El Porton", leftColumnX + 80, secondRowY);
    doc.font(defaultFont).text(factura.Manzana, leftColumnX + 80, thirdRowY);
    // Columna del medio (negrita)
    doc.font(boldFont).text("Lote:", middleColumnX, secondRowY);
    doc.font(boldFont).text("Medidor:", middleColumnX, thirdRowY);

    // Columna de la mitad derecha (fuente predeterminada)
    doc.font(defaultFont).text(factura.Lote, rightColumnX, secondRowY);
    doc.font(defaultFont).text(factura.Codigo, rightColumnX, thirdRowY);
    doc.moveTo(inicioPagina, separatorY).lineTo(finPagina, separatorY).stroke();
  } catch (error) {
    // Manejo de errores
    console.error("Ha ocurrido un error:", error);
    // O puedes manejar el error de otra manera más adecuada para tu caso
  }
};


const generateHeadersClienteTree = (doc, factura) => {
  try {
    logoClientOne(doc);
    const inicioPagina = 50;
    const finPagina = 550;
    const headerY = 75;
    const defaultFont = "Helvetica";
    const boldFont = "Helvetica-Bold";
    const leftColumnX = inicioPagina;
    const middleColumnX = inicioPagina + 220;
    const rightColumnX = inicioPagina + 320;
    const firstRowY = 85;
    const secondRowY = 100;
    const thirdRowY = 115;
    const separatorY = 130;

    doc.moveTo(inicioPagina, headerY).lineTo(finPagina, headerY).stroke();
    // Columna izquierda (negrita)
    doc.font(boldFont).text("Nombre:", leftColumnX, firstRowY, { width: 500 });
    doc.font(boldFont).text("Direccion:", leftColumnX, secondRowY);
    doc.font(boldFont).text("Manzana:", leftColumnX, thirdRowY);
    // Columna derecha (fuente predeterminada)
    doc.font(defaultFont).text(factura.Nombre, leftColumnX + 80, firstRowY);
    doc.font(defaultFont).text("El Porton", leftColumnX + 80, secondRowY);
    doc.font(defaultFont).text(factura.Manzana, leftColumnX + 80, thirdRowY);
    // Columna del medio (negrita)
    doc.font(boldFont).text("Lote:", middleColumnX, secondRowY);
    doc.font(boldFont).text("Medidor:", middleColumnX, thirdRowY);

    // Columna de la mitad derecha (fuente predeterminada)
    doc.font(defaultFont).text(factura.Lote, rightColumnX, secondRowY);
    doc.font(defaultFont).text(factura.Codigo, rightColumnX, thirdRowY);
    doc.moveTo(inicioPagina, separatorY).lineTo(finPagina, separatorY).stroke();
  } catch (error) {
    // Manejo de errores
    console.error("Ha ocurrido un error:", error);
    // O puedes manejar el error de otra manera más adecuada para tu caso
  }
};

const generateHeadersClienteOneV2 = (doc, factura) => {
  try {
    logoClientOne(doc);
    const inicioPagina = 50;
    const finPagina = 550;
    const headerY = 75;
    const defaultFont = "Helvetica";
    const boldFont = "Helvetica-Bold";
    const leftColumnX = inicioPagina;
    const middleColumnX = inicioPagina + 220;
    const rightColumnX = inicioPagina + 320;
    const firstRowY = 85;
    const secondRowY = 100;
    const thirdRowY = 115;
    const separatorY = 130;

    doc.moveTo(inicioPagina, headerY).lineTo(finPagina, headerY).stroke();
    // Columna izquierda (negrita)
    doc.font(boldFont).text("Nombre:", leftColumnX, firstRowY, { width: 500 });
    doc.font(boldFont).text("Direccion:", leftColumnX, secondRowY);
    doc.font(boldFont).text("Manzana:", leftColumnX, thirdRowY);
    // Columna derecha (fuente predeterminada)
    doc.font(defaultFont).text(factura.Nombre, leftColumnX + 80, firstRowY);
    doc.font(defaultFont).text("El Porton", leftColumnX + 80, secondRowY);
    doc.font(defaultFont).text(factura.Manzana, leftColumnX + 80, thirdRowY);
    // Columna del medio (negrita)
    doc.font(boldFont).text("Lote:", middleColumnX, secondRowY);
    doc.font(boldFont).text("Medidor:", middleColumnX, thirdRowY);

    // Columna de la mitad derecha (fuente predeterminada)
    doc.font(defaultFont).text(factura.Lote, rightColumnX, secondRowY);
    doc.font(defaultFont).text(factura.Codigo, rightColumnX, thirdRowY);
    doc.moveTo(inicioPagina, separatorY).lineTo(finPagina, separatorY).stroke();
  } catch (error) {
    // Manejo de errores
    console.error("Ha ocurrido un error:", error);
    // O puedes manejar el error de otra manera más adecuada para tu caso
  }
};

module.exports = {
  logoClientOne,
  logoClientTwo,
  generateHeadersClienteOne,
  generateHeadersClienteTwo,
  generateHeadersClienteTree,
  generateHeadersClienteOneV2
};
