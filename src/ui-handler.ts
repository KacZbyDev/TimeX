import { Timer } from './timer.js'
import { Repeater } from './repeater.js';
import { Subtimer } from './subtimer.js'
import { TimerState, Utils } from './utils.js'

export class UiHandler {
    public static readonly LIST_CONTENT = $('#list-content')[0]
    public static readonly RESIZER: HTMLElement = $('#resizer')[0]
    private static readonly TRASH_BIN: HTMLElement = $('#trash-bin')[0]
    public static readonly ELEMENTS_LIST: HTMLElement = $('#list-of-elements')[0]
    public static readonly BIG_TIMER_DISPLAY: HTMLElement = $('#big-timer-time')[0]
    public static readonly PROGRESS_BAR: HTMLElement = $('#progress-bar')[0]
    public static readonly BLURRED_BACKROUND: HTMLElement = $('#blurred-backround')[0]

    //for dragging elements
    public static readonly DRAG_OFFSET_Y = 136
    public static readonly LIST_INITIAL_SIZE: number = UiHandler.ELEMENTS_LIST.getBoundingClientRect().right

    private static isChangingTime = false
    private static isDragging = false
    private static elementClicked: HTMLElement
    private static ghostElement: HTMLElement //the fainted element that shows you where will the dragged element be

    static resize(e: MouseEvent) {
        window.addEventListener('mouseup',UiHandler.stopResize);

        const maxSize = window.innerWidth - $('#timer')[0].getBoundingClientRect().width - 10;
        const startingEffectAtX = maxSize - 100;

        let newWidth: number = UiHandler.ELEMENTS_LIST.getBoundingClientRect().width;
        let offset: number = e.movementX

        //If it is in the effect zone it moves slower
        if (newWidth > startingEffectAtX) {
            offset /= 5;
        }

        newWidth += offset

        //Apply limits
        newWidth = Math.max(newWidth, UiHandler.LIST_INITIAL_SIZE);
        newWidth = Math.min(newWidth, maxSize);

        // Apply new width
        UiHandler.ELEMENTS_LIST.style.width = `${newWidth}px`;
    }

    static stopResize(): void {
        window.removeEventListener('mousemove', UiHandler.resize);
        window.removeEventListener('mouseup', UiHandler.stopResize);
    }

    static dragElementListener(event: MouseEvent): void {
        if(!UiHandler.setElementClicked(event))
            return
        
        //Update on scroll and mousemove
        UiHandler.LIST_CONTENT.addEventListener('scroll', UiHandler.dragElement)
        window.addEventListener('mousemove', UiHandler.dragElement)
        window.addEventListener('mouseup', UiHandler.draggingElementStopped)
    }
    
    private static scrollTop: number
    private static top: number
    // Drag an element to move it
    static dragElement(event: MouseEvent | Event): void {
        if (UiHandler.isDragging == false)
            UiHandler.initializeGhostAndClickedElement()
        
        //Drag elmentClicked
        if(event instanceof MouseEvent) {
            UiHandler.top = event.clientY - UiHandler.DRAG_OFFSET_Y
            UiHandler.elementClicked.style.left = `${event.clientX - UiHandler.elementClicked.clientWidth / 2}px`
        }
        UiHandler.scrollTop = UiHandler.LIST_CONTENT.scrollTop
        UiHandler.elementClicked.style.top = `${UiHandler.top + UiHandler.scrollTop}px`

        //Scroll if elementClicked is out of bounds
        if(UiHandler.top <= 0)
            UiHandler.LIST_CONTENT.scrollTop -= 3
        
        if(UiHandler.top + 40 >= UiHandler.LIST_CONTENT.clientHeight)
            if(UiHandler.ghostElement.parentElement != UiHandler.LIST_CONTENT || UiHandler.ghostElement != UiHandler.elementClicked.previousElementSibling!)
                UiHandler.LIST_CONTENT.scrollTop += 3

        const prevElement: HTMLElement = <HTMLElement>UiHandler.ghostElement.previousElementSibling!
        const nextElement: HTMLElement = <HTMLElement>UiHandler.ghostElement.nextElementSibling!

        UiHandler.moveBack(prevElement)
        UiHandler.moveForward(nextElement)
    }

    static draggingElementStopped(): void {
        window.removeEventListener('mousemove', UiHandler.dragElement);
        window.removeEventListener('mouseup', UiHandler.draggingElementStopped);
        UiHandler.LIST_CONTENT.removeEventListener('scroll', UiHandler.dragElement);
        
        document.body.style.cursor = "auto";
        UiHandler.TRASH_BIN.classList.add('opacity-0', 'hidden')
        UiHandler.TRASH_BIN.classList.remove('opacity-70')

        if(!UiHandler.isDragging)
            return
        UiHandler.isDragging = false
        
        // Delete the dragged element if you hover over the bin 
        if(UiHandler.TRASH_BIN.matches(':hover')) {
            UiHandler.ghostElement.remove()
            UiHandler.elementClicked.remove()
            Timer.activateFirstSubtimer()

            Utils.saveList()
            return
        }

        // Make elementClicked replace ghostElement
        UiHandler.elementClicked.setAttribute('style', UiHandler.ghostElement.getAttribute('style')!)
        UiHandler.elementClicked.className = UiHandler.ghostElement.className
        UiHandler.elementClicked.classList.remove('ghost')

        UiHandler.ghostElement.replaceWith(UiHandler.elementClicked)

        Utils.saveList()
        Timer.activateFirstSubtimer()
    }
    
    //Move element backward if needed
    static moveBack(prevElement: HTMLElement): void {
        if(prevElement == null)  
            return

        if(Repeater.isRepeaterValues(prevElement)) {
            if(UiHandler.elementClicked.offsetTop > prevElement.parentElement!.offsetTop)
                return

            let repeater: HTMLElement = UiHandler.ghostElement.parentElement!
            repeater.parentNode!.insertBefore(UiHandler.ghostElement, repeater);

            return
        }
        
        if(Repeater.isRepeater(prevElement)) {
            if(UiHandler.elementClicked.offsetTop < prevElement.offsetTop) {
                Utils.switchElements(UiHandler.ghostElement, prevElement)
                return
            }
            
            if(UiHandler.elementClicked.offsetLeft > prevElement.offsetLeft)
                if(UiHandler.elementClicked.offsetTop < prevElement.offsetTop + prevElement.offsetHeight) {
                    prevElement.appendChild(UiHandler.ghostElement)
                    return
                }
        }

        if(UiHandler.elementClicked.offsetTop < prevElement.offsetTop)
            Utils.switchElements(UiHandler.ghostElement, prevElement)
    }

    //Move element forward if needed
    static moveForward(nextElement: HTMLElement): void {
        if(nextElement == null) {
            if(!Repeater.isRepeater(UiHandler.ghostElement.parentElement!))
                return

            let repeater = UiHandler.ghostElement.parentElement!
            if(UiHandler.elementClicked.offsetTop <=  repeater.offsetTop + repeater.offsetHeight)
                return
            
            repeater.parentNode!.insertBefore(UiHandler.ghostElement, repeater)
            Utils.switchElements(UiHandler.ghostElement, repeater)//To insert it after

            return
        }
        
        if(Repeater.isRepeater(nextElement))
            if(UiHandler.elementClicked.offsetTop > nextElement.offsetTop)
                if(UiHandler.elementClicked.offsetLeft > nextElement.offsetLeft) {
                    nextElement.appendChild(UiHandler.ghostElement)
                    nextElement.insertBefore(UiHandler.ghostElement, nextElement.children[1])
                    
                    return
                }

        if(UiHandler.elementClicked.offsetTop > nextElement.offsetTop + nextElement.offsetHeight)
            Utils.switchElements(UiHandler.ghostElement, nextElement)
    }

    //Return true if a valid element was clicked
    static setElementClicked(event: MouseEvent): boolean {
        let elementClicked:HTMLElement = event.target as HTMLElement
        let elementParent = elementClicked.parentElement!
        
        if (Timer.currentState != TimerState.Edit || elementClicked.className.includes('edit-button') || elementClicked.id.includes('list'))
            return false
        
        if(!Subtimer.isSubtimer(elementClicked))
            elementClicked = elementParent

        if(elementClicked.id.includes('list'))
            return false
        
        if(Repeater.isRepeaterValues(elementClicked))
            elementClicked = elementClicked.parentElement!

        elementParent = elementClicked.parentElement!
        if(elementParent.children.length <= 1)
            return false
        if(Repeater.isRepeater(elementParent) && elementParent.children.length <= 2) {
            return false
        }

        UiHandler.elementClicked = elementClicked
        return true
    }

    // Creates the ghostElement and moves the elementClicked to the cursor
    static initializeGhostAndClickedElement(): void {
        UiHandler.isDragging = true
        document.body.style.cursor = "pointer"
        UiHandler.TRASH_BIN.classList.remove('hidden', 'opacity-0')
        UiHandler.TRASH_BIN.classList.add('opacity-70')

        //Deactivate the active subtimer
        if(UiHandler.LIST_CONTENT.querySelector('.subtimer-active'))
            (UiHandler.LIST_CONTENT.querySelector('.subtimer-active') as HTMLElement).className = 'subtimer'

        UiHandler.ghostElement = UiHandler.elementClicked.cloneNode(true) as HTMLElement
        UiHandler.ghostElement.classList.add('ghost')
        
        const originalWidth = UiHandler.elementClicked.getBoundingClientRect().width
        
        UiHandler.elementClicked.classList.add('z-40', 'absolute')
        if(Subtimer.isSubtimer(UiHandler.elementClicked))
            UiHandler.elementClicked.className += ' shadow-md shadow-gray-300 border-gray-300'
        
        UiHandler.elementClicked.style.width = `${originalWidth}px`
        
        UiHandler.elementClicked.replaceWith(UiHandler.ghostElement)
        Utils.addELementInList(UiHandler.elementClicked)
    }

    // Decide what subtimer should be dragged and if it should be dragged
    static changeTimeListener(event: MouseEvent): void {
        let elementClicked: HTMLElement = event.target as HTMLElement
        
        if(Timer.currentState == TimerState.Edit)
            return

        if(Subtimer.isSubtimer(elementClicked.parentElement!))
            elementClicked = elementClicked.parentElement!

        if(!Subtimer.isSubtimer(elementClicked))
            return

        UiHandler.elementClicked = elementClicked
        
        Timer.pauseTimer()
        window.addEventListener('mousemove', UiHandler.changeTime);
        window.addEventListener('mouseup', UiHandler.changingTimeStopped);
    }
    
    // Changes the time of a subtimer when dragged
    static changeTime(event: MouseEvent): void {
        if(UiHandler.isChangingTime == false)
           UiHandler.initializeChangingTime()

        let percent: number = (event.clientX - Timer.currentElement.offsetLeft + 2) / Timer.currentElement.clientWidth * 100
        percent = Math.min(percent, 100)
        percent = Math.max(percent, 0)

        Timer.currentMiliseconds = percent * Subtimer.duration / 100
        
        Timer.updateTimeOnUI(percent)
    }

    static changingTimeStopped(): void {
        UiHandler.isChangingTime = false

        window.removeEventListener('mousemove', UiHandler.changeTime);
        window.removeEventListener('mouseup', UiHandler.changingTimeStopped);

        Timer.resumeTimer()
    }

    static initializeChangingTime(): void {
        UiHandler.isChangingTime = true

        Timer.currentState = TimerState.Paused
        Subtimer.element.className = 'subtimer' 
        $('#pause-button')[0].textContent = '| |'

        Timer.currentElement = UiHandler.elementClicked
        Timer.list = Timer.currentElement.parentElement!
        Repeater.resetChildren(Timer.list)
        Repeater.rewindParentsAndSiblings(Timer.list)
    
        Subtimer.startSubtimer(Timer.currentElement)
    }
}