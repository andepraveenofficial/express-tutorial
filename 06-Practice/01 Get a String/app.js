/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework

/* -----> creating Express server Instance <----- */
const app = express();

/* -----> Handling HTTP Request <----- */
// app.METHOD(PATH, HANDLER)

app.get("/", (request, response) => {
  response.send("Express JS");
});

/* -----> Assigning a port Number <----- */
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

/* -----> Default Exporting <----- */
module.exports = app;
