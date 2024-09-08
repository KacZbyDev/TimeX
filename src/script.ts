import { Subtimer } from './subtimer.js'
import { Utils } from './utils.js'
import { Repeater } from './repeater.js'

const refreshDelay: number = 10;
let miliseconds: number;

let timerRefresher: NodeJS.Timeout
let bigTimerDisplay: HTMLElement
let progress_bar: HTMLElement
let list: Element
let currentElement:Element | null

let currentSubtimer: Subtimer

window.addEventListener('load', () => {
    bigTimerDisplay = document.getElementById('big-timer-time')!
    progress_bar = document.getElementById('progress-bar')!
    list = document.getElementById('list-content')!
    currentElement = list.firstElementChild!

    currentSubtimer = new Subtimer(currentElement!)
    miliseconds = currentSubtimer.miliseconds

    timerRefresher = setInterval(updateTime, refreshDelay)
});

function updateTime(): void {
    if (miliseconds <= 0)
        subtimerFinished()
    
    let percent = miliseconds / currentSubtimer.miliseconds * 100
    progress_bar.style.setProperty('--value', percent + '')
    bigTimerDisplay.textContent = Utils.milisecondsToTime(miliseconds)

    currentSubtimer.time.textContent = Utils.milisecondsToTime(miliseconds)
    miliseconds -= refreshDelay
    
    if(miliseconds < 0) {
        clearInterval(timerRefresher)
        bigTimerDisplay.textContent = "DONE"
        currentSubtimer.time.textContent = 'finished'
    }
}

function subtimerFinished(): void {
    currentElement = currentElement!.nextElementSibling

    if (currentElement) {
        if (currentElement.className.includes('repeater')) {
            list = currentElement

            Repeater.setListToFirstSubtimerParent(list)

            currentElement = list.children[1]
        }

        currentSubtimer.time.textContent = 'finished'
        currentSubtimer = new Subtimer(currentElement)

        miliseconds = currentSubtimer.miliseconds
        return
    }

    if (list.className.includes('repeater'))
        repeaterReachEnd()
}

function repeaterReachEnd():void {
    let repeatValues = list.firstElementChild!
    let currentRepeats = parseInt(repeatValues.firstElementChild!.textContent!) + 1
    let totalRepeats = parseInt(repeatValues.lastElementChild!.textContent!)
    
    repeatValues.firstElementChild!.textContent = currentRepeats + ""
    
    if (currentRepeats >= totalRepeats) {//repeater is done
        if(currentRepeats > totalRepeats)
            clearInterval(timerRefresher)
        currentElement = list

        list = list.parentElement!
    } else {
        currentElement = list.firstElementChild
        Repeater.resetChildren(list)
    }
    subtimerFinished()
}

