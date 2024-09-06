import { Utils } from './utils.js';
export class Subtimer {
    constructor(element) {
        this.ID = Subtimer.Count;
        Subtimer.Count++;
        this.element = element;
        this.name = element.firstElementChild.textContent;
        this.miliseconds = Utils.timeToMiliseconds(element.lastElementChild.textContent);
    }
}
Subtimer.Count = 0;
//# sourceMappingURL=subtimer%20copy.js.map