"use strict";

// color picker
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

if(document.getElementById("history-list")) {
    displayHistory();
}