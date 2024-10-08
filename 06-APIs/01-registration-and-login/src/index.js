/* -----> Third Party packages <----- */
const express = require("express"); // Server-Side Web Application Framework
const path = require("path"); // file path
const { open } = require("sqlite"); // database connection
const sqlite3 = require("sqlite3"); // database driver
const bcrypt = require("bcrypt"); // Encrypt the password
const jwt = require("jsonwebtoken"); // JWT token

/* -----> create Express server Instance <----- */
const app = express();

/* -----> Handling JSON data <----- */
app.use(express.json());

/* -----> Database Path <----- */
const dbPath = path.join(__dirname, "../database/mydb.db");

/* -----> Connecting SQLite Database <----- */
let db = null;
const initializeDBAndServer = async () => {
	try {
		db = await open({
			filename: dbPath,
			driver: sqlite3.Database,
		});

		// Create a table if it doesn't exist
		await db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY,
          firstname TEXT,
          lastname TEXT,
          email TEXT,
          password TEXT
      )`);

		/* -----> Assigning a port Number <----- */
		const port = 5000;
		app.listen(port, () => {
			console.log(`app listening on port ${port}`);
		});
	} catch (error) {
		console.log(`Database Error : ${error.message}`);
		process.exit(1);
	}
};

initializeDBAndServer();

/* -----> Handling HTTP Request <----- */
// 00 API -> Test
app.get("/", (request, response) => {
	console.log("Hello World");
	response.send("Hello World");
});

/* -----> Middlewares <----- */

// authenticateToken Middleware
const authenticateToken = (request, response, next) => {
	console.log("authenticateToken Middleware");
	let jwtToken;
	const authHeader = request.headers["authorization"];
	if (authHeader !== undefined) {
		jwtToken = authHeader.split(" ")[1];
	}
	if (jwtToken === undefined) {
		response.status(401).send("Invalid Access Token");
	} else {
		const secretKey = "MY_SECRET_TOKEN"; // It takes from .env
		jwt.verify(jwtToken, secretKey, async (error, payload) => {
			if (error) {
				response.status(401).send("Invalid Access Token");
			} else {
				next();
			}
		});
	}
};

/* -----> Routes <----- */

// 01 API -> Registration -> Add User
app.post("/users", async (request, response) => {
	console.log("Add User");
	// console.log(request.body);
	const userDetails = request.body;
	const { firstname, lastname, email, password } = userDetails;
	const selectUserQuery = `
    SELECT
        *
    FROM
        users
    WHERE 
        email = '${email}';    
    `;

	const dbUser = await db.get(selectUserQuery);

	if (dbUser === undefined) {
		const hashedPassword = await bcrypt.hash(password, 10);
		console.log(hashedPassword);

		const createUserQuery = `
            INSERT INTO 
                users (firstname, lastname, email, password)
            VALUES (
            '${firstname}',
            '${lastname}',
            '${email}',
            '${hashedPassword}'
            );    
        `;

		const dbResponse = await db.run(createUserQuery);
		const newUserId = dbResponse.lastID;

		response.send(`created new user with ${newUserId}`);
	} else {
		response.status(400);
		response.send("User Already Registered");
	}
});

//  02 API -> Login
app.post("/users/login", async (request, response) => {
	console.log("Login");
	const userDetails = request.body;
	console.log(userDetails);
	const { email, password } = userDetails;

	const selectUserQuery = `
        SELECT
            *
        FROM
            users
        WHERE 
            email = '${email}';
    `;

	const dbUser = await db.get(selectUserQuery);
	console.log("user", dbUser);

	if (dbUser === undefined) {
		response.status(400);
		response.send("Invalid User");
	} else {
		const dbUserPassword = dbUser.password;
		const isPasswordMatched = await bcrypt.compare(password, dbUserPassword);
		if (isPasswordMatched === true) {
			const payload = {
				email: email,
			};
			const secretKey = "MY_SECRET_TOKEN"; // It takes from .env
			const options = {
				expiresIn: "1h", // Token expires in 1 hour
			};

			// Generate the Token
			const token = jwt.sign(payload, secretKey, options);
			console.log(token);
			response.json({
				message: "Login Success!",
				token: token,
			});
		} else {
			console.log("Invalid Password");
			response.status(400);
			response.send("Invalid Password");
		}
	}
});

// 03 API -> JWT Token Checking
app.get("/home", (request, response) => {
	console.log("Home");
	// console.log(request.headers);
	let jwtToken;
	const authHeader = request.headers["authorization"];
	if (authHeader !== undefined) {
		jwtToken = authHeader.split(" ")[1];
	}

	if (jwtToken === undefined) {
		response.status(401).send("Invalid Access Token");
	} else {
		const secretKey = "MY_SECRET_TOKEN"; // It takes from .env
		jwt.verify(jwtToken, secretKey, async (error, payload) => {
			if (error) {
				response.status(401).send("Invalid Access Token");
			} else {
				response.status(200).send("Successfully Accessed users API");
			}
		});
	}
});

// 04 API -> JWT Token Checking -> middleware
app.get("/about", authenticateToken, (request, response) => {
	console.log("About");
	response.status(200).send("Successfully Accessed users API");
});
