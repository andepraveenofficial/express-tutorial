/// Covid-19 India Portal

/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework
const { open } = require("sqlite"); // database connection
const sqlite3 = require("sqlite3"); // database driver
const path = require("path"); // file path
const bcrypt = require("bcrypt"); // Encrypt the password
const jwt = require("jsonwebtoken"); // Access Tokens

/* -----> creating Express server Instance <----- */
const app = express();

/* -----> Database Path <----- */
const databasePath = path.join(__dirname, "./covid19IndiaPortal.db");

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

// API 0
// Home
app.get("/", async (request, response) => {
  console.log("Home");
  response.send("Home");
});

// Formatted Functions

// State Object
const convertStateDbObjectToResponseObject = (dbObject) => ({
  stateId: dbObject.state_id,
  stateName: dbObject.state_name,
  population: dbObject.population,
});

// District Object
const convertDistrictDbObjectToResponseObject = (dbObject) => ({
  districtId: dbObject.district_id,
  districtName: dbObject.district_name,
  stateId: dbObject.state_id,
  cases: dbObject.cases,
  cured: dbObject.cured,
  active: dbObject.active,
  deaths: dbObject.deaths,
});

// Middleware Functions

// authenticateToken Middleware
const authenticateToken = (request, response, next) => {
  console.log("authenticateToken Middleware");
  const authHeader = request.headers;
  const { authorization } = authHeader;
  console.log(authorization);
  let userJwtToken;
  if (authorization !== undefined) {
    userJwtToken = authorization.split(" ")[1];
    console.log(userJwtToken);
  }
  if (userJwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(userJwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        next();
      }
    });
  }
};

// API 1
// Login
app.post("/login/", async (request, response) => {
  console.log("Login");
  const userDetails = request.body;
  console.log(userDetails);
  const { username, password } = userDetails;
  const selectUserQuery = `
    SELECT 
        *
    FROM 
        user
    WHERE 
        username = "${username}";
    `;
  const selectDbUser = await database.get(selectUserQuery);
  console.log(selectDbUser);

  // Scenario 1 -> Invalid User
  if (selectDbUser === undefined) {
    console.log("Invalid user");
    response.status(400);
    response.send("Invalid user");
  } else {
    const selectDbPassword = selectDbUser.password;
    console.log(selectDbPassword);
    const isPasswordMatched = await bcrypt.compare(password, selectDbPassword);
    console.log(isPasswordMatched);
    // Scenario 2 -> Invalid Password
    if (isPasswordMatched !== true) {
      console.log("Invalid password");
      response.status(400);
      response.send("Invalid password");
    }
    // Scenario 3 -> Successful Login
    else {
      console.log("Successful Login");
      const payload = {
        username: username,
      };
      const jwtToken = await jwt.sign(payload, "MY_SECRET_TOKEN");

      console.log({ jwtToken: jwtToken });
      response.send({ jwtToken });
    }
  }
});

// API 2
// Get All States
app.get("/states/", authenticateToken, async (request, response) => {
  console.log("Get All States");
  const getAllStatesQuery = `
  SELECT 
    *
  FROM 
    state
  `;
  const allStates = await database.all(getAllStatesQuery);
  const formattedData = await allStates.map((eachState) =>
    convertStateDbObjectToResponseObject(eachState)
  );
  response.send(formattedData);
});

// API 3
// Get Single State
app.get("/states/:stateId/", authenticateToken, async (request, response) => {
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
  const formattedData = convertStateDbObjectToResponseObject(singleState);
  response.send(formattedData);
});

// API 4
// Create District
app.post("/districts/", authenticateToken, async (request, response) => {
  console.log("Create District");
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
  const createDistrictQuery = `
    INSERT INTO
        district (district_name,state_id, cases, cured, active, deaths)
    VALUES (
        "${districtName}",
        ${stateId},
        ${cases},
        ${cured},
        ${active},
        ${deaths}
    );    
  `;
  await database.run(createDistrictQuery);
  response.send("District Successfully Added");
});

// API 5
// Get Single District
app.get(
  "/districts/:districtId/",
  authenticateToken,
  async (request, response) => {
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
    const formattedData = convertDistrictDbObjectToResponseObject(
      singleDistrict
    );
    response.send(formattedData);
  }
);

// API 6
// Delete District
app.delete(
  "/districts/:districtId/",
  authenticateToken,
  async (request, response) => {
    console.log("Delete District");
    const { districtId } = request.params;
    console.log(districtId);
    const deleteDistrictQuery = `
    DELETE FROM 
        district
    WHERE 
        district_id = ${districtId};
    `;
    await database.run(deleteDistrictQuery);
    response.send("District Removed");
  }
);

// API 7
// Update District
app.put(
  "/districts/:districtId/",
  authenticateToken,
  async (request, response) => {
    console.log("Update District");
    const { districtId } = request.params;
    console.log(districtId);
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
            district_id = ${districtId}
        ;    
    `;
    await database.run(updateDistrictQuery);
    response.send("District Details Updated");
  }
);

// API 8
// Statistics
app.get(
  "/states/:stateId/stats/",
  authenticateToken,
  async (request, response) => {
    console.log("Statistics");
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
            state_id = ${stateId};    
    `;
    const statistics = await database.get(getStatisticsQuery);
    response.send(statistics);
  }
);

/* -----> Default Exporting <----- */
module.exports = app;
