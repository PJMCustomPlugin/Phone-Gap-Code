//var serviceIpAddress_PJM = 'http://pjmmobile.ggktech.com:8187'; // AWS
//var serviceIpAddress_PJM='http://103.255.144.120:8080'; 
//var serviceIpAddress_PJM='http://172.16.1.155:8181'; 
var serviceIpAddress_PJM='http://pjmtest.ggktech.com';
//var serviceIpAddress_PJM='http://111.93.16.21:8181'; 
//var serviceIpAddress_PJM='http://172.16.0.95:8181'; 

var notificationDetails = null;
var needToBeAlerted=false;
var isMoreReserves = false;

var previousPage = 1;
var userFeedbackClicks = 5;
var statusNotification = false;
var clicksCountset = localStorage.getItem('LMPMapClicks');
var allRegionsDeselected = false;
var allStatesDeselected = false;
var allTypesDeselected = false;
var previouslyUsedPage = 1;
var allEPTypesOnly = null;
var defaultMorePrevPageInPortrait = 0;
var moreScreenLoaded = false;
var mailToSendAFeedback = 'PJMNow@pjm.com';
var appTitle = 'PJM Now Test';
var networkTimeoutMessage = 'Network timeout. Please try again.';
var networkProblemMessage = 'Network problem. Please try again.';
var demandPageLoaded = 0;
var isAlertsClicked = false;
var isMoreClicked = false;

if (typeof clicksCountset === 'undefined' || clicksCountset === null || clicksCountset == NaN) {
    localStorage.setItem("LMPMapClicks", 0);
    localStorage.setItem("DemandClicks", 0);
    localStorage.setItem("alertsEnabledClicks", 0);
}
document.addEventListener("backbutton", function () {
    navigator.notification.confirm(
        'Are you sure  you want to exit ?', // message
        onConfirm, // callback to invoke with index of button pressed
        appTitle, // title
        'Yes,No' // buttonLabels
    );
}, false);

function onConfirm(eventClicked) {
    if (eventClicked == 1) {
        navigator.app.exitApp();
    } else { }
}

/*
	Navbar select item action performed in this method
*/

function onSelect(e) {

    isAlertsClicked = false;
    try{
        ZoneMapModule.closeZoneTrendWindow();
    }catch(e){}
    
    needToBeAlerted = false;
    if (e.item.index() == 0 || e.item.index() == 1 || e.item.index() == 2 || e.item.index() == 3) {

        if (getPageName(runningPage) == "EPAreasScreen") {
            if (allRegionsDeselected == true || allStatesDeselected == true) {
                needToBeAlerted = true;
                if (allRegionsDeselected == true) {
                    displayRegionSelectionNeededPopup();
                } else {
                    navigator.notification.alert("You must select at least one State.", null, "Warning", "OK");
                }
                alertsService.activateMoreScreen();

                // setTimeout(function () {
                //     $('div.km-footer div.km-widget.km-tabstrip a.km-state-active').removeClass("km-state-active");
                //     $('div.km-footer div.km-widget.km-tabstrip a:nth-child(4)').addClass("km-state-active");
                // }, 300);

            }
        } else if (getPageName(runningPage) == "EPTypesScreen") {
            if (allTypesDeselected == true && localStorage.getItem("PAHTypesOnlyEnabledFlag") == 'false') {
                needToBeAlerted = true;
                navigator.notification.alert("You must select at least one Type.", null, "Warning", "OK");
                alertsService.activateMoreScreen();
                
                // setTimeout(function () {
                //     $('div.km-footer div.km-widget.km-tabstrip a.km-state-active').removeClass("km-state-active");
                //     $('div.km-footer div.km-widget.km-tabstrip a:nth-child(4)').addClass("km-state-active");
                // }, 300);

            }
        }
    }
    if(e.item.index() > 0){
        try{
            setTimeout(function () {
                    $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-text').css("color","#7A848D"); 
            }, 50);
        }catch(e){}
    }
    if (e.item.index() == 0) {
        isAlertsClicked = true;
        isMoreClicked = false;
        try{
            alertsService.displayAlertsStatus();
            alertsService.showLatestAlertsPage();
        }catch(e){
            alert("INDEX.js EXCEPTION :"+e);
        }
    }
    if (e.item.index() == 1) {
        if (needToBeAlerted == false) {
            runningPageChange(1);
            try {
                window.screen.unlockOrientation();
            } catch (error) { }
            if (previousPage == 10) {
                navigationService.navigateToPageInDirection("zoneLMPMap","left");
            }else{
                navigationService.navigateToPageInDirection("zoneLMPMap","right");
            }
            previousPage = 1;
        }
    } else if (e.item.index() == 2) {
        if (needToBeAlerted == false) {
            runningPageChange(3);
                try {
                    window.screen.unlockOrientation();
                } catch (error) { }
                if (previousPage == 1 || previousPage == 10) {
                    navigationService.navigateToPageInDirection("demand","left");
                } else {
                    navigationService.navigateToPageInDirection("demand","right");
                }
                previousPage = 2;
                if(demandPageLoaded == 1){
                    refreshDemandGraphData();
                }
        }
    } else if (e.item.index() == 3) {
        if (needToBeAlerted == false) {
            runningPageChange(4);
            appService.lockPortraitViewInOnlyMobile();
            if (previousPage == 4) {
                navigationService.navigateToPageInDirection("tieflow","right");
            } else {
                navigationService.navigateToPageInDirection("tieflow","left");
            }
            previousPage = 3;
        }
    } else if (e.item.index() == 4) {
        isAlertsClicked = false;
        alertsService.displayAlertsStatus();
        alertsService.showAlertsPage();
        appService.lockPortraitViewInOnlyMobile();
        navigationService.navigateTo("more");
        previousPage = 4;
    }
}
$(function () {
    $("#moreNavLink").on("click", function () {
        isAlertsClicked = false;
        alertsService.displayAlertsStatus();
        alertsService.showAlertsPage();
        appService.lockPortraitViewInOnlyMobile();
        navigationService.navigateToPageInDirection("more","right");
        previousPage = 4;
    });
});
function isiPadPro(deviceModel){
 if(deviceModel == 'iPad6,7' || deviceModel == 'iPad6,8' || deviceModel == 'iPad6,3' || deviceModel == 'iPad6,4' 
    || deviceModel == 'iPad7,3' || deviceModel == 'iPad7,4' || deviceModel == 'iPad7,1' || deviceModel == 'iPad7,2'){
        return true;
    }
    return false;
}

function toChangePAHtoPAI(type){
    var today=new Date();
    var final=new Date(2018,01,02);
    //var final=new Date(2017,11,01);
    var text='';
    if (today.getTime()>=final.getTime()){
        if(type === 'type1'){
            text='PAI Types Only';
        }else if(type === 'type2'){
            text='Performance Assessment Interval (PAI)';
        }else{
            text='Performance Assessment Interval';
        }
    }else{
        if(type === 'type1'){
            text='PAH Types Only';
        }else if(type === 'type2'){
            text='Performance Assessment Hour (PAH)';
        }else{
            text='Performance Assessment Hour';
        }
    }
    return text;
}

document.addEventListener('deviceready', function () {
    if (device.platform == 'android' || device.platform == 'Android') {
        try {
            ActivityIndicator.show(" ");
        } catch (error) { }
    }
    var isaccepted = localStorage.getItem("isAccepted");
    var isDeviceRegisteredToCheck = localStorage.getItem("isDeviceRegisteredVal");
    if (isaccepted == 'accepted' && isDeviceRegisteredToCheck == 'registered') {
        pushNotificationService.registerForPushNotifications();
    }
}, false);