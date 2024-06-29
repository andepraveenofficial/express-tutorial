/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework
const addDays = require("date-fns/addDays"); // date utility library

/* -----> creating Express server Instance <----- */
const app = express();

/* -----> Handling HTTP Request <----- */
// app.METHOD(PATH, HANDLER)

app.get("/", (request, response) => {
  const todayDate = new Date();
  const resultDate = addDays(todayDate, 100);
  const day = resultDate.getDate();
  const month = resultDate.getMonth();
  const year = resultDate.getFullYear();

  const output = `${day}/${month + 1}/${year}`;
  response.send(output);
});

/* -----> Assigning a port Number <----- */
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

/* -----> Default Exporting <----- */
module.exports = app;
