import { TimerState, Utils } from "./utils.js";
import { Timer } from './timer.js';
import { Subtimer } from "./subtimer.js";
import { Repeater } from "./repeater.js";
import { Menus } from "./menus.js";
import { UiHandler } from "./ui-handler.js";

$(document).ready(function () {
    //LIST
    $("#add-element-button").on("click", () => {
        Timer.pauseTimer()
        Menus.showMenu($('#add-element-menu')[0])
    });
    $('#edit-mode-button').on('click', () => {
        Utils.toggleEditMode()
    })
    
    //TIMER
    $('#pause-button').on('click', () => {
        Utils.toggleStop()
    })
    $('#previous-button').on('click', () => {
        Subtimer.startPreviousSubtimer()
    })
    $('#next-button').on('click', () => {
        Subtimer.startNextSubtimer()
    })
    
    //EDIT MENUS
    $('#subtimer-menu-ok-button').on('click', () => {
        //TODO solve time shown as 15:: when I wanted 15 hours, also when I try to edit 15 hours it shows 15: blank : blank even though the first issue 'solved'
        //Get values from menu
        let menu: HTMLElement = document.getElementById('subtimer-menu')!
        let name: string = (menu.querySelector('.subtimer-name')! as HTMLSelectElement).value
        let duration: string = Menus.getItemPickerValue(menu.querySelector('.picker')!)
        
        if(duration == '')
            duration = '1'
        
        Subtimer.setSubtimer(Menus.elementInEdit, name, duration)
        
        Menus.hideMenu(menu)

        if(Menus.elementInEdit.parentElement == null) {
            Menus.elementInEdit
            UiHandler.LIST_CONTENT.append(Menus.elementInEdit)
        }

        Utils.saveList()
        Timer.resumeTimer()
    })
    $('#repeater-menu-ok-button').on('click', () => {
        //Get values from menu
        let menu: HTMLElement = document.getElementById('repeater-menu')!
        let repeats: string = Menus.getItemPickerValue(menu.querySelector('.picker')!)
        
        Repeater.setTotalRepeats(Menus.elementInEdit, repeats)
        
        Menus.hideMenu(menu)

        if(Menus.elementInEdit.parentElement == null)
            UiHandler.LIST_CONTENT.append(Menus.elementInEdit)

        Utils.saveList()
        Timer.resumeTimer()
    })
    $('#subtimer-menu-cancel-button').on('click', () => {
        Menus.hideMenu($('#subtimer-menu')[0])

        Timer.resumeTimer()
    })
    $('#repeater-menu-cancel-button').on('click', () => {
        Menus.hideMenu($('#repeater-menu')[0])

        Timer.resumeTimer()
    })

    //ADD ELEMENT MENU
    $('#add-element-menu-subtimer').on('click', () => {
        Menus.elementInEdit = Subtimer.createSubtimer()
        
        Menus.hideMenu($('#add-element-menu')[0])
        Menus.openEditElementMenu(Menus.elementInEdit)
    })
    $('#add-element-menu-repeater').on('click', () => {
        Menus.elementInEdit = Repeater.createRepeater()

        Menus.hideMenu($('#add-element-menu')[0])
        Menus.openEditElementMenu(Menus.elementInEdit)
    })
    $('#add-element-menu-cancel-button').on('click', () => {
        Timer.resumeTimer()
        Menus.hideMenu($("#add-element-menu")[0])
    })
    
    //OTHERS
    $('#blurred-backround').on('click', () => {
        //Exit edit mode
        if(Timer.currentState == TimerState.Edit && UiHandler.ELEMENTS_LIST.classList.contains('z-50')) {
            Utils.toggleEditMode()
            return
        }

        Menus.hideAllMenus()
        Timer.resumeTimer()
    })
});