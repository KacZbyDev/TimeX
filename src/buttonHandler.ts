import { TimerState, Utils } from "./utils.js";
import { Timer } from './timer.js';
import { Subtimer } from "./subtimer.js";

const nameInput:HTMLInputElement = <HTMLInputElement>document.getElementById('subtimer-name')
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
    $('.edit-button-repeater').on('click', () => {
        let menu: HTMLElement = document.getElementById('repeater-menu')!
        menu.classList.remove('hidden')
        menu.querySelector('.repeater-repeats')!.textContent = 'idk how do you get this value'
    })
    $('.edit-button').on('click', () => {
        let menu: HTMLElement = document.getElementById('subtimer-menu')!
        menu.classList.remove('hidden')
        menu.querySelector('.subtimer-name')!.textContent = 'idk how do you get this value'
        menu.querySelector('.subtimer-time')!.textContent = 'idk how do you get this value neither'
    })
    $('#blurred-backround').on('click', () => {
        if(Utils.isModalVisible)
            hideAndClearModal()
        if(!document.getElementById('warning-pop-up')!.className.includes('hidden'))
            Utils.hideWarningPopUp()
        document.getElementById('subtimer-menu')!.classList.add('hidden')
        document.getElementById('repeater-menu')!.classList.add('hidden')

        Timer.resumeTimer()
    })
    $('#pause-button').on('click', () => {//Stops the timer
        Utils.toggleStop()
        $('#pause-button').blur()
    })
    $('#previous-button').on('click', () => {//Starts the previous timer
        Subtimer.startPreviousSubtimer()
        $('#pause-button').blur()
    })
    $('#next-button').on('click', () => {//Starts the next subtimer
        Subtimer.startNextSubtimer()
        $('#pause-button').blur()
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
