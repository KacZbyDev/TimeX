import { TimerState, Utils } from "./utils.js";
import { Timer } from './timer.js';
import { Subtimer } from "./subtimer.js";

const nameInput:HTMLInputElement = <HTMLInputElement>document.getElementById('subtimer-name')
const durationInput:HTMLInputElement = (<HTMLInputElement>document.getElementById('timer-duration'));

$(document).ready(function () {
    //UI buttons
    $("#add-element-button").on("click", () => {
        Timer.pauseTimer()

        showMenu($('#modal')[0])
        $('#add-button').blur()
    });
    $('#edit-mode-button').on('click', () => {
        Utils.toggleEditMode()
        $('#edit-mode-button').blur()
    })
    $('.edit-button-subtimer').on('click', (event) => {
        let menu: HTMLElement = document.getElementById('subtimer-menu')!

        menu.querySelector('.subtimer-name')!.setAttribute('placeholder', event.target.parentElement!.querySelector('.name')!.textContent!)  
        menu.querySelector('.subtimer-time')!.textContent =  event.target.parentElement!.querySelector('.duration')!.textContent
        showMenu(menu)
    })
    $('.edit-button-repeater').on('click', (event) => {
        let menu: HTMLElement = document.getElementById('repeater-menu')!

        menu.querySelector('.repeater-repeats')!.textContent = event.target.parentElement!.querySelector('.total-repeats')!.textContent
        showMenu(menu)
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
            
        //Doesnt work idk
        Utils.addTimer(nameInput.value, durationInput.value)
        Timer.resumeTimer()
        hideAndClearMenu($('#modal-add-button')[0])
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
    if(!nameInput.value || Number.isNaN(Utils.timeToSeconds(durationInput.value))) {
        Utils.showWarningPopUp('somethings wrong I can feel it')
        return false
    }

    return true
}

function showMenu(menu: Element): void {
    if(Utils.isModalVisible)
        return
    Utils.isModalVisible = true
    
    menu.classList.remove('hidden');
    $('#blurred-backround').removeClass('hidden');
    $('#list-of-subtimer').removeClass('z-50')
}
 
function hideAndClearMenu(menu: Element):void {
    Utils.isModalVisible = false
    if(Timer.currentState != TimerState.Edit)
         $('#blurred-backround').addClass('hidden');
     
    $('#list-of-subtimer').addClass('z-50')

    menu.classList.add('hidden');
    
    if (menu == $('#modal')[0]) {
        nameInput.value = '';
        durationInput.value = '';
    }
}
