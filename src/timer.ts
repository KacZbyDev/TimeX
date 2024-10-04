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
    public static ghostSubtimer: HTMLElement
    public static currentState: TimerState = TimerState.Paused
    // private static isChangingTime = false
    private static isGrabbing = false

    static initialize(): void {
        Timer.listInitialSize = Timer.listOfSubtimers.getBoundingClientRect().right
        Timer.resizer.addEventListener('mousedown', () => {
            window.addEventListener('mousemove', Utils.resize);
            window.addEventListener('mouseup', Utils.stopResize);
        });

        Timer.list.addEventListener('mousedown', (event: MouseEvent) => {
            Timer.elementClicked = <HTMLElement>event.target

            if (!Timer.elementClicked.className.includes('subtimer') && !Timer.elementClicked.parentElement!.className.includes('subtimer'))
                return

            Timer.pauseTimer()

            window.addEventListener('mousemove', Timer.changeTime);
            window.addEventListener('mouseup', Timer.stopChangingTime);
        });

        Timer.startTimer()
    }

    static grabbing(event: MouseEvent) {
        Timer.elementClicked.style.left = `${event.clientX - Utils.GRAB_OFFSET_X}px`
        Timer.elementClicked.style.top = `${event.clientY - Utils.GRAB_OFFSET_Y}px`

        //TODO make the ghostElement move
        //
        // Timer.currentElement.parentElement!.removeChild(Timer.currentElement)
        // newParent!.appendChild(Timer.currentElement)
    }

    //TODO add the grabbing mechanic, when the object is grabbed add a placeholder element that moves when the grabbed element moves
    static changeTime(event: MouseEvent): void {
        if (Timer.isGrabbing == false) {
            document.getElementById("all")!.style.cursor = "pointer";
            Timer.isGrabbing = true

            if (Timer.elementClicked.parentElement!.className.includes('subtimer'))
                Timer.elementClicked = Timer.elementClicked.parentElement!
            
            Timer.ghostSubtimer = Timer.elementClicked.cloneNode(true) as HTMLElement
            Timer.ghostSubtimer.className += ' ghost'
            
            const originalWidth = Timer.elementClicked.getBoundingClientRect().width;
            
            Timer.elementClicked.className = 'subtimer absolute';
            Timer.elementClicked.style.setProperty('--subtimer-width', `${originalWidth}px`);
            Timer.elementClicked.style.width = `${originalWidth}px`;
            
            Timer.elementClicked.replaceWith(Timer.ghostSubtimer)
            document.getElementById('list-content')!.appendChild(Timer.elementClicked)
        }

        Timer.grabbing(event)
        return

        // if(Timer.isChangingTime == false) {//Runs only the first time
        //     Timer.currentState = TimerState.Paused
        //     Timer.isChangingTime = true

        //     if (Timer.elementClicked.parentElement!.className.includes('subtimer'))
        //         Timer.elementClicked = Timer.elementClicked.parentElement!

        //     Subtimer.element.className = 'subtimer'
        //     Timer.currentElement = Timer.elementClicked

        //     Timer.list = Timer.currentElement.parentElement!
        //     Repeater.resetChildren(Timer.list)

        //     if(Timer.list.className.includes('repeater') && 
        //         Timer.list.firstElementChild!.firstElementChild!.textContent! == Timer.list.firstElementChild!.children[1]!.textContent!)
        //             Timer.list.firstElementChild!.firstElementChild!.textContent! = (parseInt(Timer.list.firstElementChild!.children[1]!.textContent!) - 1).toString()

        //     Subtimer.startNewSubtimer(Timer.elementClicked)
        // }

        // let percentage = (event.clientX - Timer.currentElement.offsetLeft + 2) / Timer.currentElement.clientWidth * 100
        // percentage = Math.min(percentage, 100)
        // percentage = Math.max(percentage, 0)

        // Timer.currentMiliseconds = percentage * Subtimer.duration / 100
        // Timer.currentElement.style.setProperty('--value', percentage + '')
        // Timer.progress_bar.style.setProperty('--value', percentage + '')
        // Timer.bigTimerDisplay.textContent = Utils.milisecondsToTime(Timer.currentMiliseconds);
    }

    static startTimer(): void {
        Repeater.setListToFirstSubtimerParent(Timer.list)

        if (!Timer.list.id.includes('list'))
            Timer.currentElement = Timer.list.children[1]! as HTMLElement
        else
            Timer.currentElement = Timer.list.firstElementChild! as HTMLElement

        Subtimer.startNewSubtimer(Timer.currentElement)
        // Timer.resumeTimer()
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

        //the time before the timer updated
        Timer.elapsedTime = Date.now()

        if (Timer.currentState == TimerState.Paused) {
            Timer.currentState = TimerState.Active
            Timer.timerRefresher = setInterval(Timer.updateTime, Utils.REFRESH_DELAY)
        }
    }

    static stopChangingTime(): void {
        document.getElementById("all")!.style.cursor = "auto";
        
        Timer.isGrabbing = false
        // Timer.isChangingTime = false
        
        Timer.elementClicked.className = 'subtimer'
        Timer.elementClicked.removeAttribute('style')

        Timer.ghostSubtimer.replaceWith(Timer.elementClicked)

        console.log(document.getElementById('list-content')!.firstElementChild)

        window.removeEventListener('mousemove', Timer.changeTime);
        window.removeEventListener('mouseup', Timer.stopChangingTime);

        Timer.resumeTimer()
    }

    static killTimer(): void {
        Timer.pauseTimer()

        Timer.currentState = TimerState.Finished
        Timer.bigTimerDisplay.textContent = 'DONE'
        Subtimer.element.className = 'subtimer'
        Timer.progress_bar.style.setProperty('--value', '0')
    }
}