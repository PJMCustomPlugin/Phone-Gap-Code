var upDatein = 1000 * 60 * 2;
var upDateLatestAlertsTime = 1000 * 35*1;
var updateAnalyticsTime=1000*60*5;
var runningPage = 1;
var notificationsObj = [];

var startingTimeOfPage = Math.floor(Date.now() / 1000);
var app;
var isAutomaticUpdate=false;
var appVersion = '';
var isResumeMode = false;
var isDeviceRegisteredFlagChecked = false;
(function () {

    /* 
    		This function is called by Cordova when the application is loaded by the device  
    */

    document.addEventListener('deviceready', function () {
            localStorage.setItem("isDeviceRegistered",false);  
            dbapp.openDb();
            var accepted=localStorage.getItem("isAccepted");
        
            if(jQuery.isEmptyObject(accepted)){
                badgeService.updateBadgeOnAppIcon(0);
            }
            appService.retrieveOfflineData();
            try{
                setTimeout(function(){
                    if(jQuery.isEmptyObject(dbapp.emergencyProcedureData)){
                        if(jQuery.isEmptyObject(localStorage.getItem("epDataInserted"))
                        || (jQuery.isEmptyObject(localStorage.getItem("epDataInserted"))==false 
                                                    && JSON.parse(localStorage.getItem("epDataInserted")) == false)){
                            alertsService.getEPDataOnResume();
                        }
                    }
                },1000);
            }catch(error){}
            try {
                    if (isOnline()) {   
                        if (device.platform == 'android' || device.platform == 'Android') {
                            setTimeout(function(){
                                appService.checkForUpdatesAndUpdateFlagIfNotificationIsReceived(accepted);
                            },4000);
                        }else {
                            setTimeout(function(){
                                appService.checkForUpdatesAndUpdateFlagIfNotificationIsReceived(accepted);
                            },1000);
                        }	
                    }
            } catch (error) {}

            setTimeout(function () {
                try {
                    if (!statusNotification) {
                        UpdatePagedetails(22, 1);
                    }
                } catch (error) {}
                deviceModel.checkAppVersion();
            }, 100);
            setTimeout(function () {
                collectAnalyticsOnStartUp();
            }, 2000);
    }, false);

    document.addEventListener('resume', function () { 
        isResumeMode = true;
        var accepted=localStorage.getItem("isAccepted");
        setTimeIntervalForUpdatingLatestAlerts=setInterval(updateChecEveryOneMinuteInOnline, upDateLatestAlertsTime);
        setTimeout(function(){
            appService.checkForUpdatesAndUpdateFlagIfNotificationIsReceived(accepted);
            setTimeIntervalForUpdatingApp=setInterval(updateChecEveryTwoMinutesInOnline, upDatein);
        },100);
        // re initialise values
        collectAnalyticsOnStartUp();
        sendingAnalyticsAtEveryFiveMinutesCall=setInterval(sendingAnalytics,updateAnalyticsTime);
    }, false);

    document.addEventListener('pause', function () {
        clearInterval(setTimeIntervalForUpdatingApp);
        clearInterval(setTimeIntervalForUpdatingLatestAlerts);
        clearInterval(sendingAnalyticsAtEveryFiveMinutesCall);
    }, false);

    document.addEventListener('offline', function () {}, false);

    document.addEventListener('online', function () {}, false);
}());


/* Updating the application Every five minutes */
var setTimeIntervalForUpdatingApp=setInterval(updateChecEveryTwoMinutesInOnline, upDatein);

/* Updating the latest Alerts and Messages screen for Every one minute */
var setTimeIntervalForUpdatingLatestAlerts=setInterval(updateChecEveryOneMinuteInOnline, upDateLatestAlertsTime);

/*Sending Analytics every Five Mintes*/
var sendingAnalyticsAtEveryFiveMinutesCall=setInterval(sendingAnalytics,updateAnalyticsTime);

function updateChecEveryTwoMinutesInOnline(){
    if (isOnline()) {
        servicesModel.updateCheckForEveryTwoMinutes();
    }
}

function updateChecEveryOneMinuteInOnline(){
    if (isOnline()) {
        servicesModel.updateCheckForEveryOneMinute();
    }
}

function sendingAnalytics(){
     try {
          if (isOnline()) {
            runningPageChange(runningPage);
            setTimeout(function(){
                   dbapp.retrieveForAnalyticsInFiveMinutesInterval();
            },100);
          }
    } catch (error) {}
}

function collectAnalyticsOnStartUp(){
        var lastUpdatedAnalytics=localStorage.getItem("analyticsSendingTime");
        if(lastUpdatedAnalytics !=null) {
                var currentTime = new Date().getTime() / 1000;
                if(currentTime-lastUpdatedAnalytics >=300){
                    dbapp.retrieveForAnalyticsInFiveMinutesInterval();
                }
        }      
}

function updateApp() {
    
   isAutomaticUpdate=true;
    var appUpdatedTime = new Date().getTime() / 1000;
    localStorage.setItem("appUpdatedTime", appUpdatedTime);
    
        try{
            zonelmpData();
        }catch(error){}
    setTimeout(function () {
        try{
            zoneTrendUpdate();
        }catch(error){ }
        try{
            tieflowsAndDemandUpdate();
        }catch(error){ }
        isAutomaticUpdate=false;
    }, 800);
}

function statusBarChanges() {
    StatusBar.overlaysWebView(false);
    if(device.platform == 'android' || device.platform == 'Android'){
        StatusBar.backgroundColorByHexString('#000');
    }else{
        StatusBar.backgroundColorByHexString('#f4f4f4');
    }
    StatusBar.styleDefault();
}

function updateBadgeOnInit(){
     setTimeout(()=>{
        var epBadge = localStorage.getItem("EPBadge");
        badgeService.updateBadgeOnAlertsIcon(epBadge); 
     },200);
     setTimeout(()=>{
        if(openedThrough3dTouch == false){
            appService.enableZoneLMPIconByDefault();
        }else{
            $('div.km-footer div.km-widget.km-tabstrip a.km-state-active').removeClass("km-state-active");
            appService.enabledLatestAlertsIcon();
            runningPageChange(10);
            cordova.plugins.notification.badge.get(function (count) {
                var epBadge1 = localStorage.getItem("EPBadge");
                if(count != epBadge1){
                    servicesModel.getUpdateDataFiveMinutesInterval("ep");
                }
            });
           
        }
        
     },150);
}

function screenOpenOnInit(){
            var isaccepted = localStorage.getItem("isAccepted");
            var isDeviceRegisteredToCheck = localStorage.getItem("isDeviceRegisteredVal");
            var url = '';
            if ((typeof isaccepted === 'undefined' || isaccepted === null) || (jQuery.isEmptyObject(isDeviceRegisteredToCheck) && isDeviceRegisteredFlagChecked == true)) {
                url = 'components/LegalDisclaimer.html';
            } else {
                        if (isaccepted == 'accepted' 
                            && (isDeviceRegisteredToCheck == 'registered' || (isDeviceRegisteredFlagChecked == false && jQuery.isEmptyObject(isDeviceRegisteredToCheck)) )  ) {
                           
                            if(jQuery.isEmptyObject(isDeviceRegisteredToCheck) && isDeviceRegisteredFlagChecked == false){
                                isDeviceRegisteredFlagChecked = true;
                                if(jQuery.isEmptyObject(localStorage.getItem("deviceuuId"))==false
                                    &&jQuery.isEmptyObject(localStorage.getItem("tokenValue"))==false
                                    &&jQuery.isEmptyObject(localStorage.getItem("deviceName"))==false
                                    &&jQuery.isEmptyObject(localStorage.getItem("appversion"))==false){
                                        localStorage.setItem("isDeviceRegisteredVal", "registered");
                                        if(openedThrough3dTouch == true){
                                             url = 'components/more/alerts/latestAlerts/latestAlerts.html';
                                        }else{
                                             url = 'components/zoneLMPMap/zoneLMPMap.html';
                                        }
                                }else{
                                    url = 'components/LegalDisclaimer.html';
                                }
                            }else if(isDeviceRegisteredToCheck == 'registered'){
                                if(openedThrough3dTouch == true){
                                    url = 'components/more/alerts/latestAlerts/latestAlerts.html';
                                }else{
                                    url = 'components/zoneLMPMap/zoneLMPMap.html';
                                }
                            }
                            updateBadgeOnInit();    
                        } else {
                            url = 'components/LegalDisclaimer.html';
                        }
              }
              kendo.UserEvents.defaultThreshold(20);

              app = new kendo.mobile.Application(document.body, {
                 platform: {
                     name: "ios",
                     majorVersion: 9
                 },
                 initial: url
              });
}

function splashScreenEvent() {
    setTimeout(function () {
              screenOpenOnInit();
    },50);
}

/*
   Update the page timing detals to db
   
*/
function UpdatePagedetails(runningPage, seconds) {
    dbapp.updateTableForAnalytics(runningPage, seconds);
}

setTimeout(function () {
    try {
        if (statusNotification) {
            UpdatePagedetails(21, 1);
            statusNotification = false;
        }
    } catch (error) {}
}, 6000);

function isOnline() {
    return navigator.connection.type != Connection.NONE;
}
