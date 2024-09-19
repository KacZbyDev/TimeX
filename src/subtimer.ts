import {Utils} from './utils.js'

export class Subtimer {
    public element:Element

    public name:string
    public readonly duration:number

    //get the time and name from the variables stored in the html
    constructor(element:Element) {
        this.element = element
        this.name = (<HTMLElement>element!.querySelector('.name')!).textContent!
        this.duration = Utils.timeToMiliseconds(element!.querySelector('.duration')!.textContent!)

        element.className = 'subtimer-active';
    }
}