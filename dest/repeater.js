export class Subtimer {
    constructor(element, positionInList) {
        this.element = element;
        this.positionInList = positionInList;
        this.totalRepeats = parseInt(element.firstChild.firstChild.textContent);
        this.currentRepeats = parseInt(element.firstChild.lastChild.textContent);
    }
}
//# sourceMappingURL=repeater.js.map