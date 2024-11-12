import { Menus } from './menus.js'
import { Subtimer } from './subtimer.js'
import { Timer } from './timer.js'

export class Repeater {
    static createRepeater(): HTMLElement {
        let newRepeater: HTMLElement = $('#repeater-example')[0].cloneNode(true) as HTMLElement
        newRepeater.removeAttribute('id')

        newRepeater.appendChild(Subtimer.createSubtimer())
        newRepeater.firstElementChild!.addEventListener('click', () => {
            Menus.openEditElementMenu(newRepeater)
        })
        
        return newRepeater
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

    // Reset every child of the repeater
    static resetChildren(repeater:Element): void {
        repeater.querySelectorAll('.repeater').forEach((element) => {
            element.querySelector('.repeater-values')!.querySelector('.current-repeats')!.textContent = '0'
        })
        repeater.querySelectorAll('.subtimer').forEach((element) => {
            element.className = 'subtimer'
        })
    }
    // If the parent repeaters or siblings' repeated enough times, rewinds back with 1 repeat, could probably improve it
    static rewindParentsAndSiblings(repeater: HTMLElement): void {
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

    static repeaterFinished():void {
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

    static isRepeater(element: HTMLElement): boolean {
        return element.className.includes('repeater')
    }
    static isRepeaterValues(element: HTMLElement): boolean {
        return element.className.includes('repeater-values')
        
    }
}