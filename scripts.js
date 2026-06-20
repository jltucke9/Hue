"use strict";

// show hidden checkin sections
function showIntensity() {
    document.getElementById("color-selection").classList.add("hidden");
    document.getElementById("intensity-selection").classList.remove("hidden");
}

function showEnergy() {
    document.getElementById("intensity-selection").classList.add("hidden");
    document.getElementById("intensity-selection").classList.remove("hidden");
}




// event handlers
document.getElementById("color-next-btn").addEventListener("click", showIntensity);

document.getElementById("intensity-next-btn").addEventListener("click", showEnergy);