export class Repeater {

    //resets every child of the repeater through iteration
    static resetChildren(repeater:Element): void {
        for (let i:number = 1; i < repeater.children.length; i++) {
            let child:Element = repeater.children[i]

            if(child.className.includes('repeater')) {//
                child.querySelector('.repeater-values')!.querySelector('.current-repeats')!.textContent = '0'
                this.resetChildren(child)
            } else
                child.className = 'subtimer'
        }
    }

    //iterates through every single repeater until it finds the first subtimer (iterates through nested repeaters)
    static setListToFirstSubtimerParent(list:Element): boolean {
        for (let i:number = 0; i < list.children.length; i++) {
            let child:Element = list.children[i]

            if(child.className.includes('subtimer')) {
                list = child.parentElement!
                return true
            }

            if(this.setListToFirstSubtimerParent(child))
                return true
        }

        return false
    }
}