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

        return newSubtimer
    }

    static setSubtimer(subtimer:HTMLElement, name: string, duration: string): void {
        subtimer.querySelector('.name')!.textContent = name
        subtimer.querySelector('.duration')!.textContent = duration

        subtimer.firstElementChild!.addEventListener('click', () => {
            Menus.openEditElementMenu(subtimer)
        })
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
        Sounds.playSubtimerFinish()

        Timer.currentElement.removeAttribute('style')
        Timer.currentElement = Timer.currentElement!.nextElementSibling as HTMLElement
        
        if (Timer.currentElement) {
            if (Repeater.isRepeater(Timer.currentElement)) {
                Repeater.setListToFirstSubtimerParent(Timer.currentElement)

                Timer.currentElement = Timer.list.children[1] as HTMLElement
            }

            //Reset subtimer progress
            Subtimer.element.className = 'subtimer'
            Subtimer.startSubtimer(Timer.currentElement)

            Timer.elapsedTime = Date.now()
            return
        }

        if (Repeater.isRepeater(Timer.list))
            Repeater.repeaterFinished()
        else
            Timer.killTimer()
    }

    static startPreviousSubtimer(): void {
        if(!Timer.currentElement)
            return
        Sounds.playSubtimerFinish()

        let prevElement: HTMLElement = Timer.currentElement!.previousElementSibling as HTMLElement
        
        if(prevElement) { 
            if(Repeater.isRepeaterValues(prevElement)) {
                Repeater.resetChildren(prevElement.parentElement!.parentElement!)
                prevElement = prevElement.parentElement!.previousElementSibling as HTMLElement
            }
            if(Repeater.isRepeater(prevElement)) {
                Repeater.resetChildren(prevElement)
                prevElement = prevElement.querySelector('.subtimer')!
            }
            
            //reset subtimer progress
            Timer.currentElement.removeAttribute('style')
            Subtimer.element.className = 'subtimer'
            
            Timer.currentElement = prevElement
        }

        Subtimer.startSubtimer(Timer.currentElement)
        Timer.elapsedTime = Date.now()
    }

    static isSubtimer(element: HTMLElement): boolean {
        return element.className.includes('subtimer')
    }
}