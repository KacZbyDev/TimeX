import { Repeater } from './repeater.js';
import { Subtimer } from './subtimer.js'
import { TimerState, Utils } from './utils.js'

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

    public static timerRefresher: NodeJS.Timeout

    public static list: HTMLElement = document.getElementById('list-content')!
    public static currentElement: HTMLElement

    public static elementClicked: HTMLElement

    public static timerState:TimerState = TimerState.Paused

    static initialize(): void {
        Timer.listInitialSize = Timer.listOfSubtimers.getBoundingClientRect().right
        this.resizer.addEventListener('mousedown', () => {
            window.addEventListener('mousemove', Utils.resize);
            window.addEventListener('mouseup', Utils.stopResize);
        });

        this.list.addEventListener('mousedown', (event: MouseEvent) => {
            Timer.elementClicked = <HTMLElement>event.target
        
            if (!Timer.elementClicked.className.includes('subtimer') && !Timer.elementClicked.parentElement!.className.includes('subtimer'))
                return

            Timer.pauseTimer()

            window.addEventListener('mousemove', this.changeTime);
            window.addEventListener('mouseup', this.stopChangingTime);
        });

        this.startTimer()
    }

    static startTimer(): void {
        if(this.list.id.includes('list')) {
            Repeater.setListToFirstSubtimerParent(Timer.list)
            this.currentElement = Timer.list.children[1]! as HTMLElement
        }
        else 
            this.currentElement = this.list.firstElementChild! as HTMLElement
        
        Subtimer.startNewSubtimer(this.currentElement)
        this.resumeTimer()
    }

    static updateTime(): void {
        if (Timer.currentMiliseconds <= 0)
            Subtimer.subtimerFinished()
        
        if (Timer.timerState != TimerState.Active)
            return;

        //update bigTimer
        let percent = Timer.currentMiliseconds / Subtimer.duration * 100
        Timer.progress_bar.style.setProperty('--value', percent + '')
        Timer.bigTimerDisplay.textContent = Utils.milisecondsToTime(Timer.currentMiliseconds);

        Subtimer.element.style.setProperty('--value', percent + '')

        //the time elapsed after the last call
        Timer.currentMiliseconds -= Date.now() - Timer.elapsedTime
        Timer.elapsedTime = Date.now()
    }

    static changeTime(event: MouseEvent): void {
        let elementClicked = Timer.elementClicked
        if (elementClicked.parentElement!.className.includes('subtimer'))
            elementClicked = elementClicked.parentElement!
         
        Timer.currentElement = elementClicked
        Timer.list = Subtimer.element!.parentElement!
        Repeater.resetChildren(Timer.list)

        let percentage = (event.clientX - elementClicked.offsetLeft + 2) / Timer.currentElement.clientWidth * 100
        percentage = Math.min(percentage, 100)
        percentage = Math.max(percentage, 0)
        
        if (elementClicked != Subtimer.element) {
            Subtimer.element.className = 'subtimer';
        }

        Subtimer.startNewSubtimer(Timer.currentElement)
        
        Timer.currentMiliseconds = percentage * Subtimer.duration / 100
        Timer.currentElement.style.setProperty('--value', percentage + '')
        Timer.progress_bar.style.setProperty('--value', percentage + '')
        Timer.bigTimerDisplay.textContent = Utils.milisecondsToTime(Timer.currentMiliseconds);

        Timer.timerState = TimerState.Paused
    }
    
    static pauseTimer() {
        if(Timer.timerState == TimerState.Active)
            Timer.timerState = TimerState.Paused
        clearInterval(Timer.timerRefresher)
    }

    static resumeTimer(): void {
        if(this.timerState == TimerState.Finished)
            return
        //the time before the timer updated
        this.elapsedTime = Date.now()

        if (Timer.timerState == TimerState.Paused) {
            Timer.timerState = TimerState.Active
            this.timerRefresher = setInterval(this.updateTime, Utils.REFRESH_DELAY)
        }
    }

    static stopChangingTime(): void {
        window.removeEventListener('mousemove', Timer.changeTime);
        window.removeEventListener('mouseup', Timer.stopChangingTime);

        Timer.resumeTimer()
    }

    static killTimer(): void {
        this.pauseTimer()

        Timer.timerState = TimerState.Finished
        Timer.bigTimerDisplay.textContent = 'DONE'
        Subtimer.element.className = 'subtimer'
        Timer.progress_bar.style.setProperty('--value', '0')
    }
}