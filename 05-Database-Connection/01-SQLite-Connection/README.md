# SQLite Connection

### Step 1 : Basic NodeJS Setup
* Install NodeJS
* create `index.js`
* Write some code in `index.js`
* Start the Application : `node index.js`

### Step 2 : nodemon Setup
* __nodemon__ is third-party package to start the server automatically.
* when you save the code server will restart automatically.
* Create Node Environment : `npm init -y`
*  Install nodemon : `npm install -D nodemon`
* Start the Application : `nodemon index.js`

### step 3 : Change the Scripts
* To avoid typing `nodemon index.js` every time, you can modify the scripts section of your `package.json` file.

```json
"scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
```
* Start the Application : `npm run dev`

### Step 4 : ExpressJS Setup
* Install Server-side web Framework : `npm install express`
* Start the Application : `npm run dev`

### Step 5 : Check HTTP requests
* use __postman__
* We are using **REST Client** VScode extension for see the output.

### Step 6 : SQLite Connection
* Database connection : `npm install sqlite`
* Database driver : `npm install sqlite3`
* Create Database File : `mydb.db`

### Installation
* `npm install`

### Start the Application
* `npm run dev`

