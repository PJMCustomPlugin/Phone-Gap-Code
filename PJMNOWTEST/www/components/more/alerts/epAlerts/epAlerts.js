function backToAlerts(){
    if(runningPage != 9){
         runningPageChange(9);
    }
    alertsService.displayAlertsStatus();
    var epBadge = localStorage.getItem("EPBadge");
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
            $('#latestAlertsTextDiv').css('width','87%');
    }
    if(epBadge>0){
            $('#badgeCountDivId').show();
            $('#badgeId span').text(epBadge);
            //TODO adjust badge allignment 
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
}

$("#areasDivId").click(function() {
   app.navigate("components/more/alerts/epAlerts/epAreas/epAreas.html");
});

$("#typesDivId").click(function(){
    app.navigate('components/more/alerts/epAlerts/epTypes/epTypes.html'); 
});

function updateTypeSelectedText(text){
        $('#typeSelectedDiv').show();
        $('#typesCountDivId').hide();
        $('#typeSelectedText').text(text);
}

function EPAlertsInitMethod() {
    runningPageChange(16);
    try{
        var switchInstance = $("#epSwitch").data("kendoMobileSwitch");
        var includeDrillsSwitchInstance = $("#includeDrillsSwitch").data("kendoMobileSwitch");
        var isEPNotificationsEnabled = localStorage.getItem("EPNotificationStatus");
        var isIncludeDrillsEnabled = localStorage.getItem("IncludeDrillsEnabledStatus");
        if (isEPNotificationsEnabled == "Off" || isEPNotificationsEnabled == null){
            switchInstance.check(false);
            $('#optionsDiv').hide();
            $('#includeDrillsDiv').hide();
        }else if(isEPNotificationsEnabled == "On"){
            switchInstance.check(true);
            $('#optionsDiv').show();
            $('#includeDrillsDiv').show();
        }
        if(isIncludeDrillsEnabled == "Off"){
            includeDrillsSwitchInstance.check(false);
        }else if(isIncludeDrillsEnabled == "On"){
            includeDrillsSwitchInstance.check(true);
        }
        var areaSelected = localStorage.getItem("AreaSelected");
        if(areaSelected == null || areaSelected == undefined || areaSelected == 'region'){
               $('#areaSelectedText').text("By Region/Zone");
        }else if(areaSelected == "state"){
               $('#areaSelectedText').text("By State");
        }
        var pahTypesOnlyEnabledFlag = localStorage.getItem("PAHTypesOnlyEnabledFlag");
        if(pahTypesOnlyEnabledFlag == 'true'){  
            updateTypeSelectedText("PAH Types Only");
        } 
        else{
            if(pahTypesOnlyEnabledFlag == null || pahTypesOnlyEnabledFlag == undefined ){
                updateTypeSelectedText("All");
            }else if(pahTypesOnlyEnabledFlag == 'false'){
                var typesSelectedCount = localStorage.getItem("TypesSelectedCount");
                if(typesSelectedCount != null && typesSelectedCount != undefined){
                    var typesSelectedCount = Number(typesSelectedCount);
                    if(typesSelectedCount > 0){
                        updateTypeSelectedText(typesSelectedCount);
                    }else{
                        updateTypeSelectedText("All");
                    }
                }else{
                     updateTypeSelectedText("All");
                }
            }
        }
        if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
           $('#typeSelectedDiv').css('padding-right','3%');
        }
    }catch(e){}
}

function updateIncludeDrillsChangeFirstTime(){
    var includeDrillsEnabled = true;
    var deviceuuid = localStorage.getItem("deviceuuId");
    var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceIncludeDrillsFlag';
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
            "udid": deviceuuid ,
            "includeDrillsEnabled": includeDrillsEnabled
        }),
        success: function (data) {
            if(data.success){
                  if (includeDrillsEnabled) {
                     localStorage.setItem("IncludeDrillsEnabledStatus", 'On');
                  } else {
                     localStorage.setItem("IncludeDrillsEnabledStatus", 'Off');
                  }
            }
            else if(data.success == false){
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                // includeDrillsEnabled = (!includeDrillsEnabled);
                // var switchInstance = $("#includeDrillsSwitch").data("kendoMobileSwitch");
                // switchInstance.check(includeDrillsEnabled);
                EPAlertsInitMethod();
            }
            window.plugins.spinnerDialog.hide();
        },
        error: function (r, s, e) {
            EPAlertsInitMethod();
            if (!isOnline()) {
                navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
            } else if (s === 'timeout') {
                window.plugins.spinnerDialog.hide();
                navigator.notification.alert(networkTimeoutMessage, null, "PJM Now", "OK");
            } else {
                window.plugins.spinnerDialog.hide();
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
            }
            window.plugins.spinnerDialog.hide();
        },
        beforeSend: function () {},
        complete: function (data) {}
    });
    window.plugins.spinnerDialog.hide();
}

function onIncludeDrillsChange(e){
    var portrait = false;
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
        if (screenOrientation == 90) {
            portrait = true;
        }
    } else {
        portrait = false;
    }
    var switchInstance = null;
    if(portrait==false){
       switchInstance = $("#includeDrillsSwitch").data("kendoMobileSwitch");
    }else{
       switchInstance = $("#includeDrillsSwitchTab").data("kendoMobileSwitch");
    }
    try {
        window.plugins.spinnerDialog.show();
    } catch (error) {}
    var includeDrillsEnabled = false;
    if (e.checked) {
        includeDrillsEnabled = true;
    } else {
        includeDrillsEnabled = false;
    }
    
    var deviceuuid = localStorage.getItem("deviceuuId");
    var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceIncludeDrillsFlag';
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
            "udid": deviceuuid ,
            "includeDrillsEnabled": includeDrillsEnabled
        }),
        success: function (data) {
            if(data.success){
                  if (includeDrillsEnabled) {
                     localStorage.setItem("IncludeDrillsEnabledStatus", 'On');
                  } else {
                    localStorage.setItem("IncludeDrillsEnabledStatus", 'Off');
                  }
            }
            else if(data.success == false){
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                includeDrillsEnabled = (!includeDrillsEnabled);
                switchInstance.check(includeDrillsEnabled);
                EPAlertsInitMethod();
            }
            window.plugins.spinnerDialog.hide();
        },
        error: function (r, s, e) {
            includeDrillsEnabled = (!includeDrillsEnabled);
            switchInstance.check(includeDrillsEnabled);
            EPAlertsInitMethod();
            if (!isOnline()) {
                navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
            } else if (s === 'timeout') {
                window.plugins.spinnerDialog.hide();
                navigator.notification.alert(networkTimeoutMessage, null, "PJM Now", "OK");
            } else {
                window.plugins.spinnerDialog.hide();
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
            }
            window.plugins.spinnerDialog.hide();
        },
        beforeSend: function () {},
        complete: function (data) {}
    });
    window.plugins.spinnerDialog.hide();
}

function onEPAlertsChange(e) {
    try {
        window.plugins.spinnerDialog.show();
    } catch (error) {}
    var epAlertsEnabled = false;
    if (e.checked) {
        epAlertsEnabled = true;
    } else {
        epAlertsEnabled = false;
    }
   
    var deviceuuid = localStorage.getItem("deviceuuId");
    var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceEPNotificationFlag';
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
            "epNotificationEnabled": epAlertsEnabled
        }),
        success: function (data) {
            
            if(data.success){
                if (epAlertsEnabled) {
                        localStorage.setItem("EPNotificationStatus", 'On');
                        $('#epAlertsStatus').html("On");
                        $('#optionsDiv').show();
                        $('#includeDrillsDiv').show();
                        var isIncludeDrillsEnabled = localStorage.getItem("IncludeDrillsEnabledStatus");
                        if(isIncludeDrillsEnabled == null){
                            updateIncludeDrillsChangeFirstTime();
                            var includeDrillsSwitchInstance = $("#includeDrillsSwitch").data("kendoMobileSwitch");
                            includeDrillsSwitchInstance.check(true);
                        }
                } else {
                        localStorage.setItem("EPNotificationStatus", 'Off');
                        $('#epAlertsStatus').html("Off");
                        $('#optionsDiv').hide();
                        $('#includeDrillsDiv').hide();
                }
            }
            else if(data.success == false){
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                EPAlertsInitMethod();
            }
            window.plugins.spinnerDialog.hide();
        },
        error: function (r, s, e) {
            EPAlertsInitMethod();
            if (!isOnline()) {
                navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
            } else if (s === 'timeout') {
                window.plugins.spinnerDialog.hide();
                navigator.notification.alert(networkTimeoutMessage, null, "PJM Now", "OK");
            } else {
                window.plugins.spinnerDialog.hide();
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
            }
            window.plugins.spinnerDialog.hide();
        },
        beforeSend: function () {},
        complete: function (data) {}
    });
}