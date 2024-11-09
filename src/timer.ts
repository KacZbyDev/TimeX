import { Subtimer } from './subtimer.js'
import { UiHandler } from './ui-handler.js';
import { TimerState, Utils } from './utils.js'

window.addEventListener('load', () => {
    Timer.initialize()
});

export class Timer {
    public static currentMiliseconds: number
    public static elapsedTime: number

    public static timerRefresher: NodeJS.Timeout

    public static list: HTMLElement = document.getElementById('list-content')!
    public static currentElement: HTMLElement

    public static currentState: TimerState = TimerState.Stopped

    static initialize(): void {
        UiHandler.RESIZER.addEventListener('mousedown', () => {
            window.addEventListener('mousemove', UiHandler.resize);
        });
        Timer.list.addEventListener('mousedown', UiHandler.changeTimeListener);
        Timer.list.addEventListener('mousedown', UiHandler.dragElementListener);
        addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key != ' ')
                return
            Utils.toggleStop()
        })
        
        Utils.loadList()
        Timer.activateFirstSubtimer()
    }

    static activateFirstSubtimer(): void {
        Timer.setListToFirstSubtimerParent(UiHandler.LIST_CONTENT)

        Subtimer.startSubtimer(Timer.currentElement)
    }

    // Calculate the current time and update  the UI
    static updateTime(): void {
        if (Timer.currentMiliseconds <= 0)
            Subtimer.startNextSubtimer()

        if (Timer.currentState != TimerState.Active)
            return;

        //update bigTimer
        let percent: number = Timer.currentMiliseconds / Subtimer.duration * 100
        Timer.updateTimeOnUI(percent)

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
        if (Timer.currentState >= TimerState.Finished)
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

        Subtimer.element.className = 'subtimer'
        UiHandler.BIG_TIMER_DISPLAY.textContent = 'DONE'
        UiHandler.PROGRESS_BAR.style.setProperty('--value', '0')
    }

    static updateTimeOnUI(percent: number): void {
        UiHandler.PROGRESS_BAR.style.setProperty('--value', percent + '')
        UiHandler.BIG_TIMER_DISPLAY.textContent = Utils.milisecondsToTime(Timer.currentMiliseconds)
        
        Subtimer.element.style.setProperty('--value', percent + '')
    }

    static setListToFirstSubtimerParent(list: Element):void {
        // Finds the first element with subtimer or subtimer-active class 
        Timer.list = list.querySelector('.subtimer')?.parentElement || list.querySelector('.subtimer-active')!.parentElement!;

        if (Timer.list == UiHandler.LIST_CONTENT)
            Timer.currentElement = Timer.list.children[0] as HTMLElement
        else
            Timer.currentElement = Timer.list.children[1]! as HTMLElement
    }
}