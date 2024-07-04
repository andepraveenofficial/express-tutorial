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
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               first_name TEXT NOT NULL,
               last_name TEXT NOT NULL,
               email TEXT NOT NULL UNIQUE,
               gender TEXT NOT NULL,
               state TEXT
             );
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

 // 00 API -> Test
 app.get('/', (request, response) => {
    console.log("Hello World")
    response.send('Hello World') 
 })
 


// 01 API -> filter users by id
app.get('/api/users/id/:id',async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM users WHERE id = ${id}`;
    const result = await db.get(query);
    res.send(result)
  });
  
  // 02 API -> filter users by first name
  app.get('/api/users/first_name/:first_name', async (req, res) => {
    const { first_name } = req.params;
    const query = `SELECT * FROM users WHERE first_name = '${first_name}'`;
    const result = await db.all(query);
    res.send(result)
  });
  
  // 03 API -> filter users by last name
  app.get('/api/users/last_name/:last_name', async (req, res) => {
    const { last_name } = req.params;
    const query = `SELECT * FROM users WHERE last_name = '${last_name}'`;
    const result = await db.all(query);
    res.send(result);
  });
  
  // 04 API -> filter users by email
  app.get('/api/users/email/:email', async (req, res) => {
    const { email } = req.params;
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const result = await db.get(query);
   res.send(result);
  });
  
  // 05 API -> filter users by gender
  app.get('/api/users/gender/:gender', async (req, res) => {
    const { gender } = req.params;
    const query = `SELECT * FROM users WHERE gender = '${gender}'`;
    const result = await db.all(query);
   res.send(result)
  });
  
  // 06 API -> filter users by state
  app.get('/api/users/state/:state', async (req, res) => {
    const { state } = req.params;
    const query = `SELECT * FROM users WHERE state = '${state}'`;
    const result = await db.all(query);
    res.send(result)
  });

  // 07 API -> Pagination
  // Pagination route
app.get('/api/users', async (req, res) => {
    console.log("Pagination");
    const {offset, limit} = req.query
    console.log(offset, limit);
    const query = `SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`
    const result = await db.all(query);
    res.send(result);
  });