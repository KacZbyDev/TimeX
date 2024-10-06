import { TimerState, Utils } from "./utils.js";
import { Timer } from './timer.js';

let nameInput:HTMLInputElement = <HTMLInputElement>document.getElementById('timer-name')
let durationInput:HTMLInputElement = (<HTMLInputElement>document.getElementById('timer-duration'));

$(document).ready(function () {
    $("#add-button").on("click", () => {
        Timer.pauseTimer()
        $('#modal').removeClass('hidden');
    });
    $('#reset-button').on('click', () => {
        //TODO kinda useless maybe can replace with something more useful, like edit mode
        /*
        Timer.list = document.getElementById('list-content')!
        Repeater.resetChildren(Timer.list)
        
        Timer.currentState = TimerState.Paused
        Timer.startTimer()
        */
    })
    $('#modal-add-button').on('click', () => {
        if(!areInputsValid())//empty fields
            return

        Utils.addTimer(nameInput.value, durationInput.value)
        Timer.resumeTimer()
    })
    $('#modal-cancel-button').on('click', () => {
        Timer.resumeTimer()
        hideAndClearModal()
    })
    $('#modal-background').on('click', () => {
        Timer.resumeTimer()
        hideAndClearModal()
    })
    $('#pause-button').on('click', () => {//Stops the timer
        if(Timer.currentState == TimerState.Active) {
            Timer.currentState = TimerState.Finished
            document.getElementById('pause-button')!.textContent = '>'
            return
        }
        document.getElementById('pause-button')!.textContent = '| |'
        Timer.currentState = TimerState.Active
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
