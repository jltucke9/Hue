"use strict";

// show hidden checkin sections
function showIntensity() {
    document.getElementById("color-selection").classList.add("hidden");
    document.getElementById("intensity-selection").classList.remove("hidden");
}

function showEnergy() {
    document.getElementById("intensity-selection").classList.add("hidden");
    document.getElementById("energy-selection").classList.remove("hidden");
}

function updateIntensity() {
    let intensityInput = document.getElementById("intensity");
    let intensityValue = document.getElementById("intensity-value");

    intensityValue.innerHTML = intensityInput.value;
}

function updateEnergy() {
    let energyInput = document.getElementById("energy");
    let energyValue = document.getElementById("energy-value");

    energyValue.innerHTML = energyInput.value;
}



// create save checkin
function saveCheckin() {
    let checkin = {
        color: document.getElementById("color-picker").value, intensity: document.getElementById("intensity").value, energy: document.getElementById("energy").value
    };

    localStorage.setItem("latestCheckin", JSON.stringify(checkin));

    window.location.href = "history.html";
}

function displayHistory() {
    let savedCheckin = localStorage.getItem("latestCheckin");

    if(savedCheckin) {
        savedCheckin = JSON.parse(savedCheckin);

        document.getElementById("history-list").innerHTML = 
        "<p>Color&#58; " + savedCheckin.color + 
        "</p>" + "<p>Intensity&#58; " + savedCheckin.intensity + "</p>" + "<p>Energy&#58; " + savedCheckin.energy + "</p>";
    }
}



// event handlers
if(document.getElementById("color-next-btn")) {
    document.getElementById("color-next-btn").addEventListener("click", showIntensity);
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

if(document.getElementById("history-list")) {
    displayHistory();
}