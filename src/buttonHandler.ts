import { TimerState, Utils } from "./utils.js";
import { Timer } from './timer.js';

const nameInput:HTMLInputElement = <HTMLInputElement>document.getElementById('timer-name')
const durationInput:HTMLInputElement = (<HTMLInputElement>document.getElementById('timer-duration'));

$(document).ready(function () {
    $('#edit-mode-button').on('click', () => {
        Utils.toggleEditMode()
        $('#edit-mode-button').blur()
    })
    $("#add-button").on("click", () => {
        Timer.pauseTimer()
        showModal()
        $('#add-button').blur()
    });
    $('#modal-add-button').on('click', () => {
        if(!areInputsValid())//empty fields
            return
            
        //DOesnt work idk
        Utils.addTimer(nameInput.value, durationInput.value)
        Timer.resumeTimer()
        hideAndClearModal()
    })
    $('#modal-cancel-button').on('click', () => {
        Timer.resumeTimer()
        hideAndClearModal()
    })
    $('#blurred-backround').on('click', () => {
        if(Utils.isModalVisible)
            hideAndClearModal()
        if(!document.getElementById('warning-pop-up')!.className.includes('hidden'))
            Utils.hideWarningPopUp()
        
        Timer.resumeTimer()
    })
    $('#pause-button').on('click', () => {//Stops the timer
        Utils.toggleStop()
        $('#pause-button').blur() //Prevents keyboard focus
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

function showModal(): void {
    Utils.isModalVisible = true
    
    $('#modal').removeClass('hidden');
    $('#blurred-backround').removeClass('hidden');
}
 
function hideAndClearModal():void {
    Utils.isModalVisible = false

    $('#modal').addClass('hidden');
    if(Timer.currentState != TimerState.Edit)
         $('#blurred-backround').addClass('hidden');

    nameInput.value = '';
    durationInput.value = '';
}
