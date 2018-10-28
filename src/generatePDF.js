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
  const date = new Date().toDateString();
  const docDefinition = {
    info: {
      title: "Food allergies",
      author: "seva zaikov <seva.zaikov@gmail.com>",
      subject: "Food allergies list",
      keywords: "food allergies, allergens",
      creator: "seva zaikov <seva.zaikov@gmail.com>",
      producer: "seva zaikov <seva.zaikov@gmail.com>",
      creationDate: date,
      modDate: date,
      language: lang
    },
    header: {
      text: "https://allergy-checker.2018.nodeknockout.com",
      alignment: "center",
      margin: [0, 20, 0, 20],
      decoration: "underline",
      color: "#3490dc"
    },
    footer: renderFooter(),
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
      makeHeader("No dairy products"),
      makeDescription(
        "Products like milk, cheese, butter, ice cream, cream, yogurt, margarine"
      )
    ],
    ru: [
      makeHeader("Без молочных продуктов"),
      makeDescription(
        "Такие продукты, как молоко, сыр, масло, мороженое, сливки, йогурт, маргарин"
      )
    ],
    de: [
      makeHeader("Keine Molkerei"),
      makeDescription(
        "Produkten wie Milch, Käse, Butter, Eis, Sahne, Joghurt, Margarine"
      )
    ]
  },
  eggs: {
    en: [makeHeader("No eggs"), makeDescription("No white eggs or yolks")],
    ru: [makeHeader("Без яиц"), makeDescription("Без белка и желтка")]
  },
  nuts: {
    en: [
      makeHeader("No nuts"),
      makeDescription(
        "No peanuts, almonds, cashews, walnuts, pistachios, brazil nuts, macadamia nuts, pine nuts"
      )
    ],
    ru: [
      makeHeader("Без орехов"),
      makeDescription(
        "Арахис, миндаль, кешью, грецкие орехи, фисташки, бразильский орех, орехи макадамии, кедровые орешки"
      )
    ],
    de: [
      makeHeader("Keine Nüsse"),
      makeDescription(
        "Erdnuss, Mandel, Cashew, Walnuss, Pistazie, Paranuss, Macadamianuss, Pinienkern"
      )
    ]
  },
  shellfish: {
    en: [
      makeHeader("No shellfish"),
      makeDescription(
        "No products like shrimp, prawns, crayfish, lobster, squid, scallops"
      )
    ],
    ru: [
      makeHeader("Без моллюсков"),
      makeDescription(
        "Такие продукты, как креветки, пильчатые креветки, раки, лобстеры, кальмары и морские гребешки"
      )
    ],
    de: [
      makeHeader("Keine Schaltier"),
      makeDescription(
        "Produkten wie Garnele, Krabbe, Flusskrebs, Hummer, Tintenfisch, Jakobsmuscheln"
      )
    ]
  },
  gluten: {
    en: [
      makeHeader("No gluten or wheat"),
      makeDescription(
        "Wheat contains gluten, so no wheat please, and other products with gluten"
      )
    ],
    ru: [
      makeHeader("Без глютена и пшеницы"),
      makeDescription(
        "Пшеница содержит глютен, поэтому без пшеницы, пожалуйста, и других продуктов с глютеном"
      )
    ],
    de: [
      makeHeader("Keine Gluten und Weizen"),
      makeDescription(
        "Weizen hat Gluten, deshalb keine Weizen, bitte, und andere Produkten mit Gluten"
      )
    ]
  },
  soy: {
    en: [
      makeHeader("No soy"),
      makeDescription(
        "No products like soybeans and soy products like soy milk or soy sauce"
      )
    ],
    ru: [
      makeHeader("Без сои"),
      makeDescription(
        "Такие продукты, как соевое молоко, соевый соус или соевые бобы"
      )
    ],
    de: [
      makeHeader("Keine Soja"),
      makeDescription("Produkten wie Soja Milch, Soyasoße und Sojabohnen")
    ]
  },
  fish: {
    en: [
      makeHeader("No fish"),
      makeDescription(
        "No fish with fins – please note that it is different from shellfish!"
      )
    ],
    ru: [
      makeHeader("Без рыбы"),
      makeDescription(
        "Без рыбы с плавниками – заметьте, моллюски не входят в эту категорию"
      )
    ],
    de: [
      makeHeader("Keine Fisch"),
      makeDescription(
        "Ohne Fisch mit Flossen – bitte achten, dass es anders als Schaltier ist!"
      )
    ]
  }
};

function makeHeader(text) {
  return { text, fontSize: 18, bold: true, margin: [0, 0, 0, 5] };
}

function makeDescription(text) {
  return { text, margin: [0, 0, 0, 10] };
}

function renderHeader(lang) {
  const greetings = text => ({
    text,
    fontSize: 18,
    bold: true,
    margin: [0, 20, 0, 10]
  });
  const lastLine = text => ({ text, margin: [0, 0, 0, 20] });
  if (lang === "ru") {
    return [
      greetings("Здравствуйте!"),
      "У меня есть аллергия на некоторые виды еды, поэтому, пожалуйста, проверьте, что их нет в моём заказе.",
      "Это очень важно для моего здоровья – я не хочу портить своё время плохим самочувствием или походом к врачу.",
      lastLine("Большое спасибо!")
    ];
  }

  if (lang === "de") {
    return [
      greetings("Hallo!"),
      "Ich habe eine Allergie für einige Arten von Lebensmitteln, und können Sie bitte prüfen, dass es keine in meine Bestellung gibt.",
      "Das ist sehr wichtig für meine Gesundheit – ich will nicht meine Zeit zerstören mit schlechte Gefühl oder mit Arzttermin.",
      lastLine("Danke schön!")
    ];
  }

  // we render english version if we don't have info for this lang.
  return [
    greetings("Hello!"),
    "I have food allergies, please make sure that products I order don't contain them.",
    "It is very important for my health – I don't want to ruin my time not feeling good or visiting a doctor.",
    lastLine("Thanks a lot!")
  ];
}

function renderFooter() {
  return {
    columns: [
      { text: "Food allergy list", margin: [40, 0, 0, 0] },
      {
        text: "seva.zaikov@gmail.com",
        alignment: "right",
        margin: [0, 0, 40, 0]
      }
    ]
  };
}

function renderAllergies({ allergies, lang }) {
  return allergies.map(
    allergy => EXPLANATIONS[allergy] && EXPLANATIONS[allergy][lang]
  );
}
