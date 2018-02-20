$('.afterClass_phone').css('margin-right', '3%');
$('.afterClass_phone').css('padding-top', '11px');
if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
    $('#alertSwitchDiv').css('padding-top', '4.3px');
} else {
    $('#alertSwitchDiv').css('padding-top', '5.3px');
}
function alertsInit(){
        setTimeout(()=>{
         runningPageChange(9);
            var epBadge = localStorage.getItem("EPBadge");
            if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                $('#latestAlertsTextDiv').css('width','87%');
            }
            if(device.platform == 'Android' || device.platform == 'android'){
                $('#badgeId').css('padding-top','2.3px'); 
                $('#badgeId').css('padding-left','2.4px'); 
            }
            if(epBadge>0){
                $('#badgeCountDivId').show();
                $('#badgeId span').text(epBadge);
                if(epBadge > 9){
                    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                        $('#latestAlertsTextDiv').css('width','85%');
                        $('#badgeCountDivId').css('width','32px');
                    }else{
                        $('#latestAlertsTextDiv').css('width','78%');
                        $('#badgeCountDivId').css('width','32px');
                    }
                }else{
                    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                            $('#latestAlertsTextDiv').css('width','86.5%');
                            $('#badgeCountDivId').css('width','24px');
                    }else{
                            $('#latestAlertsTextDiv').css('width','80%');
                            $('#badgeCountDivId').css('width','24px');
                    }
                }
            } 
    },100);
}
function loadAlertsScreen() {
    setTimeout(function () {
        var switchInstance = $("#alertSwitch").data("kendoMobileSwitch");
        var isNotificationsEnabled = localStorage.getItem("NotificationStatus");
        if (typeof isNotificationsEnabled === 'undefined' || isNotificationsEnabled === null) {
            switchInstance.check(false);
            $('#settingsDiv').hide();
            $('#notificationEnabledStatus').html("Off");
            $('#notificationEnabledStatus_tab').html('Off');
        } else {
            if (isNotificationsEnabled == "On") {
                var epBadge = localStorage.getItem("EPBadge");
                switchInstance.check(true);
                $('#viewLatestAlertsDiv').show();
                if(epBadge>0){
                    setTimeout(function(){
                        $('#badgeCountDivId').show();
                        $('#badgeId span').text(epBadge);
                    },50);
                    if(epBadge > 9){
                        if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                            $('#latestAlertsTextDiv').css('width','85%');
                            $('#badgeCountDivId').css('width','32px');
                        }else{
                            $('#latestAlertsTextDiv').css('width','78%');
                            $('#badgeCountDivId').css('width','32px');
                        }
                    }else{
                        if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                             $('#latestAlertsTextDiv').css('width','86.5%');
                             $('#badgeCountDivId').css('width','24px');
                        }else{
                             $('#latestAlertsTextDiv').css('width','80%');
                             $('#badgeCountDivId').css('width','24px');
                        }
                    }
                }
                $('#settingsDiv').show();
                $('#notificationEnabledStatus').html(isNotificationsEnabled);
                $('#notificationEnabledStatus_tab').html(isNotificationsEnabled);
                try{
                     alertsService.displayAlertsStatus();
                }catch(e){}
                if(device.platform == 'Android' || device.platform == 'android'){
                    $('.badgeCountText').css('padding-top','2px'); 
                }
            } else {
                switchInstance.check(false);
                // $('#viewLatestAlertsDiv').hide();
                $('#settingsDiv').hide();
                $('#notificationEnabledStatus').html(isNotificationsEnabled);
                $('#notificationEnabledStatus_tab').html(isNotificationsEnabled);
            }
        }
    }, 100);
}
function resetBadgeCount(){
    lockToPortraitMode();
    $('.km-leftitem').css('margin-left', '0%');
    var epBadge = localStorage.getItem("EPBadge");
    if(epBadge>0){
        setTimeout(function(){
            $('#badgeCountDivId').show();
            $('#badgeId span').text(epBadge);
        },50);
        badgeService.updateBadgeOnAppIcon(epBadge);
    }else if(epBadge == 0){
        $('#badgeCountDivId').hide();
        badgeService.updateBadgeOnAppIcon(0);
    }
}
loadAlertsScreen();

function viewLatestAlerts() {
    try {
        getLatestAlertsData();
    } catch (ex) {}
}

function onAlertsChange(e) {
    try {
        window.plugins.spinnerDialog.show();
    } catch (error) {}
    var notificationsEnabled = false;
    if (e.checked) {
        notificationsEnabled = true;
    } else {
        notificationsEnabled = false;
    }

    var deviceuuid = localStorage.getItem("deviceuuId");
    var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceNotificationFlag';
    $.ajax({
        type: "POST",
        async: true,
        url: notificationStatus_URL,
        dataType: 'json',
        timeout: 15000,
        contentType: "application/json; charset=utf-8",
        headers: {
            'Origin': 'file:///'
        },
        Accept: 'application/json',
        data: JSON.stringify({
            "udid": deviceuuid,
            "notificationEnabled": notificationsEnabled
        }),
        success: function (data) {
            if(data.success){
                 if (notificationsEnabled) {
                     try{
                        localStorage.setItem("NotificationStatus", 'On');
                        $('#notificationEnabledStatus').html('On');
                        $('#notificationEnabledStatus_tab').html('On');
                        $('#viewLatestAlertsDiv').show();
                        $('#settingsDiv').show();
                        if( localStorage.getItem("EPBadge")>0){
                            setTimeout(function(){
                                $('#badgeCountDivId').show();
                                $('#badgeId span').text( localStorage.getItem("EPBadge"));
                            },50);
                        }
                        alertsService.displayAlertsStatus();
                     }catch(e){}
                } else {
                    localStorage.setItem("NotificationStatus", 'Off');
                    $('#notificationEnabledStatus').html('Off');
                    $('#notificationEnabledStatus_tab').html('Off');
                    // $('#viewLatestAlertsDiv').hide();
                    $('#settingsDiv').hide();
                }
            }else{
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                 loadAlertsScreen();
            }
            try{
                window.plugins.spinnerDialog.hide();
            }catch(e){
            }
        },
        error: function (r, s, e) {
           try{
               loadAlertsScreen();
           }catch(e){}
            
            if (!isOnline()) {
                navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
            } else if (s === 'timeout') {
                navigator.notification.alert(networkTimeoutMessage, null, "PJM Now", "OK");
            } else {
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
            }
            try{
                window.plugins.spinnerDialog.hide();
            }catch(e){
            }
        },
        beforeSend: function () {},
        complete: function (data) {}
    });
}
function showUserFeedBackForm() {
    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    }
    var prevClicks = localStorage.getItem('alertsEnabledClicks');
    if (parseInt(prevClicks) == 0) {
        var alertsPopupdiv = $("#modaldialog_alerts");
        if (!alertsPopupdiv.data("kendoWindow")) {
            if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
                if (size.width > 320) {
                    alertsPopupdiv.kendoWindow({
                        width: "350px",
                        height: 'auto',
                        title: false,
                        draggable: false,
                        resizable: false,
                        modal: true,
                        scrollable: false
                    });
                } else {
                    alertsPopupdiv.kendoWindow({
                        width: "300px",
                        height: 'auto',
                        title: false,
                        draggable: false,
                        resizable: false,
                        modal: true,
                        scrollable: false
                    });
                }
            } else {
                alertsPopupdiv.kendoWindow({
                    width: "350px",
                    height: 'auto',
                    title: false,
                    draggable: false,
                    resizable: false,
                    modal: true,
                    scrollable: false
                });
            }
        } 
        var win1 = alertsPopupdiv.data("kendoWindow");
        win1.center().open();
    }
}
$(document).ready(function () {
    if (device.platform == 'android' || device.platform == 'Android') {
        $("#androidAlertsSettings").show();
    } else {
        $("#iosAlertsSettings").show();
    }
    $('#Okbtn_Alerts').click(function () {
        var alertsScreenName = "Alerts";
        if(device.platform == 'Android' || device.platform == 'android'){
                Base64.fileCreationInAndroidAndSendMail(alertsScreenName); 
        } else if(device.platform == "iOS"){
                var  encodedDeviceData = Base64.get_encoded_device_data();
                var filePath = 'base64:device_info.txt//'+ encodedDeviceData +'/...';
                Base64.sendAMail(filePath,alertsScreenName);
        }
        $(this).closest("[data-role=window]").kendoWindow("close");
    });
    $('#Laterbtn_Alerts').click(function () {
        $(this).closest("[data-role=window]").kendoWindow("close");
        localStorage.setItem('alertsEnabledClicks', 0);
    });
    $('#viewLatestAlertsDiv').show();
});
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
function navigateFromAlertsToMore() {
    isMoreClicked = true;
    isAlertsClicked = false;
    runningPageChange(6);
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        window.screen.unlockOrientation();
    }
}
function navigateFromAlertsToLatestAlerts() {
    runningPageChange(10);
}
function navigateFromAlertsToSetZoneLMP() {
    runningPageChange(11);
}
function navigateFromAlertsToEP(){}