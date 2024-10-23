import { Subtimer } from './subtimer.js'
import { Timer } from './timer.js'

export class Repeater {
    //reset every child of the repeater
    static resetChildren(repeater:Element): void {
        repeater.querySelectorAll('.repeater').forEach((element) => {
            element.querySelector('.repeater-values')!.querySelector('.current-repeats')!.textContent = '0'
        })
        repeater.querySelectorAll('.subtimer').forEach((element) => {
            element.className = 'subtimer'
        })
    }

    //Find the first subtimer
    static setListToFirstSubtimerParent(list: Element):void {
        Timer.list = list.querySelector('.subtimer')!.parentElement!
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
    
        Subtimer.startNextSubtimer()
    }

    static rewindParentsAndSiblings(repeater: HTMLElement): void {
        if(!repeater.className.includes('repeater'))
            return
        if(Repeater.getCurrentRepeats(repeater) < Repeater.getTotalRepeats(repeater))
            return
        
        while(!repeater.id.includes('list')) {
            Repeater.setCurrentRepeats(repeater, Repeater.getTotalRepeats(repeater) - 1)
            repeater = repeater.parentElement!
        }
        repeater.querySelectorAll('.repeater').forEach((element) => {
            if(Repeater.getCurrentRepeats(element) < Repeater.getTotalRepeats(element))
                return
            Repeater.setCurrentRepeats(element, Repeater.getTotalRepeats(element) - 1)
        })
        
    }

    static getCurrentRepeats(repeater: Element):number {
        return parseInt(repeater.querySelector('.repeater-values')!.querySelector('.current-repeats')!.textContent!)
    }
    static setCurrentRepeats(repeater: Element, repeats: number):void {
        repeater.querySelector('.repeater-values')!.querySelector('.current-repeats')!.textContent = repeats.toString()
    }

    static getTotalRepeats(repeater: Element):number {
        return parseInt(repeater.querySelector('.repeater-values')!.querySelector('.total-repeats')!.textContent!)
    }

    static setTotalRepeats(repeater: Element, repeats: string):void {
        repeater.querySelector('.repeater-values')!.querySelector('.total-repeats')!.textContent! = repeats
    }

    static createRepeater(): HTMLElement {
        return document.getElementById('repeater-example')!.cloneNode(true) as HTMLElement
    }
}