/**
 * Created by elporfirio on 24/05/17.
 */
$(document).ready(function() {
    var screen = $('#loading-screen');
    configureLoadingScreen(screen);

});

function configureLoadingScreen(screen) {
    $(document)
        .ajaxStart(function() {
            screen.fadeIn();
        })
        .ajaxStop(function() {
            screen.fadeOut();
        });
}