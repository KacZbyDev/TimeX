import { Utils } from "./utils.js";

let nameInput:HTMLInputElement = <HTMLInputElement>document.getElementById('timer-name')
let durationInput:HTMLInputElement = (<HTMLInputElement>document.getElementById('timer-duration'));

$(document).ready(function () {
    $("#add-button").on("click", () => {
        $('#modal').removeClass('hidden');
    });
    $('#modal-delete-button').on('click', () => {
        hideAndClearModal()
    })
    $('#modal-add-button').on('click', () => {
        if(!nameInput.value || !durationInput.value)//empty fields
            return

        addTimer(nameInput.value, durationInput.value)
        hideAndClearModal()
    })
});
//Stops the page from reloading
$("#modal").submit(function(e) {
    e.preventDefault();
});

function hideAndClearModal():void {
    $('#modal').addClass('hidden');

    nameInput.value = '';
    durationInput.value = '';
}

function addTimer (name:string, duration:string) : void {
    let parentList:HTMLElement = document.getElementById('list-content')!
    let newElement:HTMLElement = document.getElementById('subtimer-example')!.cloneNode(true) as HTMLElement
    
    newElement.querySelector('.name')!.textContent = name

    newElement.querySelector('.duration')!.textContent = Utils.timeToCorrectTime(duration)
    
    parentList.appendChild(newElement)
}