$(document).ready(function () {
    $("#add-button").on("click", () => {
        $('#modal').removeClass('hidden');
        $('#modal-background').removeClass('hidden');
    });
    $('#modal-delete-button').on('click', () => {
        $('#modal').addClass('hidden');
        $('#modal-background').addClass('hidden');
    })
});