import { Subtimer } from './subtimer.js'
import { Utils } from './utils.js'

const refreshDelay: number = 100;

let timerRefresher: NodeJS.Timeout
let bigTimerDisplay: HTMLElement
let progress_bar: HTMLElement
let list: Element
let currentElement:Element | null

let firstSubtimer: Subtimer
let currentSubtimer: Subtimer

let miliseconds: number;

window.addEventListener('load', () => {
    bigTimerDisplay = document.getElementById('big-timer-time')!
    progress_bar = document.getElementById('progress-bar')!
    list = document.getElementById('list-content')!
    currentElement = list.firstElementChild!

    loadFirstSubtimer()

    timerRefresher = setInterval(updateTime, refreshDelay)
});

function loadFirstSubtimer(): void {
    firstSubtimer = new Subtimer(currentElement!)
    currentSubtimer = firstSubtimer
    miliseconds = currentSubtimer.miliseconds
}

function updateTime(): void {
    let percent = 100 - miliseconds / currentSubtimer.miliseconds * 100
    progress_bar.style.setProperty('--value', percent + '')

    miliseconds -= refreshDelay

    if (miliseconds >= 0) {
        currentSubtimer.element!.firstElementChild!.textContent = Utils.milisecondsToTime(miliseconds)
        bigTimerDisplay.textContent = Utils.milisecondsToTime(miliseconds)
    }
    else
        subtimerFinished()
}


function subtimerFinished(): void {
    // Utils.playSubtimerFinish()
    currentSubtimer.element!.firstElementChild!.textContent = 'finished'

    //maybe make a repeater class
    currentElement = currentElement!.nextElementSibling
    console.log(currentElement)

    if (currentElement != null) {
        if (currentElement.className.includes('repeat')) {
            list = currentElement

            currentElement = list.children[1]
        }
        
        currentSubtimer = new Subtimer(currentElement)
        miliseconds = currentSubtimer.miliseconds
        return
    }

    if (list.className.includes('repeat')) {
        let firstChild = list.firstElementChild!
        console.log("this - ")
        console.log(firstChild)

        firstChild.firstElementChild!.textContent = "" + (parseInt(firstChild.firstElementChild!.textContent!) + 1)

        if (parseInt(firstChild.firstElementChild!.textContent!) >= parseInt(firstChild.lastElementChild!.textContent!)) {
            currentElement = list
            list = list.parentElement!
        }
        else 
            currentElement = list.children[0]

        return
    }

    console.log("gata fra")
    bigTimerDisplay!.textContent = 'done'
    clearInterval(timerRefresher)
}