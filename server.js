"use strict"

// import required Node.js modules
const express = require("express");
const fs = require("fs");
const path = require("path");

// create Express application
const app = express();

// server will run on localhost:3000
const PORT = 3000;

// allow the server to read JSON data
app.use(express.json());

// serve the project's HTML, CSS, JS
app.use(express.static(__dirname));

// location of the JSON file used as a simple database
const dataPath = path.join(__dirname, "data.json");

/* -------- Helper Functions --------- */

// read the current data from data.json
function readData() {
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
}

// save updated data back to data.json
function saveData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
}


/* --------- API Routes --------- */
app.get("/api/reflections", function(req, res) {
    const data = readData();
    res.json(data);
});

app.post("/api/reflections", function(req, res){
    const data = readData();

    data.totalReflections += 1;

    saveData(data); 
    
    res.json(data);
});


/* --------- Start Server --------- */
// start local development server
app.listen(PORT, function() {
    console.log("Hue server is running at http://localhost:" + PORT);
});