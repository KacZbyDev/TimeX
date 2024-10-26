import { TimerState, Utils } from "./utils.js";
import { Timer } from './timer.js';
import { Subtimer } from "./subtimer.js";
import { Repeater } from "./repeater.js";

$(document).ready(function () {
    //List
    $("#add-element-button").on("click", () => {
        Timer.pauseTimer()

        Utils.showMenu($('#modal')[0])
        $('#add-button').blur()
    });
    $('#edit-mode-button').on('click', () => {
        Utils.toggleEditMode()
        $('#edit-mode-button').blur()
    })
    $('.edit-button-subtimer').on('click', (event) => {
        Utils.openEditElementMenu(event.target.parentElement!)
    })
    $('.edit-button-repeater').on('click', (event) => {
        Utils.openEditElementMenu(event.target.parentElement!.parentElement!)
    })
    
    //Timer
    $('#pause-button').on('click', () => {
        Utils.toggleStop()
        $('#pause-button').blur()
    })
    $('#previous-button').on('click', () => {
        Subtimer.startPreviousSubtimer()
        $('#previous-button').blur()
    })
    $('#next-button').on('click', () => {
        Subtimer.startNextSubtimer()
        $('#next-button').blur()
    })
    
    //Edit menus
    $('#subtimer-menu-ok-button').on('click', () => {
        let menu: HTMLElement = document.getElementById('subtimer-menu')!
        let name = (menu.querySelector('.subtimer-name')! as HTMLSelectElement).value
        let duration = Utils.getItemPickerValue(menu.querySelector('.picker')!)
        
        if(Utils.timeToSeconds(duration) == 0) {
            Utils.showWarningPopUp("Seconds cant be 0")
            return
        }
        
        hideMenu(menu)

        Subtimer.setSubtimer(Utils.elementInEdit, name, duration)

        if(Utils.elementInEdit.parentElement == null)
            Utils.listContent.append(Utils.elementInEdit)

        Timer.resumeTimer()
    })
    $('#repeater-menu-ok-button').on('click', () => {
        let menu: HTMLElement = document.getElementById('repeater-menu')!
        let repeats = Utils.getItemPickerValue(menu.querySelector('.picker')!)

        hideMenu(menu)

        Repeater.setTotalRepeats(Utils.elementInEdit, repeats)

        if(Utils.elementInEdit.parentElement == null) {
            Utils.elementInEdit.appendChild(Subtimer.createSubtimer())
            Utils.listContent.append(Utils.elementInEdit)
        }

        Timer.resumeTimer()
    })
    $('#subtimer-menu-cancel-button').on('click', () => {
        hideMenu($('#subtimer-menu')[0])

        Timer.resumeTimer()
    })
    $('#repeater-menu-cancel-button').on('click', () => {
        hideMenu($('#repeater-menu')[0])

        Timer.resumeTimer()
    })

    //Modal
    $('#modal-add-subtimer').on('click', () => {
        Utils.elementInEdit = Subtimer.createSubtimer()
        
        hideMenu($('#modal')[0])
        Utils.openEditElementMenu(Utils.elementInEdit)
    })
    $('#modal-add-repeater').on('click', () => {
        Utils.elementInEdit = Repeater.createRepeater()

        hideMenu($('#modal')[0])
        Utils.openEditElementMenu(Utils.elementInEdit)
    })
    $('#modal-cancel-button').on('click', () => {
        Timer.resumeTimer()
        hideMenu($("#modal")[0])
    })
    
    //Others
    $('#blurred-backround').on('click', () => {
        if(!document.getElementById('warning-pop-up')!.className.includes('hidden'))
            Utils.hideWarningPopUp()

        if(Utils.isMenuVisible) {
            if (!document.getElementById('subtimer-menu')!.classList.contains('hidden'))
                hideMenu($('#subtimer-menu')[0])
            
            if (!document.getElementById('repeater-menu')!.classList.contains('hidden'))
                hideMenu($('#repeater-menu')[0])
            
            if (!document.getElementById('modal')!.classList.contains('hidden'))
                hideMenu($('#modal')[0])
        }

        Timer.resumeTimer()
    })
});

//Stops the page from reloading
$("#modal").submit(function(e) {
    e.preventDefault();
});
 
function hideMenu(menu: Element):void {
    Utils.isMenuVisible = false
    if(Timer.currentState != TimerState.Edit)
         $('#blurred-backround').addClass('hidden');
     
    $('#list-of-elements').addClass('z-50')
    menu.classList.add('hidden');
}
