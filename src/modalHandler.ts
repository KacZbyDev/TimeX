let nameInput:HTMLInputElement = <HTMLInputElement>document.getElementById('timer-name')
let durationInput:HTMLInputElement = (<HTMLInputElement>document.getElementById('timer-duration'));

$(document).ready(function () {
    $("#add-button").on("click", () => {
        $('#modal').removeClass('hidden');
        $('#modal-background').removeClass('hidden');
    });
    $('#modal-delete-button').on('click', () => {
        hideAndClearModal()
    })
    $('#modal-add-button').on('click', () => {
        if(!nameInput.value || !durationInput.value)//fields empty
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
    $('#modal-background').addClass('hidden');

    nameInput.value = '';
    durationInput.value = '';
}

function addTimer (name:string, time:string) : void {
    let parentList:HTMLElement = document.getElementById('list-content')!
    let newElement:Node = document.getElementById('timer-example')!.cloneNode(true)
    
    newElement.childNodes[1].textContent = name

    //TODO format time with the utils method
    newElement.childNodes[3].textContent = time
    
    parentList.appendChild(newElement)
}