"use strict";
const decimals = 1;
const refreshDelay = 100;
let timerRefresher;
let bigTimerDisplay;
let progress_bar;
let queueSubtimers = [];
let currentSubtimer;
let miliseconds;
window.addEventListener('load', () => {
    loadTimers();
    currentSubtimer = queueSubtimers[0];
    miliseconds = queueSubtimers[0].miliseconds;
    bigTimerDisplay = document.getElementById('big-timer-time');
    progress_bar = document.getElementById('progress-bar');
    timerRefresher = setInterval(Utils.updateTimer, refreshDelay);
});
function loadTimers() {
    let subtimersElements = document.getElementById('list-content').children;
    while (Subtimer.Count < subtimersElements.length) {
        queueSubtimers[Subtimer.Count] = new Subtimer(subtimersElements.item(Subtimer.Count));
    }
}
class Subtimer {
    constructor(element) {
        this.ID = Subtimer.Count;
        Subtimer.Count++;
        this.element = element;
        this.name = element.firstElementChild.textContent;
        this.miliseconds = Utils.timeToMiliseconds(element.lastElementChild.textContent);
    }
}
Subtimer.Count = 0;
class Utils {
    static updateTimer() {
        let percent = 100 - miliseconds / currentSubtimer.miliseconds * 100;
        console.log(document.getElementById('progress-bar').style.setProperty('--value', percent + ''));
        miliseconds -= refreshDelay;
        if (miliseconds >= 0) {
            currentSubtimer.element.firstElementChild.textContent = Utils.milisecondsToTime(miliseconds);
            bigTimerDisplay.textContent = Utils.milisecondsToTime(miliseconds);
        }
        else
            subtimerFinished();
    }
    static timeToMiliseconds(time) {
        if (time.length > 2)
            return this.timeToMiliseconds(time.substring(time.length - 2, time.length)) +
                this.timeToMiliseconds(time.substring(0, time.length - 3)) * 60;
        return parseInt(time) * 1000;
    }
    static milisecondsToTime(miliseconds) {
        let seconds = (miliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        seconds %= 60;
        minutes %= 60;
        let res = '';
        if (hours > 0) {
            res += hours + ':';
            if (minutes < 10)
                res += '0';
        }
        if (minutes > 0 || hours > 0) {
            res += minutes + ':';
            if (seconds < 10)
                res += '0';
        }
        return res + seconds.toFixed(decimals);
    }
}
function subtimerFinished() {
    currentSubtimer.element.firstElementChild.textContent = 'finished';
    if (currentSubtimer.ID < Subtimer.Count - 1) {
        currentSubtimer = queueSubtimers[currentSubtimer.ID + 1];
        miliseconds = currentSubtimer.miliseconds;
    }
    else {
        bigTimerDisplay.textContent = 'done';
        clearInterval(timerRefresher);
    }
}
//# sourceMappingURL=script.js.map