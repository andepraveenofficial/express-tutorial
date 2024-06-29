/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework
const path = require("path"); // file path
const {open} = require("sqlite"); // database connection
const sqlite3 = require("sqlite3"); // database driver

/* -----> creating Express server Instance <----- */
const app = express();

/* -----> Database Path <----- */
const dbPath = path.join(__dirname, "./goodreads.db")

/* -----> Connecting SQLite Database <----- */
let db = null;
const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });

        /* -----> Assigning a port Number <----- */
        app.listen(3000, () => {
            console.log('Server listening on port 3000');
        });

    }
    catch(error){
        console.log(`Database Error : ${error.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();



/* -----> Handling HTTP Request <----- */
// app.METHOD(PATH, HANDLER)

app.get("/books/", async (request, response) => {
    const getBooksQuery = `
    SELECT * 
    FROM book 
    ORDER BY book_id;
    `;
    const booksArray = await db.all(getBooksQuery);  // SQLite method
    response.send(booksArray);
});




