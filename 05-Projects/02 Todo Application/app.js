/// Todo Application

/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework
const { open } = require("sqlite"); // database connection
const sqlite3 = require("sqlite3"); // database driver
const path = require("path"); // file path
const format = require("date-fns/format"); // Manipulating Dates
const isValid = require("date-fns/isValid"); // Manipulating Dates

/* -----> creating Express server Instance <----- */
const app = express();

/* -----> Database Path <----- */
const databasePath = path.join(__dirname, "./todoApplication.db");

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
// Todo Object
const convertDbTodoObjectToResponseObject = (dbObject) => {
  return {
    id: dbObject.id,
    todo: dbObject.todo,
    category: dbObject.category,
    priority: dbObject.priority,
    status: dbObject.status,
    dueDate: dbObject.due_date,
  };
};

// Middleware Functions

// Valid Query Parameter values
const validQueryParameterValues = (request, response, next) => {
  console.log("Middleware Function");
  // Possible Query Parameter Values
  const statusValues = ["TO DO", "IN PROGRESS", "DONE"];
  const priorityValues = ["HIGH", "MEDIUM", "LOW"];
  const categoryValue = ["WORK", "HOME", "LEARNING"];

  const queryParameters = request.query;
  console.log(queryParameters);
  const { status, priority, category } = queryParameters;

  const isValidStatusValue = statusValues.includes(status);
  const isValidPriorityValue = priorityValues.includes(priority);
  const isValidCategoryValue = categoryValue.includes(category);

  if (!isValidStatusValue && status !== undefined) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (!isValidPriorityValue && priority !== undefined) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (!isValidCategoryValue && category !== undefined) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else {
    next();
  }
};

// Valid date Query Parameter value
const validDateQueryParameter = (request, response, next) => {
  console.log("Middleware Function");
  const queryParameters = request.query;
  console.log(queryParameters);
  const { date } = queryParameters;
  const isValidDate = isValid(new Date(date));

  if (!isValidDate && date !== undefined) {
    response.status(400);
    response.send("Invalid Due Date");
  } else {
    next();
  }
};

// Validate Body Property Values
validateBodyPropertyValues = (request, response, next) => {
  console.log("Middleware Function");
  // Possible Query Parameter Values
  const statusValues = ["TO DO", "IN PROGRESS", "DONE"];
  const priorityValues = ["HIGH", "MEDIUM", "LOW"];
  const categoryValue = ["WORK", "HOME", "LEARNING"];
  const todoDetails = request.body;
  console.log(todoDetails);
  const { status, priority, category, dueDate } = todoDetails;

  const isValidStatusValue = statusValues.includes(status);
  const isValidPriorityValue = priorityValues.includes(priority);
  const isValidCategoryValue = categoryValue.includes(category);
  const isValidDate = isValid(new Date(dueDate));

  if (!isValidStatusValue && status !== undefined) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (!isValidPriorityValue && priority !== undefined) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (!isValidCategoryValue && category !== undefined) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if (!isValidDate && dueDate !== undefined) {
    response.status(400);
    response.send("Invalid Due Date");
  } else {
    next();
  }
};

// checking Query Parameters

// status
const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

// priority
const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

// status & priority
const hasStatusAndPriorityProperties = (requestQuery) => {
  return hasStatusProperty(requestQuery) && hasPriorityProperty(requestQuery);
};

// search_q
const hasSearchQProperty = (requestQuery) => {
  return requestQuery.search_q !== undefined;
};

// category
const hasCategoryProperty = (requestQuery) => {
  return requestQuery.category !== undefined;
};

// status & category
const hasStatusAndCategoryProperties = (requestQuery) => {
  return hasStatusProperty(requestQuery) && hasCategoryProperty(requestQuery);
};

// priority & category
const hasPriorityAndCategoryProperties = (requestQuery) => {
  return hasPriorityProperty(requestQuery) && hasCategoryProperty(requestQuery);
};

// API 1
// Get All Todos with Query Parameters
app.get("/todos/", validQueryParameterValues, async (request, response) => {
  console.log("Get All Todos with Query Parameters");
  const queryParameters = request.query;
  console.log(queryParameters);
  const { status, priority, search_q = "", category } = queryParameters;

  let queryData = null;
  let getTodosQuery = "";

  switch (true) {
    // Scenario 3 => Query Parameters -> status & priority
    case hasStatusAndPriorityProperties(request.query):
      getTodosQuery = `
        SELECT 
             *
        FROM
            todo
        WHERE 
            status = "${status}" 
                AND 
            priority = "${priority}"
                AND
            todo LIKE "%${search_q}%";   
          `;
      break;
    case hasStatusAndCategoryProperties(request.query):
      getTodosQuery = `
        SELECT 
             *
        FROM
             todo
        WHERE 
                status = "${status}" 
                    AND 
                category = "${category}"
                    AND
                todo LIKE "%${search_q}%";    
          `;
      break;

    case hasPriorityAndCategoryProperties(request.query):
      getTodosQuery = `
        SELECT 
                *
        FROM
                todo
        WHERE 
                priority = "${priority}" 
                    AND 
                category = "${category}"
                     AND
                todo LIKE "%${search_q}%";    
          `;
      break;

    case hasStatusProperty(request.query):
      getTodosQuery = `
        SELECT 
        *
  FROM
        todo
  WHERE 
        status = "${status}"
            AND
        todo LIKE "%${search_q}%";    
          `;
      break;
    case hasCategoryProperty(request.query):
      getTodosQuery = `
        SELECT 
        *
  FROM
        todo
  WHERE 
        category = "${category}"
            AND 
        todo LIKE "%${search_q}%";    
          `;
      break;
    case hasPriorityProperty(request.query):
      getTodosQuery = `
       SELECT 
        *
  FROM
        todo
  WHERE 
        priority = "${priority}"
            AND
        todo LIKE "%${search_q}%";    
          `;
      break;
    default:
      getTodosQuery = `
       SELECT 
        *
    FROM
            todo
    WHERE 
            todo LIKE "%${search_q}%";    
          `;
  }

  queryData = await database.all(getTodosQuery);
  const formattedData = queryData.map((eachTodo) =>
    convertDbTodoObjectToResponseObject(eachTodo)
  );
  response.send(formattedData);
});

// API 2
// Get Single Todo
app.get("/todos/:todoId/", async (request, response) => {
  console.log("Get Single Todo");
  const { todoId } = request.params;
  console.log(todoId);
  const getSingleTodoQuery = `
  SELECT 
    * 
  FROM
    todo
 WHERE 
    id = ${todoId};   
  `;
  const singleTodo = await database.get(getSingleTodoQuery);
  const formattedData = convertDbTodoObjectToResponseObject(singleTodo);
  response.send(formattedData);
});

// API 3
// Get All Todos with Query Parameter date
app.get("/agenda/", validDateQueryParameter, async (request, response) => {
  console.log("Get All Todos with data Query");
  const queryParameters = request.query;
  console.log(queryParameters);
  const { date } = queryParameters;
  if (date !== undefined) {
    const formattedDate = format(new Date(date), "yyyy-MM-dd");
    console.log(formattedDate);
    const getDateTodosQuery = `
  SELECT 
        *
  FROM
        todo
  WHERE 
        due_date = date("${formattedDate}");
  `;
    const dateTodos = await database.all(getDateTodosQuery);
    const formattedData = dateTodos.map((eachTodo) =>
      convertDbTodoObjectToResponseObject(eachTodo)
    );
    response.send(formattedData);
  }
});

// API 4
// Update todo on Post Request
app.post("/todos/", validateBodyPropertyValues, async (request, response) => {
  console.log("Create Todo");
  const todoDetails = request.body;
  console.log(todoDetails);

  const { id, todo, priority, status, category, dueDate } = todoDetails;

  if (id) {
    const updateTodoQuery = `
      UPDATE todo
      SET
        todo = "${todo}",
        priority = "${priority}",
        status = "${status}",
        category = "${category}",
        due_date = "${dueDate}"
      WHERE
        id = ${id};
    `;
    await database.run(updateTodoQuery);
    response.send("Todo Successfully Added");
  } else {
    const insertTodoQuery = `
      INSERT INTO todo (todo, priority, status, category, due_date)
      VALUES (
        "${todo}",
        "${priority}",
        "${status}",
        "${category}",
        "${dueDate}"
      );
    `;
    await database.run(insertTodoQuery);
    response.send("Todo Successfully Added");
  }
});

// API 5
// Update Todo
app.put(
  "/todos/:todoId/",
  validateBodyPropertyValues,
  async (request, response) => {
    console.log("Update Todo");
    const { todoId } = request.params;
    console.log(todoId);
    const todoDetails = request.body;
    console.log(todoDetails); // status, priority, todo, category, dueDate

    const previousTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE 
      id = ${todoId};`;

    const previousTodo = await database.get(previousTodoQuery);
    console.log(previousTodo);

    let responseBody;
    switch (true) {
      case todoDetails.status !== undefined:
        responseBody = "Status Updated";
        break;
      case todoDetails.priority !== undefined:
        responseBody = "Priority Updated";
        break;
      case todoDetails.todo !== undefined:
        responseBody = "Todo Updated";
        break;
      case todoDetails.category !== undefined:
        responseBody = "Category Updated";
        break;
      case todoDetails.dueDate !== undefined:
        responseBody = "Due Date Updated";
        break;
    }
    console.log(responseBody);

    const {
      status = previousTodo.status,
      priority = previousTodo.priority,
      todo = previousTodo.todo,
      category = previousTodo.category,
      dueDate = previousTodo.due_date,
    } = todoDetails;

    const updateTodoQuery = `
    UPDATE
        todo
    SET
        status='${status}',
        priority='${priority}',
        todo='${todo}',
        category="${category}",
        due_date="${dueDate}"
    WHERE
        id = ${todoId};
        `;

    await database.run(updateTodoQuery);
    response.send(responseBody);
  }
);

// API 6
// Delete Todo
app.delete("/todos/:todoId/", async (request, response) => {
  console.log("Delete Todo");
  const { todoId } = request.params;
  console.log(todoId);
  const deleteTodoQuery = `
    DELETE FROM 
        todo
    WHERE
        id = ${todoId};    
  `;
  await database.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

/* -----> Default Exporting <----- */
module.exports = app;
