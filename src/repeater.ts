import { Subtimer } from './subtimer.js'
import { Timer } from './timer.js'

export class Repeater {
    static getCurrentRepeats(repeater: Element):number {
        return parseInt(repeater.querySelector('.repeater-values')!.querySelector('.current-repeats')!.textContent!)
    }
    static setCurrentRepeats(repeater: Element, repeats: number):void {
        repeater.querySelector('.repeater-values')!.querySelector('.current-repeats')!.textContent = repeats.toString()
    }

    static getTotalRepeats(repeater: Element):number {
        return parseInt(repeater.querySelector('.repeater-values')!.querySelector('.total-repeats')!.textContent!)
    }

    //Maybe querySelectorAll may be used
    //resets every child of the repeater
    static resetChildren(repeater:Element): void {
        let i = repeater.id.includes('list') ? 0 : 1;

        for (i; i < repeater.children.length; i++) {
            let child:Element = repeater.children[i]

            if(child.className.includes('repeater')) {//
                child.querySelector('.repeater-values')!.querySelector('.current-repeats')!.textContent = '0'
                Repeater.resetChildren(child)
            } else
                child.className = 'subtimer'
        }
    }

    //finds the first subtimer (iterates through nested repeaters)
    static setListToFirstSubtimerParent(list:Element): boolean {
        for (let i:number = 0; i < list.children.length; i++) {
            let child:Element = list.children[i]

            if(child.className.includes('subtimer')) {
                Timer.list = child.parentElement!
                return true
            }
            if(Repeater.setListToFirstSubtimerParent(child))
                return true
        }

        return false
    }

    static repeaterReachEnd():void {
        Repeater.setCurrentRepeats(Timer.list, Repeater.getCurrentRepeats(Timer.list) + 1)
    
        //if repeater repeated enough times
        if (Repeater.getCurrentRepeats(Timer.list) >= Repeater.getTotalRepeats(Timer.list)) {  
            Timer.currentElement = Timer.list
            Timer.list = Timer.list.parentElement!
        } else {
            Timer.currentElement = Timer.list.firstElementChild as HTMLElement
            Repeater.resetChildren(Timer.list)
        }
    
        Subtimer.subtimerFinished()
    }
}