import {Utils} from './utils.js'
import { Timer } from './timer.js'
import { Repeater } from './repeater.js'
import { Sounds } from './sounds.js'
import { Menus } from './menus.js'

export class Subtimer {
    public static element:HTMLElement
    public static subtimerName:string
    public static duration:number

    static createSubtimer(): HTMLElement {
        let newSubtimer: HTMLElement = document.getElementById('subtimer-example')!.cloneNode(true) as HTMLElement
        newSubtimer.removeAttribute('id')

        newSubtimer.firstElementChild!.addEventListener('click', () => {
            Menus.openEditElementMenu(newSubtimer)
        })

        return newSubtimer
    }

    static setSubtimer(subtimer:HTMLElement, name: string, duration: string): void {
        subtimer.querySelector('.name')!.textContent = name
        subtimer.querySelector('.duration')!.textContent = duration
    }

    static startSubtimer(element: HTMLElement):void {
        //Get the time and name from the variables stored in the html
        Subtimer.element = element
        Subtimer.subtimerName = (<HTMLElement>element!.querySelector('.name')!).textContent!
        Subtimer.duration = Utils.timeToSeconds(element!.querySelector('.duration')!.textContent!)

        element.className = 'subtimer-active';
        
        //The time displayed by bigTimer
        Timer.currentMiliseconds = Subtimer.duration

        //Change UI
        document.getElementById('current-subtimer-name')!.textContent! = Subtimer.subtimerName
        Timer.updateTimeOnUI(100)
    }

    static startNextSubtimer(): void {
        if(Timer.currentElement == null)
            return

        Timer.currentElement.removeAttribute('style')
        Timer.currentElement = Timer.currentElement!.nextElementSibling as HTMLElement
        
        if (Timer.currentElement) {
            Sounds.playSubtimerFinish()

            if (Repeater.isRepeater(Timer.currentElement))
                Repeater.setListToFirstSubtimerParent(Timer.currentElement)

            //Reset subtimer progress
            Subtimer.element.className = 'subtimer'
            Subtimer.startSubtimer(Timer.currentElement)

            Timer.elapsedTime = Date.now()
            return
        }

        if (Repeater.isRepeater(Timer.list)) {
            Repeater.repeaterFinished()
            return
        }

        Sounds.playSubtimerFinish()
        Timer.killTimer()
    }

    static startPreviousSubtimer(): void {
        if(!Timer.currentElement)
            return
        Sounds.playSubtimerFinish()

        Timer.currentElement = Subtimer.getPreviousSubtimer(Timer.currentElement)

        //reset subtimer progress
        Timer.currentElement.removeAttribute('style')
        Subtimer.element.className = 'subtimer'

        Subtimer.startSubtimer(Timer.currentElement)
        Timer.elapsedTime = Date.now()
    }

    //Return the previous subtimer or the current one if it doesnt have a previous
    static getPreviousSubtimer(element: HTMLElement): HTMLElement {
        let prevElement: HTMLElement = element.previousElementSibling! as HTMLElement

        if(!prevElement) 
            return element

        if(Repeater.isRepeaterValues(prevElement)) {
            Repeater.resetChildren(prevElement.parentElement!.parentElement!)
            prevElement = prevElement.parentElement!.previousElementSibling as HTMLElement
            if(!prevElement)
                return element
        }
        if(Repeater.isRepeater(prevElement)) {
            Repeater.resetChildren(prevElement)
            prevElement = prevElement.querySelector('.subtimer')!
        }
        
        if(prevElement)
            return prevElement
        else
            return element
    }

    static isSubtimer(element: HTMLElement): boolean {
        return element.className.includes('subtimer')
    }

    static isActiveSubtimer(element: HTMLElement): boolean {
        return element.className.includes('active-subtimer')
    }
}