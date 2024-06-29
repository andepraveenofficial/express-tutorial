/* -----> Third Party packages <----- */
const express = require("express"); // Server-Side  Web Application Framework

/* -----> Create express Instance <----- */
const app = express();

/* -----> Handling HTTP Request <----- */
app.get("/", (request, response) => {
    response.send("Hello world");
});

// sending a File
// response.sendFile(PATH, {root: __dirname });
app.get("/page", (request, response) => {
    response.sendFile("./page.html", {root: __dirname });
})

/* -----> Assigning a port Number <----- */
app.listen(3004, () => {
    console.log('Server listening on port 3004');
});

