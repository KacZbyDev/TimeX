import {Utils} from './utils.js'
import { Timer } from './timer.js'
import { Repeater } from './repeater.js'

export class Subtimer {
    public element:Element

    public name:string
    public duration:number

    //get the time and name from the variables stored in the html
    constructor(element:Element) {
        this.element = element
        this.name = (<HTMLElement>element!.querySelector('.name')!).textContent!
        this.duration = Utils.timeToSeconds(element!.querySelector('.duration')!.textContent!)

        element.className = 'subtimer-active';
    }

    static subtimerFinished(): void {
        Utils.playSubtimerFinish()

        //get the next element in the list
        Timer.currentElement = Timer.currentElement!.nextElementSibling

        //if it finds the next element
        if (Timer.currentElement) {
            if (Timer.currentElement.className.includes('repeater')) {
                Timer.list = Timer.currentElement

                Repeater.setListToFirstSubtimerParent(Timer.list)

                //starts with the second child because the first one is for repeater configuration
                Timer.currentElement = Timer.list.children[1]
            }

            //reset subtimer progress
            Timer.currentSubtimer.element.className = 'subtimer'

            this.startNewSubtimer()

            Timer.elapsedTime = Date.now()
            return
        }

        if (Timer.list.className.includes('repeater'))
            Repeater.repeaterReachEnd()
        else
            Timer.killTimer()
    }

    static startNewSubtimer():void {
        //create a subtimer object by passing the currentElement
        Timer.currentSubtimer = new Subtimer(Timer.currentElement!)

        //the time displayed by bigTimer
        Timer.currentMiliseconds = Timer.currentSubtimer.duration

        document.getElementById('current-subtimer-name')!.textContent! = Timer.currentSubtimer.name
    }
}