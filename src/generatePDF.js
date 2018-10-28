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

module.exports.generatePDF = ({ res, allergies, lang }) => {
  const docDefinition = {
    content: [
      ...renderHeader(lang),
      ...renderAllergies({ allergies, lang }).reduce(
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
    ],
    ru: [
      "Без молочных продуктов",
      "Такие продукты, как молоко, сыр, масло, мороженое, сливки, йогурт, маргарин"
    ]
  },
  eggs: {
    en: ["No eggs", "No white eggs or yolks"],
    ru: ["Без яиц", "Без белка и желтка"]
  },
  nuts: {
    en: [
      "No nuts",
      "No peanuts, almonds, cashews, walnuts, pistachios, brazil nuts, macadamia nuts, pine nuts"
    ],
    ru: [
      "Без орехов",
      "Арахис, миндаль, кешью, грецкие орехи, фисташки, бразильский орех, орехи макадамии, кедровые орешки"
    ]
  },
  shellfish: {
    en: [
      "No shellfish",
      "No products like shrimp, prawns, crayfish, lobster, squid, scallops"
    ],
    ru: [
      "Без моллюсков",
      "Такие продукты, как креветки, пильчатые креветки, раки, лобстеры, кальмары и морские гребешки"
    ]
  },
  gluten: {
    en: [
      "No gluten or wheat",
      "Wheat contains gluten, so no wheat please, and other products with gluten"
    ],
    ru: [
      "Без глютена и пшеницы",
      "Пшеница содержит глютен, поэтому без пшеницы, пожалуйста, и других продуктов с глютеном"
    ]
  },
  soy: {
    en: [
      "No soy",
      "No products like soybeans and soy products like soy milk or soy sauce"
    ],
    ru: [
      "Без сои",
      "Такие продукты, как соевое молоко, соевый соус или соевые бобы"
    ]
  },
  fish: {
    en: [
      "No fish",
      "No fish with fins – please note that it is different from shellfish!"
    ],
    ru: [
      "Без рыбы",
      "Без рыбы с плавниками – заметьте, моллюски не входят в эту категорию"
    ]
  }
};

function renderHeader(lang) {
  if (lang === "ru") {
    return [
      "Здравствуйте!",
      "У меня есть аллергия на некоторые виды еды, поэтому, пожалуйста, проверьте, что их нет в моём заказе.",
      "Это очень важно для моего здоровья – я не хочу портить своё время плохим самочувствием или походом к врачу.",
      "Большое спасибо!"
    ];
  }

  // we render english version if we don't have info for this lang.
  return [
    "Hello!",
    "I have food allergies, please make sure that products I order don't contain them.",
    "It is very important for my health – I don't want to ruin my time with not well-being or visiting a doctor.",
    "Thanks a lot!"
  ];
}

function renderAllergies({ allergies, lang }) {
  return allergies.map(
    allergy => EXPLANATIONS[allergy] && EXPLANATIONS[allergy][lang]
  );
}
