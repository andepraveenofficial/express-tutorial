# ExpressJS setup


# ExpressJS setup


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
* ES6 import/export -> add type to `package.json` file 
```json
"type": "module" 
```
* Start the Application : `npm run dev`

### Step 4 : ExpressJS Setup
* Install Server-side web Framework : `npm install express`
* Start the Application : `npm run dev`

### Step 5 : Check HTTP requests
* use __postman__
* We are using **REST Client** VScode extension for see the output.










### Setp 1 : NodeJS Setup
* Install NodeJS
* Create Node Environment `npm init -y`  
* create `index.js`
* Write some code in `index.js`
* Start the Application : `node index.js`
* Install nodemon : `npm install -D nodemon`
* Start the Application : `nodemon index.js`
* write the scripts
    - To avoid typing `nodemon index.js` every time, you can modify the scripts section of your package.json file. 
    ```json
      "scripts": {
      "start": "node index.js",
      "dev": "nodemon index.js"
      },
    ```
* Start the Application : `npm run dev`   


### Step 2 : ExpressJS Setup
* Install Server-side web Framework : `npm install express`
* Start the Application : `npm run dev`

### Step 3 : Check HTTP requests
* use __postman__
* We are using **REST Client** vs extension for see the output.