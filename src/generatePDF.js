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
  vegetarian: {
    en: [
      makeHeader("I am vegeterian"),
      makeDescription("I don't eat any kind of meat, fish or shellfish")
    ],
    ru: [
      makeHeader("Я ветегерианец"),
      makeDescription("Я не ем мясо всех видов, рыбу и моллюсков")
    ],
    de: [
      makeHeader("ich bin Vegetarier"),
      makeDescription("Ich esse keine Fleisch, Fisch oder Schaltier")
    ],
    fr: [
      makeHeader("Je suis végétarien(ne)"),
      makeDescription(
        "Je ne mange pas de viande, de poisson ou de fruit de mer"
      )
    ]
  },
  vegan: {
    en: [
      makeHeader("I am vegan"),
      makeDescription(
        "I don't eat any kind of meat, fish or shellfish, dairy products and eggs (both white eggs and yolks)"
      )
    ],
    ru: [
      makeHeader("У меня веганский рацион"),
      makeDescription(
        "Я не ем мясо всех видов, рыбу и моллюсков, любые молочные продукты и яйца (белки и желтки)"
      )
    ],
    de: [
      makeHeader("Ich bin Veganer"),
      makeDescription(
        "Ich esse keine Fleisch, Fisch oder Schaltier, Molkerei und Eier"
      )
    ],
    fr: [
      makeHeader("Je suis végétalien(ne)"),
      makeDescription(
        "Je ne mange aucun type de viande, de poisson ou de fruit de mer, de produits laitiers et d'œufs (blancs d’œufs et jaunes)"
      )
    ]
  },
  milk: {
    en: [
      makeHeader("No dairy products"),
      makeDescription(
        "Products like milk, cheese, butter, ice cream, cream, yogurt…"
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
    ],
    fr: [
      makeHeader("Aucun produit laitier"),
      makeDescription(
        "Des produits comme le lait, le fromage, le beurre, la crème glacée, la crème, le yaourt…"
      )
    ]
  },
  eggs: {
    en: [makeHeader("No eggs"), makeDescription("No egg whites or yolks")],
    ru: [makeHeader("Без яиц"), makeDescription("Без белка и желтка")],
    de: [
      makeHeader("Keine Eier"),
      makeDescription("Keine Eigelb und weißes Ei")
    ],
    fr: [
      makeHeader("Pas d'oeufs"),
      makeDescription("Pas blancs d'oeufs ou jaunes")
    ]
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
    ],
    fr: [
      makeHeader("Pas de noix"),
      makeDescription(
        "Pas d'arachides, amandes, noix de cajou, noix, pistaches, noix du brésil, noix de macadamia, noix de pin"
      )
    ]
  },
  shellfish: {
    en: [
      makeHeader("No shellfish"),
      makeDescription(
        "No products like shrimp, crayfish, lobster, squid, scallops"
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
    ],
    fr: [
      makeHeader("Pas de fruit de mer"),
      makeDescription(
        "Aucun produit comme les crevettes, le crabe, le homard, les calmars, les pétoncles"
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
    ],
    fr: [
      makeHeader("Sans gluten ni blé"),
      makeDescription(
        "Le blé contient du gluten, donc pas de blé s'il vous plaît, et d'autres produits contenant du gluten"
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
    ],
    fr: [
      makeHeader("Sans soja"),
      makeDescription(
        "Aucun produit comme le soja et les produits à base de soja comme le lait de soja ou la sauce soja"
      )
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
    ],
    fr: [
      makeHeader("Pas de poisson"),
      makeDescription(
        "Pas de poissons avec des nageoires - s’il vous plaît notez bien que c'est différent de fruit de mer!"
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
      "Если что-то готовится на этом продукте, или в соусе – это тоже не подходит, даже небольшое количество способно мне навредить.",
      "Это очень важно для моего здоровья – я не хочу портить своё время плохим самочувствием или походом к врачу.",
      lastLine("Большое спасибо!")
    ];
  }

  if (lang === "de") {
    return [
      greetings("Hallo!"),
      "Ich habe eine Allergie für einige Arten von Lebensmitteln, und können Sie bitte prüfen, dass es keine in meine Bestellung gibt.",
      "Falls Sie kochen mit ihnen, oder es in Soße ist, das ist nicht gut auch – sogar kleine Mengen können schlecht für mich sein.",
      "Das ist sehr wichtig für meine Gesundheit – ich will nicht meine Zeit zerstören mit schlechte Gefühl oder mit Arzttermin.",
      lastLine("Danke schön!")
    ];
  }

  if (lang === "fr") {
    return [
      greetings("Bonjour!"),
      "Je souffre d'allergies alimentaires. S’il vous plaît, assurez-vous que les produits que je commande ne les contiennent pas.",
      "Si vous cuisinez avec ces produits ou si une sauce en contient, je ne peux pas le manger. Même les plus petits montant peut me faire mal!",
      "C'est très important pour ma santé - Je ne veux pas tomber malade ni aller à l'hôpital.",
      lastLine("Merci beaucoup!")
    ];
  }

  // we render english version if we don't have info for this lang.
  return [
    greetings("Hello!"),
    "I have food allergies, please make sure that products I order don't contain them.",
    "If you cook on these products, or a sauce contains it – I cannot eat it. Even small amount can hurt me.",
    "It is very important for my health – I don't want to ruin my time not feeling good or going to the hospital.",
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
