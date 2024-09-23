import { Utils } from "./utils.js";
import { Timer } from './timer.js'
import { Repeater } from './repeater.js'

let nameInput:HTMLInputElement = <HTMLInputElement>document.getElementById('timer-name')
let durationInput:HTMLInputElement = (<HTMLInputElement>document.getElementById('timer-duration'));

$(document).ready(function () {
    $("#add-button").on("click", () => {
        Timer.pauseTimer()
        $('#modal').removeClass('hidden');
    });
    $('#reset-button').on('click', () => {
        Timer.list = document.getElementById('list-content')!
        Repeater.resetChildren(Timer.list)
        
        Timer.startTimer()

        hideAndClearModal()
    })
    $('#modal-delete-button').on('click', () => {
        Timer.resumeTimer()

        hideAndClearModal()
    })
    $('#modal-add-button').on('click', () => {
        if(!areInputsValid())//empty fields
            return

        Utils.addTimer(nameInput.value, durationInput.value)
        Timer.resumeTimer()
    })
});
    
//Stops the page from reloading
$("#modal").submit(function(e) {
    e.preventDefault();
    hideAndClearModal()
});

function areInputsValid():boolean {
    if(!nameInput.value || !Utils.timeToSeconds(durationInput.value))
        return false

    return true
}

function hideAndClearModal():void {
    $('#modal').addClass('hidden');

    nameInput.value = '';
    durationInput.value = '';
}
