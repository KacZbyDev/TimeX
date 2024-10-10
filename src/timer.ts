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

    public static currentState: TimerState = TimerState.Paused

    static initialize(): void {
        Timer.listInitialSize = Timer.listOfSubtimers.getBoundingClientRect().right
        Timer.resizer.addEventListener('mousedown', () => {
            window.addEventListener('mousemove', Utils.resize);
            window.addEventListener('mouseup', Utils.stopResize);
        });
        Timer.list.addEventListener('mousedown', Utils.changeTimeListener);
        Timer.list.addEventListener('mousedown', Utils.dragElementListener);
        addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key != ' ')
                return
            Utils.toggleStop()
        })
        
        Timer.startTimer()
    }

    static startTimer(): void {
        Repeater.setListToFirstSubtimerParent(Timer.list)

        if (!Timer.list.id.includes('list'))
            Timer.currentElement = Timer.list.children[1]! as HTMLElement
        else
            Timer.currentElement = Timer.list.firstElementChild! as HTMLElement

        Subtimer.startNewSubtimer(Timer.currentElement)
        Timer.resumeTimer()
    }

    static updateTime(): void {
        if (Timer.currentMiliseconds <= 0)
            Subtimer.subtimerFinished()

        if (Timer.currentState != TimerState.Active)
            return;

        //update bigTimer
        let percent = Timer.currentMiliseconds / Subtimer.duration * 100
        Timer.progress_bar.style.setProperty('--value', percent + '')
        Timer.bigTimerDisplay.textContent = Utils.milisecondsToTime(Timer.currentMiliseconds);

        console.log(Subtimer.element)
        
        Subtimer.element.style.setProperty('--value', percent + '')

        //the time elapsed after the last call
        Timer.currentMiliseconds -= Date.now() - Timer.elapsedTime
        Timer.elapsedTime = Date.now()
    }

    static pauseTimer() {
        if (Timer.currentState == TimerState.Active)
            Timer.currentState = TimerState.Paused
        clearInterval(Timer.timerRefresher)
    }

    static resumeTimer(): void {
        if (Timer.currentState == TimerState.Finished)
            return
        
        Timer.elapsedTime = Date.now()

        if (Timer.currentState == TimerState.Paused) {
            Timer.currentState = TimerState.Active
            Timer.timerRefresher = setInterval(Timer.updateTime, Utils.REFRESH_DELAY)
        }
    }

    static killTimer(): void {
        Timer.pauseTimer()

        Timer.currentState = TimerState.Finished
        Timer.bigTimerDisplay.textContent = 'DONE'
        Subtimer.element.className = 'subtimer'
        Timer.progress_bar.style.setProperty('--value', '0')
    }
}