const path = require("path");
const express = require("express");
const app = express();

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "pug");

app.get("*", (req, res) => {
  res.render("index", { title: "jey", message: "12" });
});

const port = process.env.PORT || 8000;
app.listen(port, function() {
  // eslint-disable-next-line no-console
  console.log(`server is listening at port ${port}`);
});
