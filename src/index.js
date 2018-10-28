const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { generatePDF } = require("./generatePDF");

const app = express();

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", bodyParser.urlencoded({ extended: false }), (req, res) => {
  const allergies = Object.keys(req.body);
  const baseURL = `/pdf?${allergies.join("&")}`;
  const makeURL = lang => `${baseURL}&lang=${lang}`;
  const enURL = makeURL("en");
  const ruURL = makeURL("ru");
  const deURL = makeURL("de");
  const frURL = makeURL("fr");
  const esURL = makeURL("es");
  res.render("allergies", { allergies, enURL, ruURL, deURL, frURL, esURL });
});

app.get("/pdf", (req, res) => {
  generatePDF({ res, allergies: Object.keys(req.query), lang: req.query.lang });
});

app.get("*", (req, res) => {
  res.render("404");
});

const port = process.env.PORT || 8000;
app.listen(port, function() {
  // eslint-disable-next-line no-console
  console.log(`server is listening at port ${port}`);
  // eslint-disable-next-line no-console
  console.log(`visit it in your browser at http://127.0.0.1:${port}`);
});
