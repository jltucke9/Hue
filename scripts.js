"use strict";

// helper functions 
function getCheckins() {
    return JSON.parse(localStorage.getItem("checkins")) || [];
}

function saveCheckins(checkins) {
    localStorage.setItem("checkins", JSON.stringify(checkins));
}

// checkin page
//  color selection
function pickColor(e) {
    let colorWheel = document.querySelector(".color-wheel");
    let colorInput = document.getElementById("color-picker");
    let colorSelector = document.querySelector(".magnifier");
    let colorSwatch = document.getElementById("selected-color-swatch");

    let rect = colorWheel.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let centerX = rect.width / 2;
    let centerY = rect.height / 2;

    let angle = Math.atan2(y - centerY, x - centerX);
    let hue = Math.round((angle * 180 / Math.PI + 90 + 360) % 360);

    let color = "hsl(" + hue + ", 100%, 60%)";

    colorInput.value = color;
    colorSwatch.style.backgroundColor = color;

    colorSelector.style.left = x + "px";
    colorSelector.style.top = y + "px";
}


// intensity step
function showIntensity() {
    document.getElementById("color-selection").classList.add("hidden");
    document.getElementById("intensity-selection").classList.remove("hidden");
}

// energy step
function showEnergy() {
    document.getElementById("intensity-selection").classList.add("hidden");
    document.getElementById("energy-selection").classList.remove("hidden");
}

// intensity slider
function updateIntensity() {
    let intensityInput = document.getElementById("intensity");
    let intensityValue = document.getElementById("intensity-value");

    intensityValue.innerHTML = intensityInput.value;
}

// energy slider
function updateEnergy() {
    let energyInput = document.getElementById("energy");
    let energyValue = document.getElementById("energy-value");

    energyValue.innerHTML = energyInput.value;
}

// save check-in
function saveCheckin() {

    let checkin = {
        color: document.getElementById("color-picker").value, 
        intensity: document.getElementById("intensity").value, 
        energy: document.getElementById("energy").value,
        date: new Date().toLocaleString()
    };

    let checkins = getCheckins();

    checkins.push(checkin);

    saveCheckins(checkins);

    window.location.href = "history.html";
}

// display history
function displayHistory() {
    let historyList = document.getElementById("history-list");

    if(!historyList) {
        return;
    }

    let checkins = getCheckins();
    historyList.innerHTML = "";

    for (let checkin of checkins) {
        let card = document.createElement("div");
        card.classList.add("history-card");

        card.innerHTML = 
            `<div class="history-color" style="background-color: ${checkin.color};"></div>
            <p><strong>Intensity:</strong> ${checkin.intensity}</p>
            <p><strong>Energy:</strong> ${checkin.energy}</p>
            <p>${checkin.date}</p>`;

        historyList.appendChild(card);
    }
}

/* Emotional Map */
function displayMap() {
    let checkins = getCheckins();
    let mapArea = document.querySelector(".map-area");

    if (!mapArea) {
        return;
    }

    for(let checkin of checkins) {
        let mapDot = document.createElement("div");

        // convert saved values from strings to numbers
        let intensity = Number(checkin.intensity);
        let energy = Number(checkin.energy);
        
        // convert 0-10 scale values into map coordinates
        let xPosition = 10 + (intensity * 8);
        let yPosition = 90 - (energy * 8);

        mapDot.classList.add("map-dot");

        mapDot.style.left = xPosition + "%";
        mapDot.style.top = yPosition + "%";
        mapDot.style.backgroundColor = checkin.color;

        mapDot.title = "Intensity: " + intensity + " | Energy: " + energy;

        mapDot.addEventListener("click", function() {
            alert("Intensity: " + intensity + "\nEnergy: " + energy);
        });

        mapArea.appendChild(mapDot);
    }
}


// event listeners
if(document.getElementById("color-next-btn")) {
    document.getElementById("color-next-btn").addEventListener("click", showIntensity);
}

if(document.querySelector(".color-wheel")) {
    document.querySelector(".color-wheel").addEventListener("click", pickColor);
}

if(document.getElementById("intensity-next-btn")) {
    document.getElementById("intensity-next-btn").addEventListener("click", showEnergy);
}

if(document.getElementById("intensity")) {
    document.getElementById("intensity").addEventListener("input", updateIntensity);
    updateIntensity();
}
if(document.getElementById("energy")) {
    document.getElementById("energy").addEventListener("input", updateEnergy);
    updateEnergy();
}
if(document.getElementById("save-checkin-btn")) {
   document.getElementById("save-checkin-btn").addEventListener("click", saveCheckin); 
}

if(document.querySelector(".map-area")) {
    displayMap();
}