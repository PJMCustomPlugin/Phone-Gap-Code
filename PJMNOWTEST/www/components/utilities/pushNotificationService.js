var apnsMaxRetry = 0;
console.log("pushNotificationService.js-----------");
var pushNotificationService = {
    registerForPushNotifications : function() {
        try {
            var pushNotification = window.plugins.pushNotification;
            if (device.platform == "iOS") {
                pushNotification.register(pushNotificationService.apnsSuccessfulRegistration, pushNotificationService.apnsFailedRegistration, {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true",
                    "ecb": "oniOSNotification"
                });
            } else if (device.platform == 'android' || device.platform == 'Android') {
                pushNotification.register(
                    pushNotificationService.gcmSuccessfulRegistration,
                    pushNotificationService.gcmFailedRegistration, {
                        "senderID": "913356377129", //Google Developer Account ID present for enterprise app - Rajesh account
                        //"senderID": "1083964992510",  //Google Developer Account ID present for app store - droid.ggktech@gmail.com
                        "ecb": "onAndroidNotification"
                    });
            }
        } catch (err) { }
    },

    registerOrUpdateDevice : function (token) {
        var isAlreadyGetToken = localStorage.getItem("tokenValue");
        if (jQuery.isEmptyObject(isAlreadyGetToken)) {
            deviceModel.doRegisterDevice(token);
        } else {
            if (isAlreadyGetToken != token) {
                deviceModel.updateDeviceToken(token);
            }
        }
    },

    apnsSuccessfulRegistration : function (token) {
        if(jQuery.isEmptyObject(token)){
            pushNotificationService.registerForPushNotifications();
        }
        try{
            pushNotificationService.registerOrUpdateDevice(token);
        }catch(e){}
     },

    apnsFailedRegistration : function (error){
            apnsMaxRetry = Number(localStorage.getItem("apnsMaxRetry"));
            localStorage.setItem("apnsMaxRetry", apnsMaxRetry++);
            if (apnsMaxRetry <= 5) {
                pushNotificationService.registerForPushNotifications();
            }
    },

    gcmSuccessfulRegistration : function (token) {
            pushNotificationService.registerOrUpdateDevice(token);
    },

    gcmFailedRegistration : function (error) {
    },
}

function oniOSNotification(event){
    try{
        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }
        if (event.badge && event.foreground == 0) {
            try {
                localStorage.setItem('messageId', event.messageId);
                localStorage.setItem('NotificationHasComeNow', true);
                appService.checkAndClosePopupIfAny();
                alertsService.getDeviceLatestAlertsAndUpdate();
            } catch (e) { }
        }else if (event.zoneName && event.foreground == 0) {
            try {
                localStorage.setItem('zoneToBeDisplayedOnNotification',event.zoneName);
                localStorage.setItem('NotificationHasComeNow', true);
                setTimeout(function(){
                    appService.checkAndClosePopupIfAny();
                    ZoneMapModule.getAndDisplayZoneTrend();
                },1000);
            } catch (e) {}
        }
        if (event.foreground == 0) {
            isAlertsClicked = false;
            statusNotification = true;
        }
        if (event.foreground == 1 && event.badge) {
            try {
                localStorage.setItem('NotificationHasComeNow', true);
                alertsService.getDeviceLatestAlertsAndShowAlert(event, "ios");
            } catch (e) { }
        } else if (event.foreground == 1 && event.zoneName != null) {
            setTimeout(function () {
                navigator.notification.alert(event.alert, null, appTitle, "OK");
            }, 100);
        }
    }catch(e){
    }
}


function onAndroidNotification(event) {
    switch (event.event) {
        case 'registered':
            if (event.regid.length > 0) { }
            break;

        case 'message':
             isAlertsClicked = false;
            if (event.soundname || event.payload.sound) {
                var soundfile = event.soundname || event.payload.sound;
                var my_media = new Media("/android_asset/www/" + soundfile);
                my_media.play();
            }
            if (event.foreground == true) {
                if (event.payload.messageId != null && Number(event.payload.badge) >= 0) {
                    try {
                        localStorage.setItem('NotificationHasComeNow', true);
                        alertsService.getDeviceLatestAlertsAndShowAlert(event, "android");
                    } catch (e) { }
                } else if(event.payload.message != null  && event.payload.zoneName != null) {
                    setTimeout(function () {
                        navigator.notification.alert(event.payload.message, null, appTitle, "OK");
                    }, 100);
                }
            } else if (event.foreground == false) {
                if (event.payload.messageId != null && Number(event.payload.badge) >= 0) {
                    localStorage.setItem('messageId', event.payload.messageId);
                    localStorage.setItem('NotificationHasComeNow', true);
                    appService.checkAndClosePopupIfAny();
                    alertsService.getDeviceLatestAlertsAndUpdate();
                }else if (event.payload.messageId == null && event.payload.zoneName != null) {
                    localStorage.setItem('zoneToBeDisplayedOnNotification',event.payload.zoneName);
                    localStorage.setItem('NotificationHasComeNow', true);
                    setTimeout(function(){
                            appService.checkAndClosePopupIfAny();
                            zoneLMP.getAndDisplayZoneTrend();
                    },1000);    
                }  
                else {
                    if (event.coldstart) {
                        statusNotification = true;
                    }
                }
            }
            break;
        case 'error':
            break;
        default:
            break;
    }
}