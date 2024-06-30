/// Authentication

/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework
const { open } = require("sqlite"); // database connection
const sqlite3 = require("sqlite3"); // database driver
const path = require("path"); // file path
const bcrypt = require("bcrypt"); // Encrypt the password

/* -----> creating Express server Instance <----- */
const app = express();

/* -----> Database Path <----- */
const databasePath = path.join(__dirname, "./userData.db");

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
    process.exit(-1);
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

// API 1
// Registration
app.post("/register", async (request, response) => {
  console.log("Registration");
  const userDetails = request.body;
  console.log(userDetails);
  const { username, name, password, gender, location } = userDetails;
  const selectUserQuery = `
    SELECT 
        * 
    FROM 
        user
    WHERE 
        username = "${username}";
  `;
  const selectDbUser = await database.get(selectUserQuery);
  // Scenario 1 -> username already exists
  if (selectDbUser !== undefined) {
    response.status(400);
    response.send("User already exists");
  } else {
    console.log(password);
    const passwordLength = password.length;
    // Scenario 2 -> password is too short
    if (passwordLength < 5) {
      console.log("Password is too short");
      response.status(400);
      response.send("Password is too short");
    }
    // Scenario 3 -> Successful Registration
    else {
      console.log("Successful Registration");
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      const createUserQuery = `
        INSERT INTO 
            user (username, name, password, gender, location)
        VALUES (
            "${username}",
            "${name}",
            "${hashedPassword}",
            "${gender}",
            "${location}"
        );    
      `;
      await database.run(createUserQuery);
      response.status(200);
      response.send("User created successfully");
    }
  }
});

// API 2
// Login
app.post("/login", async (request, response) => {
  console.log("Login");
  const loginDetails = request.body;
  console.log(loginDetails);
  const { username, password } = loginDetails;
  const selectUserQuery = `
    SELECT 
        * 
    FROM 
        user
    WHERE 
        username = "${username}";
  `;
  const selectDbUser = await database.get(selectUserQuery);

  // Scenario 1 -> Unregistered User
  if (selectDbUser === undefined) {
    console.log("Unregistered User");
    response.status(400);
    response.send("Invalid user");
  } else {
    const selectDbPassword = selectDbUser.password;
    const isPasswordMatched = await bcrypt.compare(password, selectDbPassword);
    // Scenario 2 -> Incorrect Password
    if (isPasswordMatched === false) {
      console.log("Incorrect Password");
      response.status(400);
      response.send("Invalid password");
    }
    // Scenario 3 -> Successful Login
    else {
      console.log("Successful Login");
      response.status(200);
      response.send("Login success!");
    }
  }
});

// API 3
// Update Password
app.put("/change-password", async (request, response) => {
  console.log("Update Password");
  const passwordDetails = request.body;
  console.log(passwordDetails);
  const { username, oldPassword, newPassword } = passwordDetails;
  const selectUserQuery = `
    SELECT 
        * 
    FROM 
        user
    WHERE 
        username = "${username}";
  `;
  const selectDbUser = await database.get(selectUserQuery);
  const selectDbPassword = selectDbUser["password"];
  const comparedPassword = await bcrypt.compare(oldPassword, selectDbPassword);
  // Scenario 1 -> Incorrect Old Password
  if (comparedPassword === false) {
    console.log("Incorrect Old Password");
    response.status(400);
    response.send("Invalid current password");
  } else {
    const newPasswordLength = newPassword.length;
    // Scenario 2 -> Password too short
    if (newPasswordLength < 5) {
      console.log("Password too short");
      response.status(400);
      response.send("Password is too short");
    }
    // Scenario 3 -> Successful password update
    else {
      console.log("Successful password update");
      const selectUser = selectDbUser["username"];
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatePasswordQuery = `
        UPDATE 
            user
        SET
            password = "${hashedPassword}"
        WHERE
            username = "${selectUser}";
      `;
      await database.run(updatePasswordQuery);
      response.status(200);
      response.send("Password updated");
    }
  }
});

/* -----> Default Exporting <----- */
module.exports = app;
