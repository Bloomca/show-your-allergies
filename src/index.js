const express = require("express");
const app = express();

app.set("views", "./templates");
app.set("view engine", "pug");

app.get("*", (req, res) => {
  res.render("index", { title: "jey", message: "12" });
});

app.listen(8000);
