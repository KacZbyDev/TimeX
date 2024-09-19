import { Subtimer } from './subtimer.js'
import { Utils } from './utils.js'

window.addEventListener('load', () => {
    Timer.initialize()
});

export class Timer {
    public static currentMiliseconds: number
    public static elapsedTime:number

    public static timerRefresherStopped:boolean = true
    public static timerRefresher: NodeJS.Timeout

    public static bigTimerDisplay: HTMLElement
    public static progress_bar: HTMLElement

    public static list: Element//the list in which the current subtimer is 
    public static currentElement:Element | null

    public static currentSubtimer: Subtimer

    static initialize():void {
        this.bigTimerDisplay = document.getElementById('big-timer-time')!
        this.progress_bar = document.getElementById('progress-bar')!
        this.list = document.getElementById('list-content')!
        
        this.startTimer()
    }
    
    static startTimer():void {
        this.currentElement = this.list.firstElementChild!
        
        Subtimer.startNewSubtimer()
        
        //the time before the timer updated
        this.elapsedTime = Date.now()
        
        if(this.timerRefresherStopped) {//if the timerRefresher is not started
            this.timerRefresherStopped = false
            this.timerRefresher = setInterval(() => this.updateTime(), Utils.REFRESH_DELAY)
        }
    }
    
    static updateTime(): void {
        if (this.currentMiliseconds <= 0)
            Subtimer.subtimerFinished()

        if(this.timerRefresherStopped)
            return;

        //update bigTimer
        let percent = this.currentMiliseconds / this.currentSubtimer.duration * 100
        this.progress_bar.style.setProperty('--value', percent + '')
        this.bigTimerDisplay.textContent = Utils.milisecondsToTime(this.currentMiliseconds);

        // currentSubtimer.element.className = 'subtimer-active';
        (<HTMLElement> this.currentSubtimer.element).style.setProperty('--value', percent + '')

        //the time elapsed after the last call
        this.currentMiliseconds -= Date.now() - this.elapsedTime
        this.elapsedTime = Date.now()
    }
}