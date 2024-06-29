/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework
const { open } = require("sqlite"); // database connection
const sqlite3 = require("sqlite3"); // database driver
const path = require("path"); // file path

/* -----> creating Express server Instance <----- */
const app = express();

/* -----> Database Path <----- */
const databasePath = path.join(__dirname, "./moviesData.db");

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
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

/* -----> Handling HTTP Request <----- */
// app.METHOD(PATH, HANDLER)

// Movie Object formatted Data
const convertMovieDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

// Director Object formatted Data
const convertDirectorDbObjectToResponseObject = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

// API 1
// Get All Movies
app.get("/movies/", async (request, response) => {
  console.log("Get All Movies");
  const getAllMoviesQuery = `
        SELECT movie_name 
        FROM movie;
    `;
  const getAllMovies = await database.all(getAllMoviesQuery);
  const formattedData = getAllMovies.map((eachMovie) => ({
    movieName: eachMovie.movie_name,
  }));
  response.send(formattedData);
});

// API 2
// Add Movie
app.post("/movies/", async (request, response) => {
  const movieDetails = await request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postMovieQuery = `
    INSERT INTO 
    movie (director_id, movie_name, lead_actor)
    VALUES (
        ${directorId},
        "${movieName}",
        "${leadActor}"
    );
  `;
  await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

// API 3
// Get Single Movie
app.get("/movies/:movieId", async (request, response) => {
  console.log("Get Single Movie");
  const { movieId } = request.params;
  console.log(movieId);
  const getMovieQuery = `
    SELECT * 
    FROM movie
    WHERE movie_id = ${movieId};
  `;
  const movie = await database.get(getMovieQuery);
  const formattedData = await convertMovieDbObjectToResponseObject(movie);

  response.send(formattedData);
});

// API 4
// Update Movie
app.put("/movies/:movieId/", async (request, response) => {
  console.log("Update Movie");
  const { movieId } = request.params;
  console.log(movieId);
  const movieDetails = await request.body;
  console.log(movieDetails);
  const { directorId, movieName, leadActor } = movieDetails;

  const updateMovieQuery = `
    UPDATE 
        movie
    SET 
        director_id = ${directorId},
        movie_name = "${movieName}",
        lead_actor = "${leadActor}"
    
    WHERE 
        movie_id = ${movieId};
  `;
  await database.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

// API 5
// Delete Movie
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  console.log(movieId);
  const deleteMovieQuery = `
    DELETE FROM 
        movie
    WHERE 
        movie_id = ${movieId};    
  `;

  await database.run(deleteMovieQuery);
  response.send("Movie Removed");
});

// API 6
// Get All Directors
app.get("/directors/", async (request, response) => {
  const getAllDirectorsQuery = `
    SELECT * 
    FROM director
    `;
  const allDirectors = await database.all(getAllDirectorsQuery);
  const formattedData = allDirectors.map((eachDirector) =>
    convertDirectorDbObjectToResponseObject(eachDirector)
  );
  response.send(formattedData);
});

// API 7
// Get Single Director Movies
app.get("/directors/:directorId/movies/", async (request, response) => {
  console.log("Get Single Director Movie");
  const { directorId } = await request.params;
  console.log(directorId);
  const getDirectorMoviesQuery = `
  SELECT 
    movie_name
  FROM 
    movie 
  WHERE 
    director_id = ${directorId};
  `;
  const directorMovies = await database.all(getDirectorMoviesQuery);
  const formattedData = await directorMovies.map((eachMovie) => ({
    movieName: eachMovie.movie_name,
  }));
  response.send(formattedData);
});

/* -----> DEfault Exporting <----- */
module.exports = app;
