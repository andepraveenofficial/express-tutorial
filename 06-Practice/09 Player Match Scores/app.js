/// Player Match Scores

/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework
const { open } = require("sqlite"); // database connection
const sqlite3 = require("sqlite3"); // database driver
const path = require("path"); // file path

/* -----> creating Express server Instance <----- */
const app = express();

/* -----> Database Path <----- */
const databasePath = path.join(__dirname, "./cricketMatchDetails.db");

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

// Player Object formatted Data
convertPlayerDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
  };
};

// Match Object formatted Data
convertMatchDetailsDbObjectToResponseObject = (dbObject) => {
  return {
    matchId: dbObject.match_id,
    match: dbObject.match,
    year: dbObject.year,
  };
};

// API 1
// Get All Players
app.get("/players/", async (request, response) => {
  console.log("Get All Players");
  const getAllPlayersQuery = `
  SELECT 
    * 
  FROM 
    player_details;
  `;
  const allPlayers = await database.all(getAllPlayersQuery);
  const formattedData = allPlayers.map((eachPlayer) =>
    convertPlayerDbObjectToResponseObject(eachPlayer)
  );
  response.send(formattedData);
});

// API 2
// Get Single Player
app.get("/players/:playerId/", async (request, response) => {
  console.log("Get Single Player");
  const { playerId } = request.params;
  console.log(playerId);
  const getSinglePlayerQuery = `
    SELECT
    *
FROM
    player_details
WHERE
    player_id = ${playerId};
  `;
  const singlePlayer = await database.get(getSinglePlayerQuery);
  const formattedData = convertPlayerDbObjectToResponseObject(singlePlayer);
  response.send(formattedData);
});

// API 3
// Update Player
app.put("/players/:playerId/", async (request, response) => {
  console.log("Update Player");
  const { playerId } = request.params;
  console.log(playerId);
  const playerDetails = request.body;
  console.log(playerDetails);
  const { playerName } = playerDetails;
  const updatePlayerQuery = `
    UPDATE
    player_details
SET
    player_name = "${playerName}"
WHERE
    player_id = ${playerId};
  `;
  await database.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

// API 4
// Get Single Match
app.get("/matches/:matchId/", async (request, response) => {
  console.log("Get Single Match");
  const { matchId } = request.params;
  console.log(matchId);
  const getSingleMatchQuery = `
    SELECT
        *
    FROM
        match_details
    WHERE
        match_id = ${matchId};
  `;
  const singleMatch = await database.get(getSingleMatchQuery);
  const formattedData = convertMatchDetailsDbObjectToResponseObject(
    singleMatch
  );
  response.send(formattedData);
});

// API 5
// Get Player All Matches
app.get("/players/:playerId/matches", async (request, response) => {
  console.log("Get Player All Matches");
  const { playerId } = request.params;
  console.log(playerId);
  const getPlayerAllMatchesQuery = `
    SELECT
      *
    FROM player_match_score 
      NATURAL JOIN match_details
    WHERE
      player_id = ${playerId};`;
  const playerAllMatches = await database.all(getPlayerAllMatchesQuery);
  const formattedData = playerAllMatches.map((eachMatch) =>
    convertMatchDetailsDbObjectToResponseObject(eachMatch)
  );
  response.send(formattedData);
});

// API 6
// Get Players of Single Match
app.get("/matches/:matchId/players", async (request, response) => {
  console.log("Get Players of Single Player");
  const { matchId } = request.params;
  console.log(matchId);
  const getPlayersOfSingleMatchQuery = `
    SELECT
      *
    FROM player_match_score
      NATURAL JOIN player_details
    WHERE
      match_id = ${matchId};`;
  const playersOfSingleMatch = await database.all(getPlayersOfSingleMatchQuery);
  const formattedData = playersOfSingleMatch.map((eachPlayer) =>
    convertPlayerDbObjectToResponseObject(eachPlayer)
  );
  response.send(formattedData);
});

// API 7
// Statistics
app.get("/players/:playerId/playerScores", async (request, response) => {
  console.log("Statistics");
  const { playerId } = request.params;
  console.log(playerId);
  const getStatisticsQuery = `
    SELECT
      player_id AS playerId,
      player_name AS playerName,
      SUM(score) AS totalScore,
      SUM(fours) AS totalFours,
      SUM(sixes) AS totalSixes
    FROM player_match_score
      NATURAL JOIN player_details
    WHERE
      player_id = ${playerId};`;
  const statistics = await database.get(getStatisticsQuery);
  response.send(statistics);
});

/* -----> DEfault Exporting <----- */
module.exports = app;
