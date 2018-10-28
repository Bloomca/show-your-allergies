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
  res.send(
    '<a href="/">home</a><br/><a href="/pdf" download="my_some.pdf">download PDF</a>'
  );
});

app.get("/pdf", (req, res) => {
  generatePDF({ res });
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

/**
 * https://www.healthline.com/nutrition/common-food-allergies
 * 1. milk (or dairy products in general)
 * 2. eggs
 * 3. tree nuts (PEANUTS are different, but better to keep here)
 * 4. Shellfish
 * 5. gluten (wheat)
 * 6. soy
 * 7. fish
 */
