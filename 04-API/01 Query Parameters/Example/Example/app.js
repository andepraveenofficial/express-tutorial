/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework
const { open } = require("sqlite"); // database connection
const sqlite3 = require("sqlite3"); // database driver
const path = require("path"); // file path

/* -----> creating Express server Instance <----- */
const app = express();

/* -----> Database Path <----- */
const databasePath = path.join(__dirname, "./goodreads.db");

/* -----> JSON Object Request <----- */
app.use(express.json());

/* -----> Connecting SQLite Database <----- */

let database = null;

const initializeDbAndServer = async () => {
    try {
        database = await open({
            filename: databasePath,
            driver: sqlite3.Database,
        });
        /* -----> Assigning a port Number <----- */
        app.listen(3004, () =>
            console.log("Server Running at http://localhost:3004/")
        );
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDbAndServer();

/* -----> Handling HTTP Request <----- */
// app.METHOD(PATH, HANDLER)

// API 1
// Home
app.get("/", async (request, response) => {
    console.log("Home")
    response.send("Home");
});

// API 2
// Get a Specific Number of Books
// Offset -> Offset is used to specify the position from where rows are to be selected.
// Limit -> Limit is used to specify the number of rows.
app.get("/books/",  async (request, response) => {
        console.log("Query Parameters");
        const queryParameters = await request.query;
        console.log(queryParameters);

        const {
            offset,
            limit,
            order,
            order_by,
            search_q = "",
        } = queryParameters;


        const getBooksQuery = `
    SELECT
        *
    FROM
        book
    WHERE
        title LIKE '%${search_q}%'
    ORDER BY ${order_by} ${order}
    LIMIT ${limit} OFFSET ${offset};
  `;

    const booksArray = await database.all(getBooksQuery);
     response.send(booksArray);

    }
    );


/* -----> DEfault Exporting <----- */
module.exports = app;
