import { Subtimer } from './subtimer.js'
import { Utils } from './utils.js'
import { Repeater } from './repeater.js'

const refreshDelay: number = 10;//how many miliseconds it takes for the time to update
let currentMiliseconds: number;
var startTime:number

let timerRefresherStopped:boolean = false
let timerRefresher: NodeJS.Timeout
let bigTimerDisplay: HTMLElement
let progress_bar: HTMLElement
let list: Element//the list in which the current subtimer is 
let currentElement:Element | null

let currentSubtimer: Subtimer

window.addEventListener('load', () => {
    bigTimerDisplay = document.getElementById('big-timer-time')!
    progress_bar = document.getElementById('progress-bar')!
    list = document.getElementById('list-content')!
    currentElement = list.firstElementChild!

    startNewSubtimer()
    
    //the time before the timer updated
    startTime = Date.now()

    //called to refresh the timer and calculate the time passed
    timerRefresher = setInterval(updateTime, refreshDelay)
});

function updateTime(): void {
    if (currentMiliseconds <= 0)
        subtimerFinished()

    if(timerRefresherStopped)
        return;

    //update bigTimer
    let percent = currentMiliseconds / currentSubtimer.duration * 100
    progress_bar.style.setProperty('--value', percent + '')
    bigTimerDisplay.textContent = Utils.milisecondsToTime(currentMiliseconds);

    // currentSubtimer.element.className = 'subtimer-active';
    (<HTMLElement> currentSubtimer.element).style.setProperty('--value', percent + '')

    //the time elapsed after the last call
    currentMiliseconds -= Date.now() - startTime
    startTime = Date.now()
}

function subtimerFinished(): void {
    Utils.playSubtimerFinish()

    //iterates throught the next element in the list
    currentElement = currentElement!.nextElementSibling

    //if the element had more siblings in the repeater, or main list
    if (currentElement) {
        if (currentElement.className.includes('repeater')) {
            list = currentElement

            Repeater.setListToFirstSubtimerParent(list)

            //starts with the second children fromt the repeater because the first one is for the repeater to look nice
            currentElement = list.children[1]
        }

        //Reset timer appearance
        currentSubtimer.element.className = 'subtimer'

        startNewSubtimer()

        startTime = Date.now()
        return
    }

    if (list.className.includes('repeater'))
        repeaterReachEnd()
    else {
        timerRefresherStopped = true
        clearInterval(timerRefresher)

        bigTimerDisplay.textContent = 'DONE'
        currentSubtimer.element.className = 'subtimer'
        progress_bar.style.setProperty('--value', '0')
    }
}

function startNewSubtimer():void {
    //create a subtimer object by passing the currentElement
    currentSubtimer = new Subtimer(currentElement!)

    //the time displayed by bigTimer
    currentMiliseconds = currentSubtimer.duration

    document.getElementById('current-subtimer-name')!.textContent! = currentSubtimer.name
}

function repeaterReachEnd():void {
    //gets the values stored in the repeaters
    let repeaterValues = list.querySelector('.repeater-values')!
    let currentRepeats = parseInt(repeaterValues.querySelector('.current-repeats')!.textContent!) + 1
    let totalRepeats = parseInt(repeaterValues.querySelector('.total-repeats')!.textContent!)
    
    repeaterValues.firstElementChild!.textContent = currentRepeats + ''

    //if repeater repeated enough times
    if (currentRepeats >= totalRepeats) {  
        currentElement = list
        list = list.parentElement!
    } else {
        currentElement = list.firstElementChild
        Repeater.resetChildren(list)
    }

    subtimerFinished()
}

$(document).ready(function () {
    $("#reset-button").on("click", () => {
        list = document.getElementById('list-content')!
        Repeater.resetChildren(list)
        currentElement = list.firstElementChild!
        startNewSubtimer()
        
        startTime = Date.now()

        if(timerRefresherStopped) {
            timerRefresherStopped = false
            timerRefresher = setInterval(updateTime, refreshDelay)
        }
    });
});