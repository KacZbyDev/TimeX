import { Subtimer } from './subtimer.js'
import { Utils } from './utils.js'

window.addEventListener('load', () => {
    Timer.initialize()
});

export class Timer {
    public static bigTimerDisplay: HTMLElement = document.getElementById('big-timer-time')!
    public static progress_bar: HTMLElement = document.getElementById('progress-bar')!

    private static listOfSubtimers: HTMLElement = document.getElementById('list-of-subtimer')!;
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
        Timer.sizeBeforeResize = Timer.listOfSubtimers.getBoundingClientRect().right 
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
        const maxSize = window.innerWidth - document.getElementById('timer')!.getBoundingClientRect().width// - 10
        const startingEffectAtX = maxSize - 100
        
        if (Timer.isResizing) {
            let desiredX = e.clientX // - Timer.listOfSubtimers.getBoundingClientRect().left
            let newWidth = e.clientX// = desiredX 
            let remainingSize = maxSize - Timer.listOfSubtimers.getBoundingClientRect().width

            console.log(maxSize)
            console.log(newWidth)
            console.log(remainingSize)

            if(newWidth > startingEffectAtX) {
                // let val = (newWidth - Timer.listOfSubtimers.getBoundingClientRect().width) * 5
                // letval = (100 - remainingSize) / 2
                let val = (desiredX - Timer.listOfSubtimers.getBoundingClientRect().width) / 5

                // val = Math.min(val, desiredX - Timer.listOfSubtimers.getBoundingClientRect().width)
                //val /= remainingSize

                newWidth = startingEffectAtX + val
            }

            newWidth = Math.max(newWidth, Timer.sizeBeforeResize);
            newWidth = Math.min(newWidth, maxSize)

            Timer.listOfSubtimers.style.width = `${newWidth}px`;
         }
    }

    static stopResize():void {
        this.isResizing = false;

        window.removeEventListener('mousemove', Timer.resize);
        window.removeEventListener('mouseup', Timer.stopResize);
    }
}