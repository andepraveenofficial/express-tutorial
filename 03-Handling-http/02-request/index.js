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


// 01 Dynamic Parameter
app.get("/users/:userId", (request, response) => {
    const {userId} = request.params
    console.log(userId);
    response.send(`User ID: ${userId}`)
})


// 02 Query Parameter
app.get("/users", (request, response) => {
    const queryParameters = request.query;
    console.log(queryParameters);  // { offset: '2', limit: '5' }
    const {offset, limit} = queryParameters
    response.send(`Offset: ${offset}, Limit: ${limit}`)
})

/* -----> Assigning a port Number <----- */
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
