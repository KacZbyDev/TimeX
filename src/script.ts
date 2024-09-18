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
let list: Element//the main subtimer-list is a list but also repeaters
let currentElement:Element | null

let currentSubtimer: Subtimer

window.addEventListener('load', () => {
    bigTimerDisplay = document.getElementById('big-timer-time')!
    progress_bar = document.getElementById('progress-bar')!
    list = document.getElementById('list-content')!
    currentElement = list.firstElementChild!

    //create a subtimer object by passing the currentElement
    currentSubtimer = new Subtimer(currentElement!)
    currentSubtimer.element.className = 'subtimer-active'

    //the time displayed by bigTimer
    currentMiliseconds = currentSubtimer.duration
    
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
    bigTimerDisplay.textContent = Utils.milisecondsToTime(currentMiliseconds)
    //updates the subtimer / the list element

    //TODO ADD timer updater with actual updates
    currentSubtimer.element.className = 'subtimer-active';

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
        currentSubtimer = new Subtimer(currentElement)

        startTime = Date.now()
        currentMiliseconds = currentSubtimer.duration
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

function repeaterReachEnd():void {
    //gets the values stored in the repeaters
    let repeatValues = list.firstElementChild!
    let currentRepeats = parseInt(repeatValues.firstElementChild!.textContent!) + 1
    let totalRepeats = parseInt(repeatValues.lastElementChild!.textContent!)
    
    repeatValues.firstElementChild!.textContent = currentRepeats + ''
    
    //if repeater repeated enough times
    if (currentRepeats >= totalRepeats) {
        if(currentRepeats > totalRepeats)//maybe we dont need this
            clearInterval(timerRefresher)
        currentElement = list

        list = list.parentElement!
    } else {
        currentElement = list.firstElementChild
        Repeater.resetChildren(list)
    }

    subtimerFinished()
}

