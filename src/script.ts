import {Subtimer} from './subtimer.js'
import {Utils} from './utils.js'


const refreshDelay:number = 100;

let timerRefresher:any
let bigTimerDisplay:HTMLElement
let progress_bar:HTMLElement

let queueSubtimers:Subtimer[] = []
let currentSubtimer:Subtimer

let miliseconds:number;

window.addEventListener('load', () => {
    
    loadTimers()
    currentSubtimer = queueSubtimers[0] 
    miliseconds = queueSubtimers[0].miliseconds

    bigTimerDisplay = document.getElementById('big-timer-time')!
    progress_bar = document.getElementById('progress-bar')!

    timerRefresher = setInterval(updateTime, refreshDelay) 
});

function loadTimers():void {
    let subtimersElements:HTMLCollection = document.getElementById('list-content')!.children

    while(Subtimer.Count < subtimersElements.length) {
        queueSubtimers[Subtimer.Count] = new Subtimer(subtimersElements.item(Subtimer.Count)!)
    }
}

function subtimerFinished():void {
    currentSubtimer.element!.firstElementChild!.textContent = 'finished'

    if(currentSubtimer.ID < Subtimer.Count - 1) {
        currentSubtimer = queueSubtimers[currentSubtimer.ID + 1]
        miliseconds = currentSubtimer.miliseconds
    } else {
        bigTimerDisplay!.textContent = 'done'
        clearInterval(timerRefresher)
    }
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