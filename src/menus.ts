import { Subtimer } from "./subtimer.js"
import { Timer } from "./timer.js"
import { UiHandler } from "./ui-handler.js"
import { TimerState } from "./utils.js"

export class Menus {
    public static isMenuVisible: boolean = false
    public static elementInEdit: HTMLElement

    static getItemPickerValue(picker: HTMLElement): string {
        let res: string = ''
        let wasValue: boolean = false

        for(let i = 0; i < picker.children.length; i++) {
            let val:string = (picker.children[i] as HTMLSelectElement).value

            if(wasValue) {
                if(val.length == 1)
                    val = '0' + val
                val = ':' + val
            }

            if(val == '00' && !wasValue)
                continue
            else
                wasValue = true

            if(parseInt(val) >= 1 && parseInt(val) <= 9)
                val = val[1]
            res += val
        }
        
        return res
    } 

    static setItemPickerValue(picker: HTMLElement, value: string) {
        let values: string[] = value.split(':')
        
        for(let i: number = 0; i < picker.children.length; i++) {
            let val: string = values[values.length - i - 1];
            if(val)
                val = val.padStart(2, '0');

            (picker.children[picker.children.length - i - 1] as HTMLSelectElement).value = val || '00'
        }
    }
        

    static resetPicker(picker: HTMLElement) {
        for(let i: number = 0; i < picker.children.length - 1; i++)
            (picker.children[i] as HTMLSelectElement).value = "00";

        (picker.children[picker.children.length - 1] as HTMLSelectElement).value = "01"
    }

    static showMenu(menu: Element): void {
        if(Menus.isMenuVisible)
            return
        Menus.isMenuVisible = true
        
        menu.classList.remove('hidden');
        $('#blurred-backround').removeClass('hidden');
        UiHandler.ELEMENTS_LIST.classList.remove('z-50')
    }

    static hideMenu(menu: Element):void {
        Menus.isMenuVisible = false

        if(Timer.currentState != TimerState.Edit)
             $('#blurred-backround').addClass('hidden');
         
        UiHandler.ELEMENTS_LIST.classList.add('z-50')
        menu.classList.add('hidden');
    }

    static openEditElementMenu(element: HTMLElement) {
        let menu: HTMLElement
        Menus.elementInEdit = element

        if(Subtimer.isSubtimer(element)) {
            menu = document.getElementById('subtimer-menu')! as HTMLElement

            (menu.querySelector('.subtimer-name')! as HTMLInputElement).value = (Menus.elementInEdit.querySelector('.name')! as HTMLInputElement).textContent!;
            
            Menus.setItemPickerValue(menu.querySelector('.picker')!, element.querySelector('.duration')!.textContent!)
        }
        else {
            menu = document.getElementById('repeater-menu')!
            
            Menus.setItemPickerValue(menu.querySelector('.picker')!, element.querySelector('.total-repeats')!.textContent!)
        }

        Menus.showMenu(menu)
    }

    static hideAllMenus() {
        Menus.hideMenu($('#subtimer-menu')[0])
        Menus.isMenuVisible = true
        Menus.hideMenu($('#repeater-menu')[0])
        Menus.isMenuVisible = true
        Menus.hideMenu($('#add-element-menu')[0])
        Menus.isMenuVisible = false
    }
}