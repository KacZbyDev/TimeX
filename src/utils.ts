import { Timer } from './timer.js'
import { Repeater } from './repeater.js';
import { Subtimer } from './subtimer.js'

export enum TimerState {
    Active,
    Paused,
    Stopped,
    Finished,
    Edit
};

export class Utils {
    public static readonly DRAG_OFFSET_X = 18
    public static readonly DRAG_OFFSET_Y = 136

    private static readonly DECIMALS: number = 1 //how many decimals are displayed by the big timer
    public static readonly REFRESH_DELAY: number = 10 //how many miliseconds it takes for the time to update

    private static readonly SUBTIMER_FINISH: HTMLAudioElement = new Audio('../res/timer-ending-sound.mp3')
    
    private static isChangingTime = false
    private static isDragging = false
    public static elementClicked: HTMLElement
    public static ghostElement: HTMLElement

    public static isModalVisible:boolean = false

    static playSubtimerFinish(): void {
        this.SUBTIMER_FINISH.play()
    }

    //takes a string of format: 12:34:56 and transform it into seconds
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
        
        document.body.style.cursor = 'none';
        document.getElementById('resizer')!.style.cursor = 'none'
    }

    static stopResize(): void {
        document.body.removeAttribute('style');
        document.getElementById('resizer')!.removeAttribute('style');

        window.removeEventListener('mousemove', Utils.resize);
        window.removeEventListener('mouseup', Utils.stopResize);
    }

    static dragElementListener(event: MouseEvent): void {
        if (Timer.currentState != TimerState.Edit)
            return
        
        let elementClicked:HTMLElement = <HTMLElement> event.target
        
        Utils.elementClicked = elementClicked.parentElement!
        
        if(Utils.elementClicked.id.includes('list'))
            return
        if(Utils.elementClicked.className.includes('repeater-values'))
            Utils.elementClicked = Utils.elementClicked.parentElement!

        window.addEventListener('scroll', (event: Event) => {Utils.dragElement(event as MouseEvent)});
        window.addEventListener('mousemove', Utils.dragElement);
        window.addEventListener('mouseup', Utils.draggingElementStopped);
    }
    
    static dragElement(event: MouseEvent) {
        if (Utils.isDragging == false) {
            Utils.isDragging = true
            document.body.style.cursor = "pointer";
            
            Utils.ghostElement = Utils.elementClicked.cloneNode(true) as HTMLElement
            Utils.ghostElement.className += ' ghost'
            
            const originalWidth = Utils.elementClicked.getBoundingClientRect().width
            
            Utils.elementClicked.className += ' absolute'
            Utils.elementClicked.style.width = `${originalWidth}px`
            
            Utils.elementClicked.replaceWith(Utils.ghostElement)
            document.getElementById('list-content')!.appendChild(Utils.elementClicked)
        }
        
        const scrollTop = document.getElementById("list-content")!.scrollTop
        Utils.elementClicked.style.left = `${event.clientX - Utils.DRAG_OFFSET_X}px`
        Utils.elementClicked.style.top = `${event.clientY - Utils.DRAG_OFFSET_Y + scrollTop}px`
        
        //TODO scroll down when element is down or up if up
        //if(Utils.elementClicked.style.top <= 0 || document.getElementById("list-content")!.clientHeight + scrollTop - (parseInt(Utils.elementClicked.style.top.split('px', 1).at(0)!) + Utils.elementClicked.clientHeight < 0)
        //document.getElementById("list-content")!.scrollTop += value

        const prevElement: HTMLElement = <HTMLElement>Utils.ghostElement.previousElementSibling!
        const nextElement: HTMLElement = <HTMLElement>Utils.ghostElement.nextElementSibling!

        Utils.moveBack(prevElement)
        Utils.moveForward(nextElement)
    }

    static draggingElementStopped() {
        document.body.style.cursor = "auto";

        window.removeEventListener('mousemove', Utils.dragElement);
        window.removeEventListener('mouseup', Utils.draggingElementStopped);

        if(!Utils.isDragging)
            return
        Utils.isDragging = false
        
        Utils.elementClicked.setAttribute('style', Utils.ghostElement.getAttribute('style')!)
        Utils.elementClicked.className = Utils.ghostElement.className
        Utils.elementClicked.classList.remove('ghost')

        Utils.ghostElement.replaceWith(Utils.elementClicked)
    }
    
    static moveBack(prevElement: HTMLElement): void {
        if(prevElement == null)  
            return
        if(prevElement.className.includes('repeater-values')) {
            if(Utils.elementClicked.offsetTop > prevElement.parentElement!.offsetTop || Utils.ghostElement.parentElement!.childElementCount <= 2)
                return

            let repeater = Utils.ghostElement.parentElement!
            
            this.insertElementBeforeElement(Utils.ghostElement, repeater)
            
            return
        }
        
        if(prevElement.className.includes('repeater')) {
            if(Utils.elementClicked.offsetTop < prevElement.offsetTop) {
                Utils.switchElements(Utils.ghostElement, prevElement)
                return
            }
            
            if(Utils.elementClicked.offsetLeft > prevElement.offsetLeft)
                if(Utils.elementClicked.offsetTop < prevElement.offsetTop + prevElement.offsetHeight) {
                    prevElement.appendChild(Utils.ghostElement)
                    return
                }
        }

        if(Utils.elementClicked.offsetTop < prevElement.offsetTop)
            Utils.switchElements(Utils.ghostElement, prevElement)
    }

    static testdone = false
    static moveForward(nextElement: HTMLElement): void {
        if(nextElement == null) {
            if(!Utils.ghostElement.parentElement!.className.includes('repeater'))
                return

            let repeater = Utils.ghostElement.parentElement!
            if(Utils.elementClicked.offsetTop <=  repeater.offsetTop + repeater.offsetHeight || repeater.childElementCount <= 2)
                return
            
            Utils.insertElementBeforeElement(Utils.ghostElement, repeater)
            Utils.switchElements(Utils.ghostElement, repeater)//To insert it after

            return
        }
        
        if(nextElement.className.includes('repeater'))
            if(Utils.elementClicked.offsetTop > nextElement.offsetTop)
                if(Utils.elementClicked.offsetLeft > nextElement.offsetLeft) {
                    nextElement.appendChild(Utils.ghostElement)
                    Utils.insertElementBeforeElement(Utils.ghostElement, <HTMLElement> nextElement.children[1])
                    
                    return
                }

        if(Utils.elementClicked.offsetTop > nextElement.offsetTop + nextElement.offsetHeight)
            Utils.switchElements(Utils.ghostElement, nextElement)
    }

    static insertElementBeforeElement(element: HTMLElement, sibling: HTMLElement):void {
        if(element.parentElement! === sibling) {
            element.parentElement!.parentElement!.append(element)
            if(Utils.ghostElement.parentElement!.id.includes('list'))
                Utils.switchElements(element, Utils.elementClicked)
        }

        while(element.previousElementSibling! !== sibling) {
            Utils.switchElements(element, <HTMLElement> element.previousElementSibling!)
        }
        Utils.switchElements(element, <HTMLElement> element.previousElementSibling!)
    }

    static changeTimeListener(event: MouseEvent): void {
        let elementClicked:HTMLElement = <HTMLElement> event.target
        
        if(Timer.currentState == TimerState.Edit)
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
            
            //TODO do this for every parent of the element until you reach list-content, and put it inside repeater class
            if(Timer.list.className.includes('repeater') && Repeater.getCurrentRepeats(Timer.list) == Repeater.getTotalRepeats(Timer.list))
                Repeater.setCurrentRepeats(Timer.list, Repeater.getTotalRepeats(Timer.list) - 1)

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
        if(Timer.currentState >= TimerState.Finished || Utils.isModalVisible)
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

    private static lastState:TimerState
    static toggleEditMode(): void {
        if(Timer.currentState < TimerState.Edit) {
            document.querySelectorAll('[class^="edit-button"]').forEach((element) => {
                element.classList.remove('hidden') 
            });
            $('#blurred-backround').removeClass('hidden');
            $('#list-of-subtimer').addClass('z-50')

            Timer.pauseTimer()
            Utils.lastState = Timer.currentState
            Timer.currentState = TimerState.Edit
            return
        }

        document.querySelectorAll('[class^="edit-button"]').forEach((element) => {
            element.classList.add('hidden')
        });
        $('#blurred-backround').addClass('hidden')
        $('#list-of-subtimer').removeClass('z-50')
 
        Timer.currentState = Utils.lastState
        Timer.resumeTimer()
    }
}