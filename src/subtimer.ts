import {Utils} from './utils.js'
import { Timer } from './timer.js'
import { Repeater } from './repeater.js'

export class Subtimer {
    public static element:HTMLElement
    public static subtimerName:string
    public static duration:number

    static startSubtimer(element: HTMLElement):void {
        //get the time and name from the variables stored in the html
        Subtimer.element = element
        Subtimer.subtimerName = (<HTMLElement>element!.querySelector('.name')!).textContent!
        Subtimer.duration = Utils.timeToSeconds(element!.querySelector('.duration')!.textContent!)

        element.className = 'subtimer-active';

        //the time displayed by bigTimer
        Timer.currentMiliseconds = Subtimer.duration

        //Change the time on top of the big timer
        document.getElementById('current-subtimer-name')!.textContent! = Subtimer.subtimerName
    }

    static startNextSubtimer(): void {
        if(Timer.currentElement == null)
            return
        Utils.playSubtimerFinish()

        Timer.currentElement = Timer.currentElement!.nextElementSibling as HTMLElement
        //if it finds the next element
        if (Timer.currentElement) {
            if (Timer.currentElement.className.includes('repeater')) {
                Timer.list = Timer.currentElement as HTMLElement

                Repeater.setListToFirstSubtimerParent(Timer.list)

                //starts with the second child because the first one is for repeater configuration
                Timer.currentElement = Timer.list.children[1] as HTMLElement
            }

            //reset subtimer progress
            Subtimer.element.className = 'subtimer'

            Subtimer.startSubtimer(Timer.currentElement)

            Timer.elapsedTime = Date.now()
            return
        }

        if (Timer.list.className.includes('repeater'))
            Repeater.repeaterReachEnd()
        else
            Timer.killTimer()
    }

    static startPreviousSubtimer(): void {
        if(!Timer.currentElement)
            return
        
        Utils.playSubtimerFinish()

        let prevElement = Timer.currentElement!.previousElementSibling as HTMLElement
        if(prevElement) {
            if(prevElement.className.includes('repeater-values'))
                prevElement = prevElement.parentElement!.previousElementSibling as HTMLElement

            if(prevElement.className.includes('repeater'))
                prevElement = prevElement.lastElementChild as HTMLElement

            //reset subtimer progress
            Subtimer.element.className = 'subtimer'
            Timer.currentElement = prevElement
        }
        
        Subtimer.startSubtimer(Timer.currentElement)
        Timer.elapsedTime = Date.now()
    }
}