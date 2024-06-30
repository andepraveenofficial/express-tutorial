/* -----> Third Party packages <----- */
const express = require('express')  // Server-Side Web Application Framework
const path = require("path"); // file path
const {open} = require("sqlite"); // database connection
const sqlite3 = require("sqlite3"); // database driver

/* -----> create Express server Instance <----- */
const app = express();

/* -----> Handling JSON data <----- */
app.use(express.json()); 

/* -----> Database Path <----- */
const dbPath = path.join(__dirname, "./database/mydb.db")

/* -----> Connecting SQLite Database <----- */
let db = null;
const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });

        // Create a table if it doesn't exist
        await db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY,
          name TEXT,
          age INTEGER
      )`);

        /* -----> Assigning a port Number <----- */
         const port = 5000
         app.listen(port, () => {
         console.log(`app listening on port ${port}`)
          })

    }
    catch(error){
        console.log(`Database Error : ${error.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();

/* -----> Handling HTTP Request <----- */
// 00 Test
app.get('/', (request, response) => {
  response.send('Hello World!') 
})


// 01 addData
app.post('/users', async (request, response) => {
  const { name, age } = request.body;
  const query = `INSERT INTO users 
                   (name, age) 
                VALUES 
                  ("${name}", ${age});`

  try {
      const result = await db.run(query);
      response.send({ message: 'Data added successfully', id: result.lastID });
  } catch (error) {
    response.status(500).send({ error: error.message });  // SQLite method
  }
});

// 02 Get Data
app.get('/users', async (request, response) => {
  const query = `SELECT * FROM users`;
  try {
      const users = await db.all(query); // SQLite method
      response.send(users);
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});
