/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework

/* -----> creating Express server Instance <----- */
const app = express();

/* -----> Handling HTTP Request <----- */
// app.METHOD(PATH, HANDLER)
app.get("/gadgets", (request, response) => {
  response.sendFile("./gadgets.html", { root: __dirname }); // Sending a File
});

/* -----> Assigning a port Number <----- */
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

/* -----> Default Exporting <----- */
module.exports = app;
