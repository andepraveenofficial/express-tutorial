# ExpressJS setup

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
* add type to package.json file 
```json
"type": "module" 
```

### Step 2 : ExpressJS Setup
* Install Server-side web Framework : `npm install express`
* Start the Application : `npm run dev`

### Step 3 : Check HTTP requests
* use __postman__
* We are using **REST Client** vs extension for see the output.