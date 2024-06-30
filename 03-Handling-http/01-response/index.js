/* -----> Third Party packages <----- */
const express = require("express"); 

/* -----> Create express Instance <----- */
const app = express();

/* -----> Handling HTTP Request <----- */

// 00 Test
app.get("/", (request, response) => {
    console.log("Hello World");
    response.send("Hello world");
});


// 01 send -> send some data -> response.send(data);
app.get("/data", (request, response) => {
    const data = {
        name: "Ande Praveen",
        age: 28
    }
   response.send(data);
})

// 02 sendStatus -> send status code -> response.status(code);
app.get("/status", (request, response) => {
    response.sendStatus(200);
})

// 03 sendFile -> sending a File -> response.sendFile(PATH, {root: __dirname });
app.get("/file", (request, response) => {
    response.sendFile("./Assets/page.html", {root: __dirname })
})


/* -----> Assigning a port Number <----- */
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

