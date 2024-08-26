const decimals = 1
const refreshDelay:number = 100;

let timerRefresher: number
let ul: HTMLElement | null
let bigTimerDisplay: HTMLElement | null

let miliseconds:number = 3000;

import Collections = require('typescript-collections');

window.addEventListener('load', () => {
    ul = document.getElementById('list-content')
    bigTimerDisplay = document.getElementById('big-timer-time')

    var mySet = new Collections.Set<number>();
    console.log(mySet)
    if(ul) {
        timerRefresher = setInterval(Utils.updateBigTimer, refreshDelay)
    }
});

function loadTimers():void {
    
}

class Timer {
    start(): void {
        Utils.updateBigTimer()
    }
}

class Utils {
    static updateBigTimer(): void {
        miliseconds -= refreshDelay;  
        if(miliseconds >= 0) {
            ul!.textContent = Utils.milisecondsToSecondsFormat(miliseconds)
            bigTimerDisplay!.textContent = Utils.milisecondsToSecondsFormat(miliseconds)
        }
        else
            timerRefresherFinished()
    }

    static milisecondsToSecondsFormat(miliseconds:number):string{
        return (miliseconds / 1000).toFixed(decimals)
    }
}

function timerRefresherFinished() :void{
    //if no more timers:
    ul!.textContent = "finished"
    clearInterval(timerRefresher)
}