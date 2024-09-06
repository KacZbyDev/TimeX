import { Utils } from './utils.js';
export class Subtimer {
    constructor(element) {
        this.element = element;
        this.time = element.firstElementChild;
        this.name = element.firstElementChild.textContent;
        this.miliseconds = Utils.timeToMiliseconds(element.lastElementChild.textContent);
    }
}
//# sourceMappingURL=subtimer.js.map