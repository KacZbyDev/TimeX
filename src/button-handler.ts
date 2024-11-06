import { TimerState, Utils } from "./utils.js";
import { Timer } from './timer.js';
import { Subtimer } from "./subtimer.js";
import { Repeater } from "./repeater.js";
import { Menus } from "./menus.js";
import { UiHandler } from "./ui-handler.js";

$(document).ready(function () {
    // LIST
    $("#add-element-button").on("click", () => {
        Timer.pauseTimer()
        Menus.showMenu($('#add-element-menu')[0])
    });
    $('#edit-mode-button').on('click', () => {
        Utils.toggleEditMode()
    })
    
    // TIMER
    $('#pause-button').on('click', () => {
        Utils.toggleStop()
    })
    $('#previous-button').on('click', () => {
        Subtimer.startPreviousSubtimer()
    })
    $('#next-button').on('click', () => {
        Subtimer.startNextSubtimer()
    })
    
    // EDIT MENUS
    // Changes the values of a subtimer, if it subtimer was newly created add it to the list
    $('#subtimer-menu-ok-button').on('click', () => {
        //Get values from menu
        let menu: HTMLElement = document.getElementById('subtimer-menu')!
        let name: string = (menu.querySelector('.subtimer-name')! as HTMLSelectElement).value
        let duration: string = Menus.getItemPickerValue(menu.querySelector('.picker')!)
        
        if(duration == '')
            duration = '1'
        
        Subtimer.setSubtimer(Menus.elementInEdit, name, duration)
        
        Menus.hideActiveMenu()

        //If was newly created
        if(Menus.elementInEdit.parentElement == null) {
            Menus.elementInEdit
            UiHandler.LIST_CONTENT.append(Menus.elementInEdit)
        }

        Utils.saveList()
        Timer.resumeTimer()
    })
    // Changes the values of a repeater, if it was newly created add it to the list
    $('#repeater-menu-ok-button').on('click', () => {
        //Get values from menu
        let menu: HTMLElement = document.getElementById('repeater-menu')!
        let repeats: string = Menus.getItemPickerValue(menu.querySelector('.picker')!)
        
        Repeater.setTotalRepeats(Menus.elementInEdit, repeats)
        
        Menus.hideActiveMenu()

        if(Menus.elementInEdit.parentElement == null)
            UiHandler.LIST_CONTENT.append(Menus.elementInEdit)

        Utils.saveList()
        Timer.resumeTimer()
    })
    $('#subtimer-menu-cancel-button').on('click', () => {
        Menus.hideActiveMenu()

        Timer.resumeTimer()
    })
    $('#repeater-menu-cancel-button').on('click', () => {
        Menus.hideActiveMenu()

        Timer.resumeTimer()
    })

    // ADD ELEMENT MENU - create elements and edit them in the menus
    $('#add-element-menu-subtimer').on('click', () => {
        Menus.elementInEdit = Subtimer.createSubtimer()
        
        Menus.hideActiveMenu()
        Menus.openEditElementMenu(Menus.elementInEdit)
    })
    $('#add-element-menu-repeater').on('click', () => {
        Menus.elementInEdit = Repeater.createRepeater()

        Menus.hideActiveMenu()
        Menus.openEditElementMenu(Menus.elementInEdit)
    })
    $('#add-element-menu-cancel-button').on('click', () => {
        Timer.resumeTimer()
        Menus.hideActiveMenu()
    })
    
    // OTHERS
    $('#blurred-backround').on('click', () => {
        // Exit edit mode
        if(Timer.currentState == TimerState.Edit && Menus.getActiveMenu() == null) {
            Utils.toggleEditMode()
            return
        }

        Menus.hideActiveMenu()
        Timer.resumeTimer()
    })
});