"use strict";
const decimals = 1;
const refreshDelay = 100;
let timerRefresher;
let bigTimerDisplay;
let queueTimers = [];
let currentTimer;
let miliseconds = 3000;
window.addEventListener('load', () => {
    loadTimers();
    currentTimer = queueTimers[0];
    bigTimerDisplay = document.getElementById('big-timer-time');
    timerRefresher = setInterval(Utils.updateBigTimer, refreshDelay);
});
function loadTimers() {
    queueTimers[0] = new Timer(3000, document.getElementById('timey1'));
    queueTimers[1] = new Timer(3000, document.getElementById('timey2'));
}
class Timer {
    constructor(miliseconds, element) {
        this.miliseconds = miliseconds;
        this.element = element;
        this.timerID = Timer.timersCount;
        Timer.timersCount++;
    }
    start() {
        Utils.updateBigTimer();
    }
}
Timer.timersCount = 0;
class Utils {
    static updateBigTimer() {
        miliseconds -= refreshDelay;
        if (miliseconds >= 0) {
            currentTimer.element.textContent = Utils.milisecondsToSecondsFormat(miliseconds);
            bigTimerDisplay.textContent = Utils.milisecondsToSecondsFormat(miliseconds);
        }
        else
            timeyFinished();
    }
    static milisecondsToSecondsFormat(miliseconds) {
        return (miliseconds / 1000).toFixed(decimals);
    }
}
function timeyFinished() {
    currentTimer.element.textContent = "finished";
    if (currentTimer.timerID < Timer.timersCount - 1) {
        currentTimer = queueTimers[currentTimer.timerID + 1];
        miliseconds = currentTimer.miliseconds;
    }
    else {
        bigTimerDisplay.textContent = "done";
        clearInterval(timerRefresher);
    }
}
//# sourceMappingURL=script.js.map