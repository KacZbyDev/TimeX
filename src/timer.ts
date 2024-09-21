import { Subtimer } from './subtimer.js'
import { Utils } from './utils.js'

window.addEventListener('load', () => {
    Timer.initialize()
});

export class Timer {
    public static bigTimerDisplay: HTMLElement = document.getElementById('big-timer-time')!
    public static progress_bar: HTMLElement = document.getElementById('progress-bar')!

    private static resizable: HTMLElement = document.getElementById('list-of-subtimer')!;
    private static resizer: HTMLElement= document.getElementById('resizer')!;
    private static isResizing = false;
    private static sizeBeforeResize: number;

    public static currentMiliseconds: number
    public static elapsedTime:number

    public static timerRefresherStopped:boolean = true
    public static timerRefresher: NodeJS.Timeout

    public static list: Element = document.getElementById('list-content')!//the list in which the current subtimer is 
    public static currentElement:Element | null

    public static currentSubtimer: Subtimer

    static initialize():void {
        Timer.sizeBeforeResize = Timer.resizable.getBoundingClientRect().right 
        this.resizer.addEventListener('mousedown', () => {
            this.isResizing = true;
            
            window.addEventListener('mousemove', this.resize);
            window.addEventListener('mouseup', this.stopResize);
        });

        this.startTimer()
    }
    
    static startTimer():void {
        this.currentElement = this.list.firstElementChild!
        
        Subtimer.startNewSubtimer()
        
        this.resumeTimer()
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

    static resumeTimer():void {
        //the time before the timer updated
        this.elapsedTime = Date.now()

        if(this.timerRefresherStopped) {//if the timerRefresher is not started
            this.timerRefresherStopped = false
            this.timerRefresher = setInterval(() => this.updateTime(), Utils.REFRESH_DELAY)
        }
    }

    static resize(e: MouseEvent) {
        if (Timer.isResizing) {
            
            const newWidth = Math.max(e.clientX - Timer.resizable.getBoundingClientRect().left + 10, Timer.sizeBeforeResize);
            Timer.resizable.style.width = `${newWidth}px`;
        }
    }

    static stopResize():void {
        this.isResizing = false;

        window.removeEventListener('mousemove', Timer.resize);
        window.removeEventListener('mouseup', Timer.stopResize);
    }
}