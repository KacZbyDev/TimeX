import { Subtimer } from './subtimer.js'
import { Timer } from './timer.js'

export class Repeater {

    //resets every child of the repeater
    static resetChildren(repeater:Element): void {
        let i = repeater.id.includes('list') ? 0 : 1;

        for (i; i < repeater.children.length; i++) {
            let child:Element = repeater.children[i]

            if(child.className.includes('repeater')) {//
                child.querySelector('.repeater-values')!.querySelector('.current-repeats')!.textContent = '0'
                this.resetChildren(child)
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

            if(this.setListToFirstSubtimerParent(child))
                return true
        }

        return false
    }

    static repeaterReachEnd():void {
        //gets the values stored in the repeaters
        let repeaterValues = Timer.list.querySelector('.repeater-values')!
        let currentRepeats = parseInt(repeaterValues.querySelector('.current-repeats')!.textContent!) + 1
        let totalRepeats = parseInt(repeaterValues.querySelector('.total-repeats')!.textContent!)
        
        repeaterValues.firstElementChild!.textContent = currentRepeats + ''
    
        //if repeater repeated enough times
        if (currentRepeats >= totalRepeats) {  
            Timer.currentElement = Timer.list
            Timer.list = Timer.list.parentElement!
        } else {
            Timer.currentElement = Timer.list.firstElementChild as HTMLElement
            Repeater.resetChildren(Timer.list)
        }
    
        Subtimer.subtimerFinished()
    }
}