// src/swagger.ts
import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json"; // Path to the generated Swagger JSON file
const endpointsFiles = ["./src/index.ts"]; // Path to your endpoints

const doc = {
  info: {
    title: "My API",
    version: "1.0.0",
    description: "API Documentation",
  },
  host: "localhost:5000", // Replace with your host
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {},
  definitions: {
    todoResponse: {
      code: 200,
      message: "Success",
    },
    "errorResponse.400": {
      code: 400,
      message: "The request was malformed or invalid. Please check the request parameters.",
    },
    "errorResponse.401": {
      code: 401,
      message: "Authentication failed or user lacks proper authorization.",
    },
    "errorResponse.403": {
      code: 403,
      message: "You do not have permission to access this resource.",
    },
    "errorResponse.404": {
      code: 404,
      message: "The requested resource could not be found on the server.",
    },
    "errorResponse.500": {
      code: 500,
      message: "An unexpected error occurred on the server. Please try again later.",
    },
  },
  tags: [
    {
      name: "Users",
      description: "User operations",
    },
  ],
};

swaggerAutogen(outputFile, endpointsFiles, doc)
