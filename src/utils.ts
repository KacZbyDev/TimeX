import { Timer } from './timer.js'
import { Repeater } from './repeater.js';
import { Subtimer } from './subtimer.js'

export enum TimerState {
    Active,
    Paused,
    Finished,
};

export class Utils {
    public static readonly DRAG_OFFSET_X = 18
    public static readonly DRAG_OFFSET_Y = 136

    private static readonly DECIMALS: number = 1
    public static readonly REFRESH_DELAY: number = 10 //how many miliseconds it takes for the time to update

    private static readonly SUBTIMER_FINISH: HTMLAudioElement = new Audio('../res/timer-ending-sound.mp3')
    
    private static isChangingTime = false
    private static isDragging = false
    public static elementClicked: HTMLElement
    public static ghostSubtimer: HTMLElement

    static playSubtimerFinish(): void {
        this.SUBTIMER_FINISH.play()
    }

    static resize(e: MouseEvent) {
        const maxSize = window.innerWidth - document.getElementById('timer')!.getBoundingClientRect().width - 10;
        const startingEffectAtX = maxSize - 100;

        let newWidth = Timer.listOfSubtimers.getBoundingClientRect().width;
        let offset = e.movementX

        //If it is in the effect zone it moves slower
        if (newWidth > startingEffectAtX) {
            offset /= 5;
        }

        newWidth += offset

        //Apply limits
        newWidth = Math.max(newWidth, Timer.listInitialSize);
        newWidth = Math.min(newWidth, maxSize);

        // Apply new width
        Timer.listOfSubtimers.style.width = `${newWidth}px`;

    }

    static stopResize(): void {
        window.removeEventListener('mousemove', Utils.resize);
        window.removeEventListener('mouseup', Utils.stopResize);
    }

    //takes a string of format: 12:34:56 and transforms it into seconds
    static timeToSeconds(time: string): number {
        if (time.length > 2)
            return this.timeToSeconds(time.substring(time.length - 2, time.length)) +
                this.timeToSeconds(time.substring(0, time.length - 3)) * 60

        return parseInt(time) * 1000
    }

    //converts miliseconds into 12:34:56.7 format
    static milisecondsToTime(miliseconds: number): string {
        let seconds: number = (miliseconds / 1000)
        let minutes: number = Math.floor(seconds / 60)
        let hours: number = Math.floor(minutes / 60)
        seconds %= 60
        minutes %= 60

        let res: string = ''
        if (hours > 0) {
            res += hours + ':'
            if (minutes < 10)
                res += '0'
        }
        if (minutes > 0 || hours > 0) {
            res += minutes + ':'
            if (seconds < 10)
                res += '0'
        }
        return res + seconds.toFixed(this.DECIMALS)
    }

    static addTimer(name: string, duration: string): void {
        let parentList: HTMLElement = document.getElementById('list-content')!
        let newElement: HTMLElement = document.getElementById('subtimer-example')!.cloneNode(true) as HTMLElement

        newElement.querySelector('.name')!.textContent = name

        newElement.querySelector('.duration')!.textContent = duration

        parentList.appendChild(newElement)
    }

    static dragSubtimerListener(event: MouseEvent): void {
        let elementClicked:HTMLElement = <HTMLElement> event.target
        
        if (!elementClicked.className.includes('drag-button') || Timer.currentState != TimerState.Paused)
            return
        
        Utils.elementClicked = elementClicked.parentElement!
        
        window.addEventListener('mousemove', Utils.dragSubtimer);
        window.addEventListener('mouseup', Utils.draggingSubtimerStopped);
    }
    
    static dragSubtimer(event: MouseEvent) {
        //TODO make the draggedSubtimer have the left blue Time thing still showing if its active
        if (Utils.isDragging == false) {
            document.getElementById("all")!.style.cursor = "pointer";
            Utils.isDragging = true

            Utils.ghostSubtimer = Utils.elementClicked.cloneNode(true) as HTMLElement
            Utils.ghostSubtimer.className += ' ghost'
            
            const originalWidth = Utils.elementClicked.getBoundingClientRect().width;
            
            Utils.elementClicked.className = 'subtimer absolute';
            Utils.elementClicked.style.setProperty('--subtimer-width', `${originalWidth}px`);
            Utils.elementClicked.style.width = `${originalWidth}px`;
            
            Utils.elementClicked.replaceWith(Utils.ghostSubtimer)
            document.getElementById('list-content')!.appendChild(Utils.elementClicked)
        }

        Utils.elementClicked.style.left = `${event.clientX - Utils.DRAG_OFFSET_X}px`
        Utils.elementClicked.style.top = `${event.clientY - Utils.DRAG_OFFSET_Y}px`
        
        //TODO make the ghostElement move
    }
    
    static draggingSubtimerStopped() {
        document.getElementById("all")!.style.cursor = "auto";

        if(Utils.isDragging) {
            Utils.isDragging = false
            Utils.elementClicked.removeAttribute('style')
            Utils.ghostSubtimer.replaceWith(Utils.elementClicked)
        }

        Utils.elementClicked.className = 'subtimer'

        window.removeEventListener('mousemove', Utils.dragSubtimer);
        window.removeEventListener('mouseup', Utils.draggingSubtimerStopped);
    }

    static changeTimeListener(event: MouseEvent): void {
        let elementClicked:HTMLElement = <HTMLElement> event.target
        
        if(elementClicked.className.includes('drag-button'))
            return

        if(elementClicked.parentElement!.className.includes('subtimer'))
            elementClicked = elementClicked.parentElement!

        if (!elementClicked.className.includes('subtimer'))
            return

        Timer.pauseTimer()

        Utils.elementClicked = elementClicked

        window.addEventListener('mousemove', Utils.changeTime);
        window.addEventListener('mouseup', Utils.changingTimeStopped);
    }
    
    static changeTime(event: MouseEvent): void {
        if(Utils.isChangingTime == false) {
            Utils.isChangingTime = true

            Timer.currentState = TimerState.Paused
            Subtimer.element.className = 'subtimer'

            Timer.currentElement = Utils.elementClicked
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
        Utils.isChangingTime = false

        window.removeEventListener('mousemove', Utils.changeTime);
        window.removeEventListener('mouseup', Utils.changingTimeStopped);

        Timer.resumeTimer()
    }
}