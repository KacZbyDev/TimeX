import { TimerState, Utils } from "./utils.js";
import { Timer } from './timer.js';
import { Subtimer } from "./subtimer.js";

const nameInput:HTMLInputElement = <HTMLInputElement>document.getElementById('subtimer-name')
const durationInput:HTMLInputElement = (<HTMLInputElement>document.getElementById('picker'));

$(document).ready(function () {
    //UI buttons
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
        let menu: HTMLElement = document.getElementById('subtimer-menu')!
        
        menu.querySelector('.subtimer-name')!.setAttribute('placeholder', event.target.parentElement!.querySelector('.name')!.textContent!) 
        Utils.setItemPickerValue(menu.querySelector('.picker')!, event.target.parentElement!.querySelector('.duration')!.textContent!)
        
        // TODO editElement = event.target
        Utils.showMenu(menu)
    })
    $('.edit-button-repeater').on('click', (event) => {
        let menu: HTMLElement = document.getElementById('repeater-menu')!

        Utils.setItemPickerValue(menu.querySelector('.picker')!, event.target.parentElement!.querySelector('.total-repeats')!.textContent!)
        Utils.showMenu(menu)
    })
    $('#repeater-menu-cancel-button').on('click', () => {
       hideAndClearMenu($('#repeater-menu')[0])
    })
    $('#subtimer-menu-cancel-button').on('click', () => {
        hideAndClearMenu($('#subtimer-menu')[0])
    })
    
    //More buttons
    $('#modal-add-button').on('click', () => {
        if(!areInputsValid())//empty fields
            return
        
        Utils.addTimer(nameInput.value, durationInput)
        Timer.resumeTimer()
        hideAndClearMenu($('#modal')[0])
    })
    $('#modal-cancel-button').on('click', () => {
        Timer.resumeTimer()
        hideAndClearMenu($("#modal")[0])
    })
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

    //Others
    $('#blurred-backround').on('click', () => {
        if(!document.getElementById('warning-pop-up')!.className.includes('hidden'))
            Utils.hideWarningPopUp()

        if(Utils.isModalVisible) {
            if (!document.getElementById('subtimer-menu')!.classList.contains('hidden')) {
                hideAndClearMenu($('#subtimer-menu')[0])
            }
            if (!document.getElementById('repeater-menu')!.classList.contains('hidden')) {
                hideAndClearMenu($('#repeater-menu')[0])
            }
            if (!document.getElementById('modal')!.classList.contains('hidden')) {
                hideAndClearMenu($('#modal')[0])
            }
            
        }
        Timer.resumeTimer()
    })
});

//Stops the page from reloading
$("#modal").submit(function(e) {
    e.preventDefault();
});

function areInputsValid():boolean {
    if(!nameInput.value || Utils.getItemPickerValue(durationInput) == "00:00:00") {
        Utils.showWarningPopUp(Utils.getItemPickerValue(durationInput) + nameInput.value)

        return false
    }

    return true
}
 
function hideAndClearMenu(menu: Element):void {
    Utils.isModalVisible = false
    if(Timer.currentState != TimerState.Edit)
         $('#blurred-backround').addClass('hidden');
     
    $('#list-of-elements').addClass('z-50')

    menu.classList.add('hidden');
    
    if (menu == $('#modal')[0]) {
        nameInput.value = '';

        //TODO reset durationInput
        durationInput.value = '';
    }
}
