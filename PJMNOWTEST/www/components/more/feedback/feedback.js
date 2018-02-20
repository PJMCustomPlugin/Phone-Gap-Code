if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
    $('.moreContent').addClass('moreContent_tab');
} else {
    $('.moreContent').addClass('moreContent_phone');
}
function composeEmail(e) {
    var feedbackScreenName = "Feedback";
    if(device.platform == 'Android' || device.platform == 'android'){
          Base64.fileCreationInAndroidAndSendMail(feedbackScreenName); 
    } else if(device.platform == "iOS"){
         Base64.fileCreationInIOSAndSendMail(feedbackScreenName);
    }
}

function callback(e) {
    navigator.notification.alert(JSON.stringify(msg), null, 'EmailComposer callback', 'Close');
}

function checkSimulator() {
    if (window.navigator.simulator === true) {
        alert('This plugin is not available in the simulator.');
        return true;
    } else if (window.plugin === undefined) {
        alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
        return true;
    } else {
        return false;
    }
}

function backToMoreFromFeedback() {
    runningPageChange(6);
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        window.screen.unlockOrientation();
    }
}