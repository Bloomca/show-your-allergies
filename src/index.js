const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { generatePDF } = require("./generatePDF");

const app = express();

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "jey", message: "12" });
});

app.post("/create", bodyParser.urlencoded({ extended: false }), (req, res) => {
  const allergies = Object.keys(req.body);
  const url = `/pdf?${allergies.join("&")}`;
  res.render("allergies", { allergies, url });
});

app.get("/pdf", (req, res) => {
  generatePDF({ res, allergies: Object.keys(req.query) });
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
