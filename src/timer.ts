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
    public static elementClicked: HTMLElement

    static initialize(): void {
        Timer.listInitialSize = Timer.listOfSubtimers.getBoundingClientRect().right
        this.resizer.addEventListener('mousedown', () => {
            window.addEventListener('mousemove', Utils.resize);
            window.addEventListener('mouseup', Utils.stopResize);
        });

        (this.list as HTMLElement).addEventListener('mousedown', (event: MouseEvent) => {
            Timer.elementClicked = <HTMLElement>event.target
        
            if (!Timer.elementClicked.className.includes('subtimer') && !Timer.elementClicked.parentElement!.className.includes('subtimer'))
                return

            window.addEventListener('mousemove', this.changeTime);
            window.addEventListener('mouseup', this.stopChangingTime);
        });

        this.startTimer()
    }

    static startTimer(): void {
        this.currentElement = this.list.firstElementChild!
        Subtimer.startNewSubtimer()
        this.resumeTimer()
    }

    static updateTime(): void {
        if (Timer.currentMiliseconds <= 0)
            Subtimer.subtimerFinished()

        if (Timer.timerRefresherStopped)
            return;

        //update bigTimer
        let percent = Timer.currentMiliseconds / Timer.currentSubtimer.duration * 100
        Timer.progress_bar.style.setProperty('--value', percent + '')
        Timer.bigTimerDisplay.textContent = Utils.milisecondsToTime(Timer.currentMiliseconds);

        // currentSubtimer.element.className = 'subtimer-active';
        (<HTMLElement>Timer.currentSubtimer.element).style.setProperty('--value', percent + '')

        //the time elapsed after the last call
        Timer.currentMiliseconds -= Date.now() - Timer.elapsedTime
        Timer.elapsedTime = Date.now()
    }

    static changeTime(event: MouseEvent): void {
        let elementClicked = Timer.elementClicked
        if (elementClicked.parentElement!.className.includes('subtimer'))
            elementClicked = elementClicked.parentElement!
        
        Timer.currentElement = elementClicked
        Timer.list = Timer.currentSubtimer.element!.parentElement!
        Repeater.resetChildren(Timer.list)

        let percentage = (event.clientX - elementClicked.offsetLeft + 2) / elementClicked.clientWidth * 100
        percentage = Math.min(percentage, 100)
        percentage = Math.max(percentage, 0)
        if (elementClicked != Timer.currentSubtimer.element) {
            Timer.currentSubtimer.element.className = 'subtimer';
        }
        Timer.currentSubtimer = new Subtimer(elementClicked)

        document.getElementById('current-subtimer-name')!.textContent! = Timer.currentSubtimer.name
        
        Timer.currentMiliseconds = percentage * Timer.currentSubtimer.duration / 100
        elementClicked.style.setProperty('--value', percentage + '')
        Timer.progress_bar.style.setProperty('--value', percentage + '')
        Timer.bigTimerDisplay.textContent = Utils.milisecondsToTime(Timer.currentMiliseconds);
        
        Timer.pauseTimer()
    }

    static stopChangingTime(): void {
        window.removeEventListener('mousemove', Timer.changeTime);
        window.removeEventListener('mouseup', Timer.stopChangingTime);

        Timer.resumeTimer()
    }

    static killTimer(): void {
        this.pauseTimer()

        Timer.bigTimerDisplay.textContent = 'DONE'
        Timer.currentSubtimer.element.className = 'subtimer'
        Timer.progress_bar.style.setProperty('--value', '0')
    }

    static pauseTimer() {
        Timer.timerRefresherStopped = true
        clearInterval(Timer.timerRefresher)
    }

    static resumeTimer(): void {
        if(Timer.bigTimerDisplay.textContent == 'DONE')
            return

        //the time before the timer updated
        this.elapsedTime = Date.now()

        if (this.timerRefresherStopped) {//if the timerRefresher is not started
            this.timerRefresherStopped = false
            this.timerRefresher = setInterval(this.updateTime, Utils.REFRESH_DELAY)
        }
    }
}