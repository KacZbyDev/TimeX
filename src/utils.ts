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
    public static readonly DRAG_OFFSET_Y = 136

    private static readonly DECIMALS: number = 1 //how many decimals are displayed by the big timer
    public static readonly REFRESH_DELAY: number = 10 //how many miliseconds it takes for the time to update

    private static readonly SUBTIMER_FINISH: HTMLAudioElement = new Audio('../res/timer-ending-sound.mp3')
    
    private static isChangingTime = false
    private static isDragging = false
    public static elementClicked: HTMLElement
    public static ghostElement: HTMLElement
    public static readonly listContent = document.getElementById('list-content')!

    public static isModalVisible:boolean = false
    public static elementInEdit:HTMLElement

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

    static switchElements(element1:HTMLElement, element2:HTMLElement): void {
        let placeholder: HTMLElement = document.createElement('div');
                
        element1.replaceWith(placeholder); 
        element2.replaceWith(element1); 
        placeholder.replaceWith(element2); 
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

    static dragElementListener(event: MouseEvent): void {
        let elementClicked:HTMLElement = <HTMLElement> event.target
        let elementParent = elementClicked.parentElement!
        
        if (Timer.currentState != TimerState.Edit || elementClicked.className.includes('edit-button'))
            return

        if(!elementClicked.className.includes('subtimer'))
            elementClicked = elementParent
        
        if(elementClicked.id.includes('list'))
            return
        
        if(elementClicked.className.includes('repeater-values'))
            elementClicked = elementClicked.parentElement!

        elementParent = elementClicked.parentElement!
        if((elementParent.className == 'repeater' && elementParent.children.length <= 2))
            return
        
        Utils.elementClicked = elementClicked
        window.addEventListener('mousemove', Utils.dragElement)
        window.addEventListener('mouseup', Utils.draggingElementStopped)
        Utils.listContent.addEventListener('scroll', Utils.dragElement)
    }
    
    private static scrollTop: number
    private static top: number
    static dragElement(event: MouseEvent | Event) {
        if (Utils.isDragging == false) {
            Utils.isDragging = true
            document.body.style.cursor = "pointer";
            

            Utils.ghostElement = Utils.elementClicked.cloneNode(true) as HTMLElement
            Utils.ghostElement.classList.add('ghost')
            
            const originalWidth = Utils.elementClicked.getBoundingClientRect().width
            
            Utils.elementClicked.className += ' z-50 absolute'
            if(Utils.elementClicked.className.includes('subtimer'))
                Utils.elementClicked.className += ' absolute shadow-md shadow-gray-300 border-gray-300'
            
            Utils.elementClicked.style.width = `${originalWidth}px`
            
            Utils.elementClicked.replaceWith(Utils.ghostElement)
            Utils.listContent.appendChild(Utils.elementClicked)
        }
        
        if(event instanceof MouseEvent) {
            Utils.top = event.clientY - Utils.DRAG_OFFSET_Y
            Utils.elementClicked.style.left = `${event.clientX - Utils.elementClicked.clientWidth / 2}px`
        }
        Utils.scrollTop = Utils.listContent.scrollTop
        Utils.elementClicked.style.top = `${Utils.top + Utils.scrollTop}px`
        
        if(Utils.top <= 0)
            document.getElementById("list-content")!.scrollTop -= 3
        
        if(Utils.top + 40 >= document.getElementById("list-content")!.clientHeight) {
            if(Utils.ghostElement.parentElement != Utils.listContent || Utils.ghostElement != Utils.elementClicked.previousElementSibling!)
                document.getElementById("list-content")!.scrollTop += 3
        }

        const prevElement: HTMLElement = <HTMLElement>Utils.ghostElement.previousElementSibling!
        const nextElement: HTMLElement = <HTMLElement>Utils.ghostElement.nextElementSibling!

        Utils.moveBack(prevElement)
        Utils.moveForward(nextElement)
    }

    static draggingElementStopped() {
        document.body.style.cursor = "auto";

        window.removeEventListener('mousemove', Utils.dragElement);
        window.removeEventListener('mouseup', Utils.draggingElementStopped);
        Utils.listContent.removeEventListener('scroll', Utils.dragElement);
        
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
            if(Utils.elementClicked.offsetTop > prevElement.parentElement!.offsetTop)
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

    static moveForward(nextElement: HTMLElement): void {
        if(nextElement == null) {
            if(!Utils.ghostElement.parentElement!.className.includes('repeater'))
                return

            let repeater = Utils.ghostElement.parentElement!
            if(Utils.elementClicked.offsetTop <=  repeater.offsetTop + repeater.offsetHeight)
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
            Repeater.rewindParentsAndSiblings(Timer.list)
        
            Subtimer.startSubtimer(Timer.currentElement)
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
            Timer.pauseTimer()
            Utils.lastState = Timer.currentState
            Timer.currentState = TimerState.Edit

            document.querySelectorAll('[class^="edit-button"]').forEach((element) => {
                element.classList.remove('hidden') 
            });
            $('#blurred-backround').removeClass('hidden');
            $('#list-of-elements').addClass('z-50')
            return
        }

        document.querySelectorAll('[class^="edit-button"]').forEach((element) => {
            element.classList.add('hidden')
        });
        $('#blurred-backround').addClass('hidden')
        $('#list-of-elements').removeClass('z-50')
 
        Timer.currentState = Utils.lastState
        Timer.resumeTimer()
    }

    static showWarningPopUp(message: string):void {
        document.getElementById('warning-message')!.textContent = message
        document.getElementById('warning-pop-up')!.classList.remove('hidden')
    }

    static hideWarningPopUp():void {
        document.getElementById('warning-pop-up')!.classList.add('hidden')
    }

    static getItemPickerValue(picker: HTMLElement): string {
        let currentElement: HTMLSelectElement = picker.children[0] as HTMLSelectElement
        let res: string = currentElement.value
        
        for(let i = 1; i < picker.children.length; i++)
            res += ":" + (picker.children[i] as HTMLSelectElement).value

        return res
    }

    //FIX ME
    static setItemPickerValue(picker: HTMLElement, value: string) {
        let values:string[] = value.split(':')

        for(let i = 0; i < values.length; i++) {
            (picker.children[values.length - i - 1] as HTMLSelectElement).value = values[values.length - i - 1]
        }
    }

    static resetPicker(picker: HTMLElement) {
        for(let i = 0; i < picker.children.length - 1; i++)
            (picker.children[i] as HTMLSelectElement).value = "00";

        (picker.children[picker.children.length - 1] as HTMLSelectElement).value = "01"
    }

    //FIXME make this modal only
    static showMenu(menu: Element): void {
        if(Utils.isModalVisible)
            return
        Utils.isModalVisible = true
        
        menu.classList.remove('hidden');
        $('#blurred-backround').removeClass('hidden');
        $('#list-of-elements').removeClass('z-50')
    }

    static openEditElementMenu(element: HTMLElement) {
        let menu: HTMLElement
        Utils.elementInEdit = element

        if(element.className.includes('subtimer')) {
            menu = document.getElementById('subtimer-menu')! as HTMLElement

            (menu.querySelector('.subtimer-name')! as HTMLInputElement).value = (Utils.elementInEdit.querySelector('.name')! as HTMLInputElement).textContent!;

            Utils.setItemPickerValue(menu.querySelector('.picker')!, element.querySelector('.duration')!.textContent!)
        }
        else {
            menu = document.getElementById('repeater-menu')!
            
            Utils.setItemPickerValue(menu.querySelector('.picker')!, element.querySelector('.total-repeats')!.textContent!)
        }

        Utils.showMenu(menu)
    }
}
