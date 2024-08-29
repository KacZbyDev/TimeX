const decimals = 1
const refreshDelay:number = 100;

let timerRefresher: number
let bigTimerDisplay: HTMLElement | null

let queueTimers:Timer[] = []
let currentTimer:Timer

let miliseconds:number = 3000;

window.addEventListener('load', () => {
    loadTimers()
    currentTimer = queueTimers[0] 

    bigTimerDisplay = document.getElementById('big-timer-time')

    timerRefresher = setInterval(Utils.updateBigTimer, refreshDelay)
});

function loadTimers():void {
    queueTimers[0] = new Timer(3000, document.getElementById('timey1'))
    queueTimers[1] = new Timer(3000, document.getElementById('timey2'))
}

class Timer {
    public static timersCount:number = 0
    public readonly timerID:number

    public element:HTMLElement | null
    public readonly miliseconds:number

    //idea
    // public subTimers:Timer[] = []

    constructor(miliseconds:number, element:HTMLElement | null) {
        this.miliseconds = miliseconds
        this.element = element

        this.timerID = Timer.timersCount
        Timer.timersCount++
    }

    start(): void {
        Utils.updateBigTimer()
    }
}

class Utils {
    static updateBigTimer(): void {
        miliseconds -= refreshDelay;
        if(miliseconds >= 0) {
            currentTimer.element!.textContent = Utils.milisecondsToSecondsFormat(miliseconds)
            bigTimerDisplay!.textContent = Utils.milisecondsToSecondsFormat(miliseconds)
        }
        else
            timeyFinished()
    }

    static milisecondsToSecondsFormat(miliseconds:number):string{
        return (miliseconds / 1000).toFixed(decimals)
    }
}

function timeyFinished() :void {
    currentTimer.element!.textContent = "finished"

    //if there are more
    if(currentTimer.timerID < Timer.timersCount - 1) {
        currentTimer = queueTimers[currentTimer.timerID + 1]
        miliseconds = currentTimer.miliseconds
    } else {
        bigTimerDisplay!.textContent = "done"
        clearInterval(timerRefresher)
    }
}