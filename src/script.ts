const decimals = 1
const refreshDelay:number = 100;

let timerRefresher:number
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

    timerRefresher = setInterval(Utils.updateTimer, refreshDelay)
});

function loadTimers():void {
    let subtimersElements:HTMLCollection = document.getElementById('list-content')!.children

    while(Subtimer.Count < subtimersElements.length) {
        queueSubtimers[Subtimer.Count] = new Subtimer(subtimersElements.item(Subtimer.Count)!)
    }
}

class Subtimer {
    public static Count:number = 0
    public readonly ID:number

    public element:Element
    public name:string
    public readonly miliseconds:number

    constructor(element:Element) {
        this.ID = Subtimer.Count
        Subtimer.Count++

        this.element = element
        
        this.name = element!.firstElementChild!.textContent!
        this.miliseconds = Utils.timeToMiliseconds(element!.lastElementChild!.textContent!)
    }
}

class Utils {
    static updateTimer(): void {
        let percent = 100 - miliseconds / currentSubtimer.miliseconds * 100
        console.log(document.getElementById('progress-bar')!.style.setProperty('--value', percent +''))
        miliseconds -= refreshDelay

        if(miliseconds >= 0) {
            currentSubtimer.element!.firstElementChild!.textContent = Utils.milisecondsToTime(miliseconds)
            bigTimerDisplay.textContent = Utils.milisecondsToTime(miliseconds)
        }
        else
            subtimerFinished()
    }

    static timeToMiliseconds(time:string): number {
        if (time.length > 2)
            return this.timeToMiliseconds(time.substring(time.length - 2, time.length)) +
                this.timeToMiliseconds(time.substring(0, time.length - 3)) * 60

        return parseInt(time) * 1000
    }

    static milisecondsToTime(miliseconds:number):string {
        let seconds:number = (miliseconds / 1000)
        let minutes:number = Math.floor(seconds / 60)
        let hours:number = Math.floor(minutes / 60)
        seconds %= 60
        minutes %= 60

        let res:string = ''
        if(hours > 0) {
            res += hours + ':'
            if(minutes < 10)
                res += '0'
        }
        if(minutes > 0 || hours > 0) {
            res += minutes + ':'
            if(seconds < 10)
                res += '0'
        }

        return res + seconds.toFixed(decimals) 
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