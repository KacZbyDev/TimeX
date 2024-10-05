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

    private static isChangingTime = false
    private static isDragging = false

    static initialize(): void {
        Timer.listInitialSize = Timer.listOfSubtimers.getBoundingClientRect().right
        Timer.resizer.addEventListener('mousedown', () => {
            window.addEventListener('mousemove', Utils.resize);
            window.addEventListener('mouseup', Utils.stopResize);
        });
        Timer.list.addEventListener('mousedown', Timer.changeTimeListener);
        Timer.list.addEventListener('mousedown', Timer.dragSubtimerListener);

        Timer.startTimer()
    }
    
    static dragSubtimerListener(event: MouseEvent): void {
        let elementClicked:HTMLElement = <HTMLElement> event.target
        
        if (!elementClicked.className.includes('drag-button'))
            return
        
        Timer.elementClicked = elementClicked.parentElement!
        
        window.addEventListener('mousemove', Timer.dragSubtimer);
        window.addEventListener('mouseup', Timer.draggingSubtimerStopped);
    }
    
    static dragSubtimer(event: MouseEvent) {
        //TODO make the draggedSubtimer have the left blue Time thing still showing if its active
        if (Timer.isDragging == false) {
            document.getElementById("all")!.style.cursor = "pointer";
            Timer.isDragging = true

            Timer.ghostSubtimer = Timer.elementClicked.cloneNode(true) as HTMLElement
            Timer.ghostSubtimer.className += ' ghost'
            
            const originalWidth = Timer.elementClicked.getBoundingClientRect().width;
            
            Timer.elementClicked.className = 'subtimer absolute';
            Timer.elementClicked.style.setProperty('--subtimer-width', `${originalWidth}px`);
            Timer.elementClicked.style.width = `${originalWidth}px`;
            
            Timer.elementClicked.replaceWith(Timer.ghostSubtimer)
            document.getElementById('list-content')!.appendChild(Timer.elementClicked)
        }

        Timer.elementClicked.style.left = `${event.clientX - Utils.DRAG_OFFSET_X}px`
        Timer.elementClicked.style.top = `${event.clientY - Utils.DRAG_OFFSET_Y}px`
        
        //TODO make the ghostElement move
    }
    
    static draggingSubtimerStopped() {
        document.getElementById("all")!.style.cursor = "auto";

        if(Timer.isDragging) {
            Timer.isDragging = false
            Timer.elementClicked.removeAttribute('style')
            Timer.ghostSubtimer.replaceWith(Timer.elementClicked)
        }

        Timer.elementClicked.className = 'subtimer'

        window.removeEventListener('mousemove', Timer.dragSubtimer);
        window.removeEventListener('mouseup', Timer.draggingSubtimerStopped);
    }

    static changeTimeListener(event: MouseEvent): void {
        let elementClicked:HTMLElement = <HTMLElement> event.target

        if(elementClicked.parentElement!.className.includes('subtimer'))
            elementClicked = elementClicked.parentElement!

        if (!elementClicked.className.includes('subtimer'))
            return

        Timer.pauseTimer()

        Timer.elementClicked = elementClicked

        window.addEventListener('mousemove', Timer.changeTime);
        window.addEventListener('mouseup', Timer.changingTimeStopped);
    }
    
    static changeTime(event: MouseEvent): void {
        if(Timer.isChangingTime == false) {
            Timer.isChangingTime = true

            Timer.currentState = TimerState.Paused
            Subtimer.element.className = 'subtimer'

            Timer.currentElement = Timer.elementClicked
            Timer.list = Timer.currentElement.parentElement!
            Repeater.resetChildren(Timer.list)

            if(Timer.list.className.includes('repeater') && 
                Timer.list.firstElementChild!.firstElementChild!.textContent! == Timer.list.firstElementChild!.children[1]!.textContent!)
                    Timer.list.firstElementChild!.firstElementChild!.textContent! = (parseInt(Timer.list.firstElementChild!.children[1]!.textContent!) - 1).toString()

            Subtimer.startNewSubtimer(Timer.currentElement)
        }

        let percentage = (event.clientX - Timer.currentElement.offsetLeft + 2) / Timer.currentElement.clientWidth * 100
        percentage = Math.min(percentage, 100)
        percentage = Math.max(percentage, 0)

        Timer.currentMiliseconds = percentage * Subtimer.duration / 100
        Timer.currentElement.style.setProperty('--value', percentage + '')
        Timer.progress_bar.style.setProperty('--value', percentage + '')
        Timer.bigTimerDisplay.textContent = Utils.milisecondsToTime(Timer.currentMiliseconds);
    }

    static changingTimeStopped(): void {
        Timer.isChangingTime = false

        window.removeEventListener('mousemove', Timer.changeTime);
        window.removeEventListener('mouseup', Timer.changingTimeStopped);

        Timer.resumeTimer()
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

    static killTimer(): void {
        Timer.pauseTimer()

        Timer.currentState = TimerState.Finished
        Timer.bigTimerDisplay.textContent = 'DONE'
        Subtimer.element.className = 'subtimer'
        Timer.progress_bar.style.setProperty('--value', '0')
    }
}