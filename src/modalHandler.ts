import { Utils } from "./utils.js";
import { Timer } from './script.js'
import { Repeater } from './repeater.js'


let nameInput:HTMLInputElement = <HTMLInputElement>document.getElementById('timer-name')
let durationInput:HTMLInputElement = (<HTMLInputElement>document.getElementById('timer-duration'));

$(document).ready(function () {
    $("#add-button").on("click", () => {
        Timer.timerRefresherStopped = true
        clearInterval(Timer.timerRefresher)

        $('#modal').removeClass('hidden');
    });
    $('#reset-button').on('click', () => {
        Timer.list = document.getElementById('list-content')!
        Repeater.resetChildren(Timer.list)
        
        Timer.startTimer()

        hideAndClearModal()
    })
    $('#modal-delete-button').on('click', () => {
        if(Timer.timerRefresherStopped) {//if the timerRefresher is not started
            Timer.elapsedTime = Date.now()
            Timer.timerRefresherStopped = false
            Timer.timerRefresher = setInterval(() => Timer.updateTime(), Utils.REFRESH_DELAY)
        }
        hideAndClearModal()
    })
    $('#modal-add-button').on('click', () => {
        if(!areInputsValid())//empty fields
            return

        addTimer(nameInput.value, durationInput.value)
        hideAndClearModal()
    })
});
    
//Stops the page from reloading
$("#modal").submit(function(e) {
    e.preventDefault();
});

function areInputsValid():boolean {
    if(!nameInput.value)
        return false

    if(!Utils.timeToSeconds(durationInput.value))
        return false

    return true
}

function hideAndClearModal():void {
    $('#modal').addClass('hidden');

    nameInput.value = '';
    durationInput.value = '';
}

function addTimer (name:string, duration:string) : void {
    let parentList:HTMLElement = document.getElementById('list-content')!
    let newElement:HTMLElement = document.getElementById('subtimer-example')!.cloneNode(true) as HTMLElement
    
    newElement.querySelector('.name')!.textContent = name
    
    newElement.querySelector('.duration')!.textContent = duration
    
    parentList.appendChild(newElement)
}