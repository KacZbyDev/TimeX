import {Utils} from './utils'

export class Subtimer {
    public static Count:number = 0
    public readonly ID:number

    public element:Element
    public name:string
    public readonly miliseconds:number

    constructor(element:Element) {
        this.ID = Subtimer.Count
        Subtimer.Count++

        this.element = element
        
        this.name = element!.firstElementChild!.textContent!
        this.miliseconds = Utils.timeToMiliseconds(element!.lastElementChild!.textContent!)
    }
}