/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework
const { open } = require("sqlite"); // database connection
const sqlite3 = require("sqlite3"); // database driver
const path = require("path"); // file path

/* -----> creating Express server Instance <----- */
const app = express();

/* -----> Database Path <----- */
const databasePath = path.join(__dirname, "./covid19India.db");

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

// State Object formatted Data Function
const convertStateDbObjectToResponseObject = (dbObject) => {
  return {
    stateId: dbObject.state_id,
    stateName: dbObject.state_name,
    population: dbObject.population,
  };
};

// District Object formatted Data Function
const convertDistrictDbObjectToResponseObject = (dbObject) => {
  return {
    districtId: dbObject.district_id,
    districtName: dbObject.district_name,
    stateId: dbObject.state_id,
    cases: dbObject.cases,
    cured: dbObject.cured,
    active: dbObject.active,
    deaths: dbObject.deaths,
  };
};

// API 1
// Get All States
app.get("/states/", async (request, response) => {
  console.log("Get All States");
  const getAllStatesQuery = `
    SELECT 
        * 
    FROM 
        state;
 `;
  const allStates = await database.all(getAllStatesQuery);
  const formattedData = allStates.map((eachState) =>
    convertStateDbObjectToResponseObject(eachState)
  );
  response.send(formattedData);
});

// API 2
// Get Single State
app.get("/states/:stateId/", async (request, response) => {
  console.log("Get Single State");
  const { stateId } = request.params;
  console.log(stateId);
  const getSingleStateQuery = `
        SELECT 
            *
        FROM 
            state
        WHERE 
            state_id = ${stateId};
    `;
  const singleState = await database.get(getSingleStateQuery);
  const formattedData = await convertStateDbObjectToResponseObject(singleState);
  response.send(formattedData);
});

// API 3
// Add District
app.post("/districts/", async (request, response) => {
  console.log("Add District");
  const districtDetails = request.body;
  console.log(districtDetails);
  const {
    districtName,
    stateId,
    cases,
    cured,
    active,
    deaths,
  } = districtDetails;
  const addDistrictQuery = `
  INSERT INTO 
  district (district_name, state_id , cases, cured, active, deaths)
  VALUES ("${districtName}", ${stateId}, ${cases}, ${cured}, ${active}, ${deaths}
  );
  `;
  await database.run(addDistrictQuery);
  response.send("District Successfully Added");
});

// API 4
// Get Single District
app.get("/districts/:districtId/", async (request, response) => {
  console.log("Get Single District");
  const { districtId } = request.params;
  console.log(districtId);
  const getSingleDistrictQuery = `
  SELECT 
    * 
  FROM 
    district
  WHERE 
    district_id = ${districtId};
  `;
  const singleDistrict = await database.get(getSingleDistrictQuery);
  const formattedData = await convertDistrictDbObjectToResponseObject(
    singleDistrict
  );
  response.send(formattedData);
});

// API 5
// Delete Single District
app.delete("/districts/:districtId/", async (request, response) => {
  console.log("Delete Single District");
  const { districtId } = request.params;
  console.log(districtId);
  const deleteSingleDistrictQuery = `
  DELETE FROM 
    district
  WHERE 
    district_id = ${districtId};
  `;
  await database.run(deleteSingleDistrictQuery);
  response.send("District Removed");
});

// API 6
// Update District
app.put("/districts/:districtId/", async (request, response) => {
  console.log("Update District");
  const { districtId } = request.params;
  console.log(districtId);
  const districtDetails = await request.body;
  console.log(districtDetails);
  const {
    districtName,
    stateId,
    cases,
    cured,
    active,
    deaths,
  } = districtDetails;
  const updateDistrictQuery = `
  UPDATE 
    district 
  SET 
    district_name = "${districtName}",
    state_id = ${stateId},
    cases = ${cases},
    cured = ${cured},
    active = ${active},
    deaths = ${deaths}
  WHERE 
    district_id = ${districtId};
  `;
  await database.run(updateDistrictQuery);
  response.send("District Details Updated");
});

// API 7
// Get total cases
app.get("/states/:stateId/stats/", async (request, response) => {
  console.log("Get Total Cases");
  const { stateId } = request.params;
  console.log(stateId);
  const getStatisticsQuery = `
    SELECT 
        SUM(cases) as totalCases,
        SUM(cured) as totalCured,
        SUM(active) as totalActive,
        SUM(deaths) as totalDeaths
    FROM 
        district
    WHERE 
        state_id = ${stateId}
  `;
  const statistics = await database.get(getStatisticsQuery);
  const formattedDate = {
    totalCases: statistics["totalCases"],
    totalCured: statistics["totalCured"],
    totalActive: statistics["totalActive"],
    totalDeaths: statistics["totalDeaths"],
  };
  response.send(formattedDate);
});

// API 8
// Get stateName
app.get("/districts/:districtId/details/", async (request, response) => {
  console.log("Get stateName");
  const { districtId } = request.params;
  console.log(districtId);
  const getStateNameQuery = `
  SELECT
      state_name
    FROM
      district
    NATURAL JOIN
      state
    WHERE 
      district_id=${districtId};
  `;
  const state = await database.get(getStateNameQuery);
  response.send({ stateName: state.state_name });
});

/* -----> DEfault Exporting <----- */
module.exports = app;
