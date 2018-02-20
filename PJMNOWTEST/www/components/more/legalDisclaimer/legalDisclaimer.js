function legalDisclaimerLock() {
    runningPageChange(6);
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        window.screen.unlockOrientation();
    }
}

if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
    $('.moreContent').addClass('moreContent_tab');
} else {
    $('.moreContent').addClass('moreContent_phone');
}

