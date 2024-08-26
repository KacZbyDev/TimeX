"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decimals = 1;
const refreshDelay = 100;
let timerRefresher;
let ul;
let bigTimerDisplay;
let miliseconds = 3000;
const Collections = require("typescript-collections");
window.addEventListener('load', () => {
    ul = document.getElementById('list-content');
    bigTimerDisplay = document.getElementById('big-timer-time');
    var mySet = new Collections.Set();
    console.log(mySet);
    if (ul) {
        timerRefresher = setInterval(Utils.updateBigTimer, refreshDelay);
    }
});
function loadTimers() {
}
class Timer {
    start() {
        Utils.updateBigTimer();
    }
}
class Utils {
    static updateBigTimer() {
        miliseconds -= refreshDelay;
        if (miliseconds >= 0) {
            ul.textContent = Utils.milisecondsToSecondsFormat(miliseconds);
            bigTimerDisplay.textContent = Utils.milisecondsToSecondsFormat(miliseconds);
        }
        else
            timerRefresherFinished();
    }
    static milisecondsToSecondsFormat(miliseconds) {
        return (miliseconds / 1000).toFixed(decimals);
    }
}
function timerRefresherFinished() {
    ul.textContent = "finished";
    clearInterval(timerRefresher);
}
//# sourceMappingURL=script.js.map