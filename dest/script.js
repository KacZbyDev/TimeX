"use strict";
const refreshTime = 100;
const decimals = 1;
let refreshInterval;
let miliseconds = 1000;
let ul = document.querySelector("#timer");
if (ul) {
    ul.textContent = milisecondsToSecondsFormat(miliseconds);
    refreshInterval = setInterval(updateTime, refreshTime);
}
function updateTime() {
    miliseconds -= refreshTime;
    if (miliseconds > 0)
        ul.textContent = milisecondsToSecondsFormat(miliseconds);
    else
        refreshIntervalFinished();
}
function refreshIntervalFinished() {
    ul.textContent = "finished";
    clearInterval(refreshInterval);
}
function milisecondsToSecondsFormat(miliseconds) {
    return (miliseconds / 1000).toFixed(decimals);
}
//# sourceMappingURL=script.js.map