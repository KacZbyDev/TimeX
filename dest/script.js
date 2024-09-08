import { Subtimer } from './subtimer.js';
import { Utils } from './utils.js';
const refreshDelay = 10;
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
        currentSubtimer.time.textContent = 'finished';
    }
}
function subtimerFinished() {
    currentElement = currentElement.nextElementSibling;
    if (currentElement) {
        if (currentElement.className.includes('repeater')) {
            list = currentElement;
            findFirstSubTimer(list);
            currentElement = list.children[1];
        }
        currentSubtimer.time.textContent = 'finished';
        currentSubtimer = new Subtimer(currentElement);
        miliseconds = currentSubtimer.miliseconds;
        return;
    }
    if (list.className.includes('repeater'))
        repeaterReachEnd();
}
function repeaterReachEnd() {
    let repeatValues = list.firstElementChild;
    let currentRepeats = parseInt(repeatValues.firstElementChild.textContent) + 1;
    let totalRepeats = parseInt(repeatValues.lastElementChild.textContent);
    repeatValues.firstElementChild.textContent = currentRepeats + "";
    if (currentRepeats >= totalRepeats) {
        if (currentRepeats > totalRepeats)
            clearInterval(timerRefresher);
        currentElement = list;
        list = list.parentElement;
    }
    else {
        currentElement = list.firstElementChild;
        resetChildren(list);
    }
    subtimerFinished();
}
function resetChildren(repeater) {
    for (let i = 1; i < repeater.children.length; i++) {
        let child = repeater.children[i];
        if (child.className.includes("sub-timer"))
            child.firstElementChild.textContent = child.lastElementChild.textContent;
        else {
            child.firstElementChild.firstElementChild.textContent = "0";
            resetChildren(child);
        }
    }
}
function findFirstSubTimer(repeater) {
    for (let i = 0; i < repeater.children.length; i++) {
        let child = repeater.children[i];
        if (child.className.includes("sub-timer")) {
            list = child.parentElement;
            return true;
        }
        if (findFirstSubTimer(child))
            return true;
    }
    return false;
}
//# sourceMappingURL=script.js.map