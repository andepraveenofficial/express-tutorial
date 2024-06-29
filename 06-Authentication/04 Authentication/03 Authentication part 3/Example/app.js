/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework
const { open } = require("sqlite"); // database connection
const sqlite3 = require("sqlite3"); // database driver
const path = require("path"); // file path
const bcrypt = require("bcrypt"); // Encrypt the password
const jwt = require("jsonwebtoken"); // Access Token

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
        app.listen(3004, () =>
            console.log("Server Running at http://localhost:3004/")
        );
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(-1);
    }
};

initializeDbAndServer();

/* -----> Handling HTTP Request <----- */
// app.METHOD(PATH, HANDLER)

// authenticateToken Middleware
const authenticateToken = (request, response, next) => {
    console.log("authenticateToken Middleware");
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
        response.status(401);
        response.send("Invalid JWT Token");
    } else {
        jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
            if (error) {
                response.status(401);
                response.send("Invalid JWT Token");
            } else {
                next();
            }
        });
    }
};


// API 0
// Home
app.get("/", async (request, response) => {
    console.log("Home");
    response.send("Home");
});

// API 1
// Register User API
app.post("/user", async (request, response) => {
    console.log("Register User API");
    const userDetails = request.body;
    console.log(userDetails);
    const {username, name, password, gender, location} = userDetails;

    const selectUserQuery = `
    SELECT
        *
    FROM
        user
    WHERE 
        username = '${username}';    
    `;
    const dbUser = await database.get(selectUserQuery);
    if (dbUser === undefined){
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const createUserQuery = `
            INSERT INTO 
                user (username, name, password, gender, location)
            VALUES (
            '${username}',
            '${name}',
            '${hashedPassword}',
            '${gender}',
            '${location}'
            );    
        `;
        const dbResponse = await database.run(createUserQuery);
        const newUserId = dbResponse.lastID;
        response.send(`created new user with ${newUserId}`);
    }
    else{
        response.status(400);
        response.send("User Already Registered");
    }
});



// API 2
// Login User API
app.post("/login", async (request, response) => {
    console.log("Login User API");
    const loginDetails = request.body;
    console.log(loginDetails);
    const { username, password } = loginDetails;
    const selectUserQuery = `
        SELECT
            *
        FROM
            user
        WHERE 
            username = '${username}';
    `;
    const dbUser = await database.get(selectUserQuery);
    console.log(dbUser);
    if (dbUser === undefined) {
        response.status(400);
        response.send("Invalid User");
    } else {
        const dbUserPassword = dbUser.password;
        const isPasswordMatched = await bcrypt.compare(password, dbUserPassword);
        if (isPasswordMatched === true) {
            const payload = {
                username:username,
            };
            const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");  // Generate jwtToken
            console.log(jwtToken);
            response.send({jwtToken:jwtToken});
        } else {
            response.status(400);
            response.send("Invalid Password");
        }
    }
});

// API 3
// JWT Token Checking
app.get("/users", authenticateToken, (request, response) => {
    console.log("Users");
    response.send("Successfully Accessed users API");
});



/* -----> Default Exporting <----- */
module.exports = app;
