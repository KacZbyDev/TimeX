import { Repeater } from './repeater.js';
import { Subtimer } from './subtimer.js'
import { Utils } from './utils.js'

window.addEventListener('load', () => {
    Timer.initialize()
});

export class Timer {
    public static bigTimerDisplay: HTMLElement = document.getElementById('big-timer-time')!
    public static progress_bar: HTMLElement = document.getElementById('progress-bar')!

    public static listOfSubtimers: HTMLElement = document.getElementById('list-of-subtimer')!;
    public static resizer: HTMLElement = document.getElementById('resizer')!;
    public static listInitialSize: number;

    public static currentMiliseconds: number
    public static elapsedTime: number

    public static timerRefresherStopped: boolean = true
    public static timerRefresher: NodeJS.Timeout

    public static list: Element = document.getElementById('list-content')!
    public static currentElement: Element | null

    public static currentSubtimer: Subtimer

    static initialize(): void {
        Timer.listInitialSize = Timer.listOfSubtimers.getBoundingClientRect().right
        this.resizer.addEventListener('mousedown', () => {
            window.addEventListener('mousemove', Utils.resize);
            window.addEventListener('mouseup', Utils.stopResize);
        });

        this.list.addEventListener('mousedown', () => {
            window.addEventListener('mousemove', this.changeTime);
            window.addEventListener('mouseup', this.stopChangingTime);
        });

        this.startTimer()
    }

    static changeTime(event: MouseEvent): void {
        let elementClicked = <HTMLElement>event.target
        
        if (!elementClicked.className.includes('subtimer') && !elementClicked.parentElement!.className.includes('subtimer'))
            return
        if (elementClicked.parentElement!.className.includes('subtimer'))
            elementClicked = elementClicked.parentElement!
        
        Timer.currentElement = elementClicked
        Timer.list = Timer.currentSubtimer.element!.parentElement!

        let percentage = (event.clientX - elementClicked.clientLeft) / elementClicked.clientWidth * 100
        
        if (elementClicked != Timer.currentSubtimer.element) {
            Timer.currentSubtimer.element.className = 'subtimer';
            Timer.currentSubtimer = new Subtimer(elementClicked)
        }

        Repeater.resetChildren(Timer.list)
        
        Timer.currentMiliseconds = percentage * Timer.currentSubtimer.duration / 100
        elementClicked.style.setProperty('--value', percentage + '')
        Timer.progress_bar.style.setProperty('--value', percentage + '')
        Timer.bigTimerDisplay.textContent = Utils.milisecondsToTime(Timer.currentMiliseconds);
        
        console.log(Timer.currentSubtimer)
        Timer.pauseTimer()
    }

    static stopChangingTime(): void {
        window.removeEventListener('mousemove', Timer.changeTime);
        window.removeEventListener('mouseup', this.stopChangingTime);

        Timer.resumeTimer()
    }

    static updateTime(): void {
        if (this.currentMiliseconds <= 0)
            Subtimer.subtimerFinished()

        if (this.timerRefresherStopped)
            return;

        //update bigTimer
        let percent = this.currentMiliseconds / this.currentSubtimer.duration * 100
        this.progress_bar.style.setProperty('--value', percent + '')
        this.bigTimerDisplay.textContent = Utils.milisecondsToTime(this.currentMiliseconds);

        // currentSubtimer.element.className = 'subtimer-active';
        (<HTMLElement>this.currentSubtimer.element).style.setProperty('--value', percent + '')

        //the time elapsed after the last call
        this.currentMiliseconds -= Date.now() - this.elapsedTime
        this.elapsedTime = Date.now()
    }

    static startTimer(): void {
            this.currentElement = this.list.firstElementChild!

            Subtimer.startNewSubtimer()

            this.resumeTimer()
    }

    static killTimer(): void {
        Timer.timerRefresherStopped = true
        clearInterval(Timer.timerRefresher)
        this.list.addEventListener('mousedown', () => {})

        Timer.bigTimerDisplay.textContent = 'DONE'
        Timer.currentSubtimer.element.className = 'subtimer'
        Timer.progress_bar.style.setProperty('--value', '0')
    }

    static pauseTimer() {
        Timer.timerRefresherStopped = true
        clearInterval(Timer.timerRefresher)
    }

    static resumeTimer(): void {
        //the time before the timer updated
        this.elapsedTime = Date.now()

        if (this.timerRefresherStopped) {//if the timerRefresher is not started
            this.timerRefresherStopped = false
            this.timerRefresher = setInterval(() => this.updateTime(), Utils.REFRESH_DELAY)
        }
    }
}