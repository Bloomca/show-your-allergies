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
      "Hello",
      "I have food allergies, please make sure that products I order don't contain them:",
      ...renderAllergies({ allergies, lang: "en" }).reduce(
        (arr, text) => arr.concat(text),
        []
      )
    ]
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(res);
  pdfDoc.end();
};

const EXPLANATIONS = {
  milk: {
    en: [
      "No dairy products",
      "products like milk, cheese, butter, ice cream, cream, yogurt, margarine"
    ]
  },
  eggs: {
    en: ["No eggs", "No white eggs or yolks"]
  },
  nuts: {
    en: [
      "No nuts",
      "No peanuts, almonds, cashews, walnuts, pistachios, brazil nuts, macadamia nuts, pine nuts"
    ]
  },
  shellfish: {
    en: [
      "No shellfish",
      "No products like shrimp, prawns, crayfish, lobster, squid, scallops"
    ]
  },
  gluten: {
    en: [
      "No gluten or wheat",
      "Wheat contains gluten, so no wheat please, and other products with gluten"
    ]
  },
  soy: {
    en: [
      "No soy",
      "No products like soybeans and soy products like soy milk or soy sauce"
    ]
  },
  fish: {
    en: ["No fish", "No fish with fins – different from shellfish!"]
  }
};

function renderAllergies({ allergies, lang }) {
  return allergies.map(allergy => EXPLANATIONS[allergy][lang]);
}
