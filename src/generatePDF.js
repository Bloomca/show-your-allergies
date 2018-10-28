const path = require("path");
const pdfMakePrinter = require("pdfmake/src/printer");

var fontDescriptors = {
  Roboto: {
    normal: path.join(__dirname, "fonts", "Roboto-Regular.ttf"),
    bold: path.join(__dirname, "fonts", "Roboto-Medium.ttf"),
    italics: path.join(__dirname, "fonts", "Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "fonts", "Roboto-MediumItalic.ttf")
  }
};

const printer = new pdfMakePrinter(fontDescriptors);

var docDefinition = {
  content: [
    "First paragraph",
    "Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines"
  ]
};

module.exports.generatePDF = ({ res }) => {
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(res);
  pdfDoc.end();
};
