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

// GET All Books
app.get("/books/", async (request, response) => {
    const getBooksQuery = `
    SELECT * 
    FROM book 
    ORDER BY book_id;
    `;
    const booksArray = await db.all(getBooksQuery);  // SQLite method
    response.send(booksArray);
});


// GET Single Book
app.get("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;
    const getBookQuery = `
    SELECT
      *
    FROM
      book
    WHERE
      book_id = ${bookId};`;
    const book = await db.get(getBookQuery);  // SQLite method
    response.send(book);
});

// Add Book
app.post("/books/", async (request, response) => {
    const bookDetails = request.body;
    const {
        title,
        authorId,
        rating,
        ratingCount,
        reviewCount,
        description,
        pages,
        dateOfPublication,
        editionLanguage,
        price,
        onlineStores,
    } = bookDetails;
    const addBookQuery = `
    INSERT INTO
      book (title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
    VALUES
      (
        '${title}',
         ${authorId},
         ${rating},
         ${ratingCount},
         ${reviewCount},
        '${description}',
         ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
         ${price},
        '${onlineStores}'
      );`;

    const dbResponse = await db.run(addBookQuery);  // SQLite method
    const bookId = dbResponse.lastID;
    response.send({ bookId: bookId });
});


// Update Book
app.put("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;
    const bookDetails = request.body;
    const {
        title,
        authorId,
        rating,
        ratingCount,
        reviewCount,
        description,
        pages,
        dateOfPublication,
        editionLanguage,
        price,
        onlineStores,
    } = bookDetails;
    const updateBookQuery = `
    UPDATE
      book
    SET
      title='${title}',
      author_id=${authorId},
      rating=${rating},
      rating_count=${ratingCount},
      review_count=${reviewCount},
      description='${description}',
      pages=${pages},
      date_of_publication='${dateOfPublication}',
      edition_language='${editionLanguage}',
      price=${price},
      online_stores='${onlineStores}'
    WHERE
      book_id = ${bookId};`;
    await db.run(updateBookQuery);
    response.send("Book Updated Successfully");
});


// Delete Book
app.delete("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;
    const deleteBookQuery = `
    DELETE FROM
      book
    WHERE
      book_id = ${bookId};`;
    await db.run(deleteBookQuery);  // SQLite method
    response.send("Book Deleted Successfully");
});

// Get Author Books
app.get("/authors/:authorId/books/", async (request, response) => {
    const { authorId } = request.params;
    const getAuthorBooksQuery = `
    SELECT
     *
    FROM
     book
    WHERE
      author_id = ${authorId};`;
    const booksArray = await db.all(getAuthorBooksQuery);
    response.send(booksArray);
});