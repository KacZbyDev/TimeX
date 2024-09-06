import {Utils} from './utils.js'

export class Subtimer {
    public element:Element
    public time:Element

    public name:string
    public readonly miliseconds:number

    constructor(element:Element) {
        this.element = element
        this.time = element.firstElementChild!
        this.name = element!.firstElementChild!.textContent!
        this.miliseconds = Utils.timeToMiliseconds(element!.lastElementChild!.textContent!)
    }
}