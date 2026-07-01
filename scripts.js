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
function getColorFromWheel(e) {
    let colorWheel = document.querySelector(".color-wheel");
    let rect = colorWheel.getBoundingClientRect();    

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let centerX = rect.width / 2;
    let centerY = rect.height / 2;

    let angle = Math.atan2(y - centerY, x - centerX);
    let hue = Math.round((angle * 180 / Math.PI + 90 + 360) % 360);

    return {
        color: "hsl(" + hue + ", 100%, 60%)",
        x: x,
        y: y
    };
}

function previewColor(e) {
    let colorSelector = document.querySelector(".magnifier");
    let colorData = getColorFromWheel(e);
    
    colorSelector.style.left = colorData.x + "px";
    colorSelector.style.top = colorData.y + "px";    
}

function pickColor(e) {
    let colorInput = document.getElementById("color-picker");
    let colorSwatch = document.getElementById("selected-color-swatch");
    let selectedColorDisplay = document.getElementById("selected-color-display");
    let colorNextButton = document.getElementById("color-next-btn");
    
    let colorData = getColorFromWheel(e);

    previewColor(e);

    colorInput.value = colorData.color;
    colorSwatch.style.backgroundColor = colorData.color;

    selectedColorDisplay.classList.add("visible");
    colorNextButton.disabled = false;
}
function showColor() {
    document.getElementById("color-selection").classList.remove("hidden");
    document.getElementById("intensity-selection").classList.add("hidden");
    document.getElementById("energy-selection").classList.add("hidden");
}

// intensity step
function showIntensity() {
    document.getElementById("color-selection").classList.add("hidden");
    document.getElementById("intensity-selection").classList.remove("hidden");
    document.getElementById("energy-selection").classList.add("hidden");
}

// energy step
function showEnergy() {
    document.getElementById("color-selection").classList.add("hidden");
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
    let now = new Date();

    let checkin = {
        color: document.getElementById("color-picker").value, 
        intensity: document.getElementById("intensity").value, 
        energy: document.getElementById("energy").value,
        date: now.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric"
        }),

        time: now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        }),    
        dateKey: now.toISOString()
    };

    let checkins = getCheckins();
    checkins.push(checkin);
    saveCheckins(checkins);

    window.location.href = "history.html";
}

// display history summary
function displayHistorySummary() {
    let checkins = getCheckins();

    let totalCheckins = document.getElementById("total-checkins");
    let daysReflected = document.getElementById("days-reflected");
    let latestCheckin = document.getElementById("last-checkin");
    let emptyMessage = document.getElementById("empty-history-message");

    if(!totalCheckins || !daysReflected || !latestCheckin || !emptyMessage) {
        return;
    }

    totalCheckins.textContent = checkins.length;

    if(checkins.length === 0) {
        totalCheckins.textContent = "0";
        daysReflected.textContent = "0";
        latestCheckin.textContent = "--";
        emptyMessage.classList.remove("hidden");
        return;
    }

    emptyMessage.classList.add("hidden");

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    let reflectedDays = [];

    for (let checkin of checkins) {
        let checkinDate = new Date(checkin.dateKey);

        if (checkinDate.getMonth() === currentMonth && checkinDate.getFullYear() === currentYear) {
            let dayKey = checkinDate.toDateString();

            if (!reflectedDays.includes(dayKey)) {
                reflectedDays.push(dayKey);
            }
        }
    }

    let mostRecent = checkins[checkins.length - 1];

    daysReflected.textContent = reflectedDays.length;
    
    latestCheckin.innerHTML = `
        ${mostRecent.date}
        ${mostRecent.time ? "<br>" + mostRecent.time : ""}
    `;
}

// display emotional palette
function displayEmotionalPalette() {
    let paletteColors = document.getElementById("palette-colors");

    if(!paletteColors) {
        return;
    }

    let checkins = getCheckins();
    paletteColors.innerHTML = "";

    if (checkins.length === 0) {
        paletteColors.innerHTML = "<p>No colors saved yet.</p>";
        return;
    }

    let recentCheckins = checkins.slice(-7);

    for (let checkin of recentCheckins) {
        let paletteDot = document.createElement("span");

        paletteDot.classList.add("palette-dot");
        paletteDot.style.backgroundColor = checkin.color;
        paletteDot.title = checkin.date;

        paletteColors.appendChild(paletteDot);
    }
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
            document.getElementById("detail-color").style.backgroundColor = checkin.color;
            document.getElementById("detail-intensity").textContent = intensity;
            document.getElementById("detail-energy").textContent = energy;
            document.getElementById("detail-date").textContent = checkin.date;
        
            if(window.innerWidth <= 920) {
                document.querySelector(".checkin-details").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });

        mapArea.appendChild(mapDot);
    }
}

displayHistorySummary();
displayEmotionalPalette();


// event listeners
if(document.getElementById("back-to-color-btn")) {
    document.getElementById("back-to-color-btn").addEventListener("click", showColor);
}

if(document.querySelector(".color-wheel")) {
    document.querySelector(".color-wheel").addEventListener("mousemove", previewColor);
    document.querySelector(".color-wheel").addEventListener("click", pickColor);
}

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

if(document.getElementById("back-to-intensity-btn")) {
    document.getElementById("back-to-intensity-btn").addEventListener("click", showIntensity);
}

if(document.getElementById("save-checkin-btn")) {
   document.getElementById("save-checkin-btn").addEventListener("click", saveCheckin); 
}

if(document.querySelector(".map-area")) {
    displayMap();
}