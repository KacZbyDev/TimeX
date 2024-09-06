import { Subtimer } from './subtimer.js'
import { Utils } from './utils.js'

const refreshDelay: number = 100;
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

    currentSubtimer.element!.firstElementChild!.textContent = Utils.milisecondsToTime(miliseconds)
    miliseconds -= refreshDelay
    
    if(miliseconds < 0) {
        clearInterval(timerRefresher)
        bigTimerDisplay.textContent = "DONE"
    currentSubtimer.element!.firstElementChild!.textContent = 'finished'

    }
}

function subtimerFinished(): void {
    Utils.playSubtimerFinish()
    
    currentElement = currentElement!.nextElementSibling
    
    if (currentElement != null) {
        if (currentElement.className.includes('repeat')) {
            list = currentElement
            currentElement = list.children[1]
        }

        currentSubtimer.element!.firstElementChild!.textContent = 'finished'
        currentSubtimer = new Subtimer(currentElement)

        miliseconds = currentSubtimer.miliseconds
        return
    }

    if (list.className.includes('repeat')) {
        let firstChild = list.firstElementChild!

        firstChild.firstElementChild!.textContent = "" + (parseInt(firstChild.firstElementChild!.textContent!) + 1)

        if (parseInt(firstChild.firstElementChild!.textContent!) >= parseInt(firstChild.lastElementChild!.textContent!)) {
            currentElement = list
            list = list.parentElement!
        }
        else 
            currentElement = list.children[0]

        subtimerFinished()
    }
}