"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./swagger_output.json"));
const app = (0, express_1.default)();
const port = 5000;
// Middleware for parsing JSON request bodies
app.use(express_1.default.json());
// Serve Swagger UI
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
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
app.get("/users", (req, res) => {
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
app.get("/users/:id", (req, res) => {
    const user = users.find((user) => user.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    }
    else {
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
app.post("/users", (req, res) => {
    const newUser = req.body;
    users.push(newUser);
    res.status(201).json(newUser);
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
