# REST API design


<details>
<summary>Index</summary>

## Index
* REST APIs

</details>

---

<details>
<summary>REST APIs</summary>

## REST APIs
* REST APIs play an important role in ensuring smooth communication between the client and the server.
* You can think of the client as the front end and the server as the back end.
* Communication between the client (frontend) and the server (backend) isn't usually super direct. So we use an interface called an __Application Programming Interface (or API)__ to act as an intermediary between the client and the server.
* For Example, OLA, and UBER use Google API Maps to provide their services.

### REST 
* REST stands for Representational State Transfer. 
* Using Rest Principles improves application in various aspects like Scalability, Reliability...etc

### REST API Principles
* Providing uniqueId to each resource
* using standard methods like GET, POST, PUT and DELETE
* Accept and Response with JSON.

</details>

---

<details>
<summary>Best Practices</summary>

## Best Practices

1. Use Nouns for Resources
   * Correct: /users, /orders
   * Incorrect: /getUsers, /createOrder

2. Use HTTP Methods Appropriately
   * GET: Retrieve data
   * POST: Create a new resource
   * PUT: Update a resource
   * DELETE: Delete a resource
   * PATCH: Partially update a resource
3. Use Plural Nouns
   * Correct: /books, /users
   * Incorrect: /book, /user
4. Use Logical Resource Nesting
   * Correct: /users/{userId}/orders
   * Incorrect: /ordersByUser/{userId}
5. Use HTTP Status Codes
   * 200 OK: Successful GET, PUT, PATCH, DELETE
   * 201 Created: Successful POST
   * 204 No Content: Successful DELETE (no response body)
   * 400 Bad Request: Invalid data in request
   * 401 Unauthorized: Authentication failure
   * 403 Forbidden: Authorization failure
   * 404 Not Found: Resource not found
   * 500 Internal Server Error: Server error
6. Use Query Parameters for Filtering, Sorting, and Pagination
   * Filtering: /users?role=admin
   * Sorting: /users?sort=createdAt
   * Pagination: /users?page=2&limit=10
7. Consistent and Meaningful Error Responses
   * 
```js
{
  "error": "Resource not found",
  "details": "The user with ID 123 does not exist."
   }
```
8. Version Your API
   * Include a version number in your URL:
   * /v1/users
   * /v2/users
   * Example: /api/v1/users

</details>

---