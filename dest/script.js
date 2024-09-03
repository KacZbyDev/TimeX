import { Subtimer } from './subtimer.js';
import { Utils } from './utils.js';
const refreshDelay = 100;
let timerRefresher;
let bigTimerDisplay;
let progress_bar;
let list;
let firstSubtimer;
let currentSubtimer;
let miliseconds;
window.addEventListener('load', () => {
    loadFirstSubtimer();
    bigTimerDisplay = document.getElementById('big-timer-time');
    progress_bar = document.getElementById('progress-bar');
    timerRefresher = setInterval(updateTime, refreshDelay);
});
function loadFirstSubtimer() {
    list = document.getElementById('list-content');
    firstSubtimer = new Subtimer(list.children[0]);
    currentSubtimer = firstSubtimer;
    miliseconds = currentSubtimer.miliseconds;
}
function updateTime() {
    let percent = 100 - miliseconds / currentSubtimer.miliseconds * 100;
    progress_bar.style.setProperty('--value', percent + '');
    miliseconds -= refreshDelay;
    if (miliseconds >= 0) {
        currentSubtimer.element.firstElementChild.textContent = Utils.milisecondsToTime(miliseconds);
        bigTimerDisplay.textContent = Utils.milisecondsToTime(miliseconds);
    }
    else
        subtimerFinished();
}
function subtimerFinished() {
    Utils.playSubtimerFinish();
    currentSubtimer.element.firstElementChild.textContent = 'finished';
    let listNextChildren = list.children[currentSubtimer.ID + 1];
    if (listNextChildren != null) {
        currentSubtimer = new Subtimer(listNextChildren);
        miliseconds = currentSubtimer.miliseconds;
        return;
    }
    bigTimerDisplay.textContent = 'done';
    clearInterval(timerRefresher);
}
//# sourceMappingURL=script.js.map