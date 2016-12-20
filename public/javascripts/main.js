
$(function () {
    $('td').click(function () {
        $('#message .value').text($(this).text() || 'Empty');
        $('#message .value').css("background-color", $(this).css("background-color"));
        $('#message .value').css("background-color", $(this).css("background-color"));
        $('#message .value').css("color", $(this).css("color"));
    });
});
