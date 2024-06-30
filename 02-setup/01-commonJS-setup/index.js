/* -----> Third Party packages <----- */
const express = require('express')  // Server-Side Web Application Framework

/* -----> create Express server Instance <----- */
const app = express();

/* -----> Handling HTTP Request <----- */
app.get('/', (req, res) => {
  res.send('Hello World!') 
})

/* -----> Assigning a port Number <----- */
const port = 5000
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

