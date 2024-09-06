import { Subtimer } from './subtimer.js';
import { Utils } from './utils.js';
const refreshDelay = 100;
let miliseconds;
let timerRefresher;
let bigTimerDisplay;
let progress_bar;
let list;
let currentElement;
let currentSubtimer;
window.addEventListener('load', () => {
    bigTimerDisplay = document.getElementById('big-timer-time');
    progress_bar = document.getElementById('progress-bar');
    list = document.getElementById('list-content');
    currentElement = list.firstElementChild;
    currentSubtimer = new Subtimer(currentElement);
    miliseconds = currentSubtimer.miliseconds;
    timerRefresher = setInterval(updateTime, refreshDelay);
});
function updateTime() {
    if (miliseconds <= 0)
        subtimerFinished();
    let percent = miliseconds / currentSubtimer.miliseconds * 100;
    progress_bar.style.setProperty('--value', percent + '');
    bigTimerDisplay.textContent = Utils.milisecondsToTime(miliseconds);
    currentSubtimer.time.textContent = Utils.milisecondsToTime(miliseconds);
    miliseconds -= refreshDelay;
    if (miliseconds < 0) {
        clearInterval(timerRefresher);
        bigTimerDisplay.textContent = "DONE";
        currentSubtimer.element.firstElementChild.textContent = 'finished';
    }
}
function subtimerFinished() {
    Utils.playSubtimerFinish();
    currentElement = currentElement.nextElementSibling;
    if (currentElement != null) {
        if (currentElement.className.includes('repeater')) {
            list = currentElement;
            currentElement = list.children[1];
        }
        currentSubtimer.time.textContent = 'finished';
        currentSubtimer = new Subtimer(currentElement);
        miliseconds = currentSubtimer.miliseconds;
        return;
    }
    if (list.className.includes('repeater')) {
        let firstChild = list.firstElementChild;
        firstChild.firstElementChild.textContent = "" + (parseInt(firstChild.firstElementChild.textContent) + 1);
        if (parseInt(firstChild.firstElementChild.textContent) >= parseInt(firstChild.lastElementChild.textContent)) {
            currentElement = list;
            list = list.parentElement;
        }
        else
            currentElement = list.firstElementChild;
        subtimerFinished();
    }
}
//# sourceMappingURL=script.js.map