const express = require("express");
const app = express();
const port = 3000;
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  let siteName = "Adidas";
  let searchText = "Search Now";
  res.render("index", { siteName: siteName, searchText: searchText });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
