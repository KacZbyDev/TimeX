import { Subtimer } from "./subtimer.js"
import { Timer } from "./timer.js"
import { UiHandler } from "./ui-handler.js"
import { TimerState } from "./utils.js"

export class Menus {
    public static readonly SUBTIMER_MENU: HTMLElement = document.getElementById('subtimer-menu')!
    public static readonly REPEATER_MENU: HTMLElement = document.getElementById('repeater-menu')!
    public static readonly ADD_ELEMENT_MENU: HTMLElement = document.getElementById('add-element-menu')!

    public static isMenuVisible: boolean = false
    public static elementInEdit: HTMLElement

    // Convert the picker values to a string
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

    // Set the picker values to the value parameter
    static setItemPickerValue(picker: HTMLElement, value: string): void {
        let values: string[] = value.split(':')
        
        for(let i: number = 0; i < picker.children.length; i++) {
            let val: string = values[values.length - i - 1];
            if(val)
                val = val.padStart(2, '0');

            (picker.children[picker.children.length - i - 1] as HTMLSelectElement).value = val || '00'
        }
    }

    static showMenu(menu: Element): void {
        if(Menus.getActiveMenu() != null)
            return 
        Menus.isMenuVisible = true
        
        // Show the menu, add the blurred backroudn and hide the element list
        menu.classList.remove('hidden');
        $('#blurred-backround').removeClass('hidden');
        UiHandler.ELEMENTS_LIST.classList.remove('z-50')
    }

    static hideActiveMenu(): void {
        let menu: HTMLElement = Menus.getActiveMenu()!
        Menus.isMenuVisible = false

        if(Timer.currentState != TimerState.Edit)
             $('#blurred-backround').addClass('hidden');
         
        UiHandler.ELEMENTS_LIST.classList.add('z-50')
        menu.classList.add('hidden');
    }

    // Shows the edit menu for the element and sets the fields
    static openEditElementMenu(element: HTMLElement): void  {
        let menu: HTMLElement
        Menus.elementInEdit = element

        if(Subtimer.isSubtimer(element)) {
            menu = Menus.SUBTIMER_MENU!;

            (menu.querySelector('.subtimer-name')! as HTMLInputElement).value = (Menus.elementInEdit.querySelector('.name')! as HTMLInputElement).textContent!;
            
            Menus.setItemPickerValue(menu.querySelector('.picker')!, element.querySelector('.duration')!.textContent!)
        }
        else {
            menu = Menus.REPEATER_MENU!
            
            Menus.setItemPickerValue(menu.querySelector('.picker')!, element.querySelector('.total-repeats')!.textContent!)
        }

        Menus.showMenu(menu)
    }

    static getActiveMenu(): HTMLElement | null {
        if(Menus.SUBTIMER_MENU!.classList.contains('hidden'))
            return Menus.SUBTIMER_MENU
        if(Menus.REPEATER_MENU!.classList.contains('hidden'))
            return Menus.REPEATER_MENU
        if(Menus.ADD_ELEMENT_MENU!.classList.contains('hidden'))
            return Menus.ADD_ELEMENT_MENU

        return null
    }
}