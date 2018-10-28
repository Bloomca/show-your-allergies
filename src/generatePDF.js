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

module.exports.generatePDF = ({ res, allergies }) => {
  const docDefinition = {
    content: [
      "First paragraph",
      "Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines",
      ...renderAllergies({ allergies, lang: "en" })
    ]
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(res);
  pdfDoc.end();
};

const EXPLANATIONS = {
  milk: {
    en: "NO MILK"
  },
  eggs: {
    en: "NO EGGS"
  },
  nuts: {
    en: "NO NUTS"
  },
  shellfish: {
    en: "NO SHELLFISH"
  },
  gluten: {
    en: "NO GLUTEN"
  },
  soy: {
    en: "NO SOY"
  },
  fish: {
    en: "NO FISH"
  }
};

function renderAllergies({ allergies, lang }) {
  return allergies.map(allergy => EXPLANATIONS[allergy][lang]);
}
