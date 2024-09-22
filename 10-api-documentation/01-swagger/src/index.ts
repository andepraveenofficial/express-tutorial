// src/index.ts
import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger_output.json";
import path from "path";

const app = express();
const port = 5000;

// Middleware for parsing JSON request bodies
app.use(express.json());

// Serve OpenAPI JSON file
app.get("/openapi.json", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "swagger_output.json"));
});

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Sample data
const users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
];

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
app.get("/users", (req: Request, res: Response) => {
  res.json(users);
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: User not found
 */
app.get("/users/:id", (req: Request, res: Response) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 */
app.post("/users", (req: Request, res: Response) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
