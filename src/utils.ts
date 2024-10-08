import { Timer } from './timer.js'
import { Repeater } from './repeater.js';
import { Subtimer } from './subtimer.js'

export enum TimerState {
    Active,
    Paused,
    Stopped,
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

    //take a string of format: 12:34:56 and transform it into seconds
    static timeToSeconds(time: string): number {
        if (time.length > 2)
            return this.timeToSeconds(time.substring(time.length - 2, time.length)) +
                this.timeToSeconds(time.substring(0, time.length - 3)) * 60

        return parseInt(time) * 1000
    }

    static switchElements(element1:HTMLElement, element2:HTMLElement): void {
        let placeholder: HTMLElement = document.createElement('div');
                
        element1.replaceWith(placeholder); 
        element2.replaceWith(element1); 
        placeholder.replaceWith(element2); 
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

    static resize(e: MouseEvent) {
        //TODO try making cursor stick to the resizer, after the resizer moves (this functions is called) so prbly at the end of the function move the cursor's y to the resizer y (prbly offsetWidth + offsetLeft)
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

    static dragSubtimerListener(event: MouseEvent): void {
        let elementClicked:HTMLElement = <HTMLElement> event.target
        
        if (!elementClicked.className.includes('drag-button') || Timer.currentState == TimerState.Active)
            return
        
        Utils.elementClicked = elementClicked.parentElement!
        
        window.addEventListener('mousemove', Utils.dragSubtimer);
        window.addEventListener('mouseup', Utils.draggingSubtimerStopped);
    }
    
    static dragSubtimer(event: MouseEvent) {
        if (Utils.isDragging == false) {
            document.getElementById("all")!.style.cursor = "pointer";
            Utils.isDragging = true

            Utils.ghostSubtimer = Utils.elementClicked.cloneNode(true) as HTMLElement
            Utils.ghostSubtimer.className += ' ghost'
            
            const originalWidth = Utils.elementClicked.getBoundingClientRect().width;
            
            Utils.elementClicked.className += ' absolute';
            Utils.elementClicked.style.setProperty('--subtimer-width', `${originalWidth}px`);
            Utils.elementClicked.style.width = `${originalWidth}px`;
            
            Utils.elementClicked.replaceWith(Utils.ghostSubtimer)
            document.getElementById('list-content')!.appendChild(Utils.elementClicked)
        }

        Utils.elementClicked.style.left = `${event.clientX - Utils.DRAG_OFFSET_X}px`
        Utils.elementClicked.style.top = `${event.clientY - Utils.DRAG_OFFSET_Y}px`
        
        let prevElement: HTMLElement = <HTMLElement>Utils.ghostSubtimer.previousElementSibling!;
        let nextElement: HTMLElement = <HTMLElement>Utils.ghostSubtimer.nextElementSibling!;
        
        Utils.moveBack(prevElement)

        Utils.moveForward(nextElement)


        //TODO make them move inside repeaters maybe the code doesnt need to change much just add the ghost subtimer as a child of repeater instead of switching with it
    }
    
    static moveBack(prevElement: HTMLElement): void {
        if(prevElement == null)  
            return
        if(prevElement.className.includes('repeater-values')) {
            //TODO Could replace this with a function that inserts the element before it's parent, something like while (prevElement != escapedRepeater) switch(preveELement, ghostSubtimer)
            if(Utils.elementClicked.offsetTop + Utils.elementClicked.offsetHeight > prevElement.parentElement!.offsetTop)
                return
            
            Utils.ghostSubtimer.parentElement!.parentElement!.appendChild(Utils.ghostSubtimer)
            Utils.switchElements(Utils.ghostSubtimer, Utils.elementClicked)
            return
        }
        
        if(prevElement.className.includes('repeater')) {
            if(Utils.elementClicked.offsetTop < prevElement.offsetTop) {
                Utils.switchElements(Utils.ghostSubtimer, prevElement)
                return
            }
            
            //consider offset left
            if(Utils.elementClicked.offsetTop + Utils.elementClicked.offsetHeight < prevElement.offsetTop + prevElement.offsetHeight)
                prevElement.appendChild(Utils.ghostSubtimer)
        }

        if(Utils.elementClicked.offsetTop < prevElement.offsetTop)
            Utils.switchElements(Utils.ghostSubtimer, prevElement)
    }

    static moveForward(nextElement: HTMLElement): void {

        if(nextElement == null) {
            if(Utils.ghostSubtimer.parentElement!.className.includes('repeater'))
                if(Utils.elementClicked.offsetTop + Utils.elementClicked.offsetHeight > Utils.ghostSubtimer.parentElement!.offsetTop + Utils.ghostSubtimer.parentElement!.offsetHeight) {
                    //TODO try adding it as the first element before the repeater somehow
                    Utils.ghostSubtimer.parentElement!.parentElement!.append(Utils.ghostSubtimer)
                    this.switchElements(Utils.ghostSubtimer, Utils.elementClicked)
                }
            return
        }
        
        if(nextElement.className.includes('repeater')) {
            if(Utils.elementClicked.offsetTop > nextElement.offsetTop) {
                nextElement.appendChild(Utils.ghostSubtimer)
            }
        }

        //consider offset left
        if(Utils.elementClicked.offsetTop + Utils.elementClicked.offsetHeight > nextElement.offsetTop + nextElement.offsetHeight)
            Utils.switchElements(Utils.ghostSubtimer, nextElement)
    }

    static draggingSubtimerStopped() {
        document.getElementById("all")!.style.cursor = "auto";

        if(Utils.isDragging) {
            Utils.isDragging = false

            Utils.elementClicked.className = 'subtimer'
            Utils.elementClicked.removeAttribute('style')

            let timePercentage:string = Utils.ghostSubtimer.style.getPropertyValue('--value')
            Utils.elementClicked.style.setProperty('--value', timePercentage)
            
            if(Utils.ghostSubtimer.className.includes('active'))
                Utils.elementClicked.className += '-active'

            Utils.ghostSubtimer.replaceWith(Utils.elementClicked)
        }
        
        window.removeEventListener('mousemove', Utils.dragSubtimer);
        window.removeEventListener('mouseup', Utils.draggingSubtimerStopped);
    }

    static changeTimeListener(event: MouseEvent): void {
        //TODO remove return 
        return
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
            document.getElementById('pause-button')!.textContent = '| |'

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

    static toggleStop(): void {
        if(Timer.currentState == TimerState.Finished)
            return

        if(Timer.currentState == TimerState.Active) {
            document.getElementById('pause-button')!.textContent = '►'
            Timer.pauseTimer()
            Timer.currentState = TimerState.Stopped
            return
        }

        document.getElementById('pause-button')!.textContent = '| |'
        Timer.currentState = TimerState.Paused
        Timer.resumeTimer()
    }
}