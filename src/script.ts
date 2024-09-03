import {Subtimer} from './subtimer.js'
import {Utils} from './utils.js'

const refreshDelay:number = 100;

let timerRefresher:NodeJS.Timeout
let bigTimerDisplay:HTMLElement
let progress_bar:HTMLElement
let list:HTMLElement

let firstSubtimer:Subtimer
let currentSubtimer:Subtimer

let miliseconds:number;

window.addEventListener('load', () => {
    loadFirstSubtimer()

    bigTimerDisplay = document.getElementById('big-timer-time')!
    progress_bar = document.getElementById('progress-bar')!

    timerRefresher = setInterval(updateTime, refreshDelay) 
});

function loadFirstSubtimer():void {
    list = document.getElementById('list-content')!
    firstSubtimer = new Subtimer(list.children[0])
    currentSubtimer = firstSubtimer
    miliseconds = currentSubtimer.miliseconds
}

function updateTime():void {
    let percent = 100 - miliseconds / currentSubtimer.miliseconds * 100
    progress_bar.style.setProperty('--value', percent +'')
    
    miliseconds -= refreshDelay

    if(miliseconds >= 0) {
        currentSubtimer.element!.firstElementChild!.textContent = Utils.milisecondsToTime(miliseconds)
        bigTimerDisplay.textContent = Utils.milisecondsToTime(miliseconds)
    }
    else
        subtimerFinished()
}

function subtimerFinished():void {
    Utils.playSubtimerFinish()
    currentSubtimer.element!.firstElementChild!.textContent = 'finished'

    let listNextChildren:Element = list.children[currentSubtimer.ID+1]
    if(listNextChildren != null) {
        currentSubtimer = new Subtimer(listNextChildren)
        miliseconds = currentSubtimer.miliseconds
        return
    }
    
    bigTimerDisplay!.textContent = 'done'
    clearInterval(timerRefresher)
}