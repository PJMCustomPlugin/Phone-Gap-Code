var alertDetailIndex = -1;
console.log("alertsService.js-");
var alertsService = {

    getAlertDetailData : function () {
        var messageId = localStorage.getItem('messageId');
        var resultdata = {};
        var tempEmergencyProcedureData = dbapp.emergencyProcedureData;
        if(jQuery.isEmptyObject(tempEmergencyProcedureData.deviceEPDataList) == false){
            for (var index = 0; index < tempEmergencyProcedureData.deviceEPDataList.length; index++) {
                var tempAlertData = tempEmergencyProcedureData.deviceEPDataList[index];

                if (tempAlertData.emergencyMessage.messageId == messageId) {
                    alertDetailIndex = index;
                    resultdata = tempAlertData;
                    break;
                }
            }
        }
        if(jQuery.isEmptyObject(tempEmergencyProcedureData.deviceSpecialMessageDataList) == false){
            for (var index = 0; index < tempEmergencyProcedureData.deviceSpecialMessageDataList.length; index++) {
                var tempAlertData = tempEmergencyProcedureData.deviceSpecialMessageDataList[index];

                if (tempAlertData.messageVO.messageId == messageId) {
                    alertDetailIndex = index;
                    resultdata = tempAlertData;
                    break;
                }
            }
        }
        alertData = resultdata;
        alertsService.checkAndNavigateToAlertDetail(alertData);
    },

    checkAndNavigateToAlertDetail : function (alertData) {
        if(!jQuery.isEmptyObject(alertData)){
            setTimeout(function () {
                if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                    var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                    if (screenOrientation == 90) {
                        localStorage.setItem('isNavigated', true);
                         alertsService.activateMoreScreen();
                        if (getPageName(runningPage) == 'ZoneLMP' || getPageName(runningPage) == 'Demand' 
                                || getPageName(runningPage) == 'TieFlows') {
                            //TODO check other pages even        
                            navigationService.navigateTo("more");
                        } else {
                            loadMoreScreen();
                        }
                    } else {
                        alertsService.navigateToAlertDetailPageAndDisplay();
                    }
                } else {
                    alertsService.navigateToAlertDetailPageAndDisplay();
                }
            }, 400);
        }
    },
    navigateToAlertDetailPageAndDisplay : function (){
                        if ("alertDetailScreen" == getPageName(runningPage)) {
                            showAlertDetail();
                        } else {
                            appService.checkAndClosePopupIfAny();
                            navigationService.navigateTo("alertDetail");
                        }
                        alertsService.activateMoreScreen();
    },
    activateMoreScreen : function () {
        setTimeout(function () {
                $('div.km-footer div.km-widget.km-tabstrip a.km-state-active').removeClass("km-state-active");
                $('div.km-footer div.km-widget.km-tabstrip a:nth-child(5)').addClass("km-state-active");
                $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-text').css("color","#7A848D"); 
        }, 300);
    },
    displayAlertsStatus : function () {
        try{
            
            var isZoneLMPNotificationEnabled = localStorage.getItem("ZoneLMPNotificationStatus");
            var isEPNotificationsEnabled = localStorage.getItem("EPNotificationStatus");

            if (jQuery.isEmptyObject(isZoneLMPNotificationEnabled)) {
                var zoneLMPActiveAlertsSetCount = 0;
                try{
                    if(!jQuery.isEmptyObject(localStorage.getItem("notificationDetails"))){
                        jQuery.each(JSON.parse(localStorage.getItem("notificationDetails")), function () {
                            if (this.allowNotifications == 'On') {
                                zoneLMPActiveAlertsSetCount++;
                            }
                        });
                    }
                }catch(e){
                    alert("*****Exception***** : "+e);
                }
                
                localStorage.setItem("zoneLMPActiveAlertsSetCount", zoneLMPActiveAlertsSetCount);
                if (zoneLMPActiveAlertsSetCount > 0) {
                    localStorage.setItem("ZoneLMPNotificationStatus", "On");
                } else {
                    localStorage.setItem("ZoneLMPNotificationStatus", "Off");
                }
                isZoneLMPNotificationEnabled = localStorage.getItem("ZoneLMPNotificationStatus");
            }
            if (isZoneLMPNotificationEnabled == 'Off') {
                $('#zoneLMPAlertsStatus').html("Off");
                $('#zoneLMPAlertsStatusTab').html("Off");
            } else {
                $('#zoneLMPAlertsStatus').html("On");
                $('#zoneLMPAlertsStatusTab').html("On");
            }
            if (jQuery.isEmptyObject(isEPNotificationsEnabled) || isEPNotificationsEnabled == 'Off') {
                $('#epAlertsStatus').html("Off");
                $('#epAlertsStatusTab').html("Off");
            } else {
                $('#epAlertsStatus').html("On");
                $('#epAlertsStatusTab').html("On");
            }
        }catch(e){
            alert("displayAlertsStatus Exception: "+e);
        }
    },
    getDeviceLatestAlertsAndUpdate : function () {
            var deviceuuid = localStorage.getItem("deviceuuId");
            $.ajax({
                type: "POST",
                async: true,
                url: serviceIpAddress_PJM + "/pjm/rest/services/edatafeed/viewDeviceLatestAlerts",
                dataType: 'json',
                timeout: 10000,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Origin': 'file:///'
                },
                data: JSON.stringify({
                    "udid": deviceuuid,
                }),
                success: function (data) {
                    try {
                        if (!jQuery.isEmptyObject(data)) {
                            dbapp.emergencyProcedureData = data;
                            dbapp.updateDataEmergencyProcedure(data);
                            localStorage.setItem("EPBadge", data.badgeCount);
                            //badgeService.updateBadgeOnAppIcon(data.badgeCount);
                            //badgeService.updateBadgeOnAlertsIcon(data.badgeCount);
                            setTimeout(function () {
                                    alertsService.getAlertDetailData();
                            }, 200);
                        }
                    } catch (e) {}
                },
                error: function (r, s, e) {
                    navigator.notification.alert("The Internet connection appears to be offline.");
                },
                beforeSend: function (xhr, settings) { },
                complete: function (data) { }
        });
    },
    getDeviceLatestAlertsAndShowAlert : function(event, device) {
        var deviceuuid = localStorage.getItem("deviceuuId");
        $.ajax({
            type: "POST",
            async: false,
            url: serviceIpAddress_PJM + "/pjm/rest/services/edatafeed/viewDeviceLatestAlerts",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            headers: {
                'Origin': 'file:///'
            },
            data: JSON.stringify({
                "udid": deviceuuid,
            }),
            success: function (data) {
                if (!jQuery.isEmptyObject(data)) {
                    var prevTempLastUpdatedDate = dbapp.emergencyProcedureData.Emergency_Procedure_Last_Updated_Date; 
                    dbapp.emergencyProcedureData = data;
                    dbapp.dropTableEP();
                    dbapp.createTableEP(dbapp.emergencyProcedureData);
                    dbapp.retrieveEmergencyProcedure();
                    localStorage.setItem("EPBadge", data.badgeCount);
                    //badgeService.updateBadgeOnAppIcon(data.badgeCount);
                    //badgeService.updateBadgeOnAlertsIcon(data.badgeCount);
                    //TODO check  updateBadgeOnAlertsIcon and alert conditions
                    setTimeout(function () {
                        var alertText = "";
                        if (device == "ios") {
                            if (jQuery.isEmptyObject(event.issuedDateStr) && !jQuery.isEmptyObject(event.alert)) {
                                alertText = event.alert;
                            } else if(!jQuery.isEmptyObject(event.issuedDateStr) && !jQuery.isEmptyObject(event.alert)) {
                                alertText = event.alert + "\n" + event.issuedDateStr;
                            }
                            localStorage.setItem('messageId', event.messageId);
                        } else if (device == "android") {
                            if (jQuery.isEmptyObject(event.payload.issuedDateStr) && !jQuery.isEmptyObject(event.payload.message)) {
                                alertText = event.payload.message;
                            } else if(!jQuery.isEmptyObject(event.payload.issuedDateStr) && !jQuery.isEmptyObject(event.payload.message)) {
                                alertText = event.payload.message + "\n" + event.payload.issuedDateStr;
                            }
                            localStorage.setItem('messageId', event.payload.messageId);
                        }
                        if(!jQuery.isEmptyObject(alertText)){
                            navigator.notification.alert(alertText, alertDismissed, appTitle, "OK");
                        }else{
                            if ((dbapp.emergencyProcedureData == undefined 
                                 || data.Emergency_Procedure_Last_Updated_Date != prevTempLastUpdatedDate) 
                                 && !jQuery.isEmptyObject(data)){
                                  alertDismissed();
                            }
                        }
                    }, 100);
                }
            },
            error: function (r, s, e) { },
            beforeSend: function (xhr, settings) { },
            complete: function (data) { }
        });
    },
    showLatestAlertsPage : function () {
        try{
            var landScapeView = false;
            var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
            if (screenOrientation == 90) {
                landScapeView = true;
            }
            if(landScapeView == false){
                if (needToBeAlerted == false) {
                        alertsService.navigateToLatestAlertsPage();
                }
            }else{
                try {
                    if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
                        alertsService.navigateToLatestAlertsPage();
                    } else {
                        window.screen.unlockOrientation();
                        try {
                            navigationService.navigateToPageInDirection("more","right");
                            if(defaultMorePrevPageInPortrait == 0){
                                defaultMorePrevPageInPortrait = 10;
                            }
                            if(moreScreenLoaded == true){
                                loadMoreScreen();    
                            }
                            $('.km-leftitem').css('margin-left', '32%');
                        } catch (error) { }
                    }
                } catch (error) { }
            }
            //alertsService.checkBadgeAndShow();
            setTimeout(function () {
                        if($('div.km-footer div.km-widget.km-tabstrip a:nth-child(1).km-state-active span.km-icon').attr("class").split(' ').indexOf("km-readAlerts") == -1){
                            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1).km-state-active').removeClass("km-state-active");
                        }
                        $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-text').css("color","#2984B3"); 
                    }, 50);
                    previousPage = 10;
        }catch(e){
        }
    },
    showAlertsPage :function (){
            var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
            if (screenOrientation == 90) {
                    try {
                        if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
                            runningPageChange(10);
                            window.screen.lockOrientation('portrait');
                            app.navigate("components/more/alerts/latestAlerts/alerts.html", "slide:left");
                            $('.km-leftitem').css('margin-left', '0%');
                            setTimeout(function () {
                                if($('div.km-footer div.km-widget.km-tabstrip a:nth-child(1).km-state-active span.km-icon').attr("class").split(' ').indexOf("km-readAlerts") == -1){
                                    $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1).km-state-active').removeClass("km-state-active");
                                }
                                $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-text').css("color","#2984B3"); 
                            }, 50);
                        } else {
                            window.screen.unlockOrientation();
                            try {
                                if(getPageName(runningPage) == "OperationalReservesScreen" || getPageName(runningPage) == "DispatchedReservesScreen" ){
                                     navigationService.navigateToPageInDirection("more","right");
                                }else{
                                     navigationService.navigateTo("more");
                                }
                                if(defaultMorePrevPageInPortrait == 0){
                                    defaultMorePrevPageInPortrait = 10;
                                }
                                if(moreScreenLoaded == true){
                                    loadMoreScreen();    
                                }
                                $('.km-leftitem').css('margin-left', '32%');
                            } catch (error) {
                            }
                        }
                    } catch (error) { }
        }
    },
    navigateToLatestAlertsPage : function (){
                    runningPageChange(10);
                    window.screen.lockOrientation('portrait');
                    app.navigate("components/more/alerts/latestAlerts/latestAlerts.html", "slide:right");
                    $('.km-leftitem').css('margin-left', '0%');
                    setTimeout(function () {
                        appService.enabledLatestAlertsIcon();
                    }, 50);
    },
    checkBadgeAndShow : function (){
           var epBadge = Number (localStorage.getItem("EPBadge"));
           var landscapeView = false;
           if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                    if (($(window).width() > $(window).height()) ? 90 : 0 == 90) {
                        landscapeView = true;
                        if(epBadge>0){
                            $('#badgeCountTabDivId').show();
                            $('#badgeIdTab').text(localStorage.getItem("EPBadge"));
                        }else{
                            $('#badgeCountTabDivId').hide();
                        }
                    }
            }
            if(landscapeView == false){
                    if(epBadge>0){
                        $('#badgeCountDivId').show();
                        $('#badgeId span').text(epBadge);
                    }else{
                        $('#badgeCountDivId').hide();
                    }
            }
            badgeService.updateBadgeOnAlertsIcon(epBadge);    
    }, 
    getEPDataOnResume : function (){
   
        var deviceuuid = localStorage.getItem("deviceuuId");
        $.ajax({
                    type: "POST",
                    async: false,
                    url: serviceIpAddress_PJM+"/pjm/rest/services/edatafeed/viewDeviceLatestAlerts",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Origin': 'file:///'
                    },
                    data: JSON.stringify({
                        "udid": deviceuuid,
                    }),
                    success: function (data) {
                        if(jQuery.isEmptyObject(dbapp.emergencyProcedureData)  && !jQuery.isEmptyObject(data)){
                            dbapp.emergencyProcedureData = data; 
                            dbapp.dropTableEP();
                            dbapp.createTableEP(data);
                        }else if (data.Emergency_Procedure_Last_Updated_Date != dbapp.emergencyProcedureData.Emergency_Procedure_Last_Updated_Date 
                                && !jQuery.isEmptyObject(data)){
                            dbapp.emergencyProcedureData = data;
                            try{
                                window.plugins.spinnerDialog.show();
                            }catch(e){}
                            servicesModel.updatingEPData(data);
                            //                            dbapp.updateDataEmergencyProcedure(data);
                        }
                    },
                    error: function (r, s, e) {},
                    beforeSend: function (xhr, settings) {},
                    complete: function (data) {}
        });
    },
    getBadgeCountAndEP : function(){
        var deviceuuid = localStorage.getItem("deviceuuId");
        var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getBadgeCount';
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
                "udid": deviceuuid
            }),
            success: function (data) {
                badgeService.updateBadgeOnAppIcon(Number(data.badgeCount));
                if(Number(data.badgeCount) != Number(localStorage.getItem("EPBadge"))){
                    localStorage.setItem("EPBadge",data.badgeCount);
                    alertsService.getEPDataOnResume();
                    if(runningPage == 9){
                        setTimeout(function(){
                            alertsService.checkBadgeAndShow();
                        },50);    
                    }else if(runningPage == 10){
                        setTimeout(function(){
                            try{
                                var landScapeMode = ($(window).width() > $(window).height()) ? true : false;
                                if(landScapeMode){
                                    loadViewLatestAlertsTab(dbapp.emergencyProcedureData);
                                }else{
                                    loadViewLatestAlerts(dbapp.emergencyProcedureData);  
                                }
                            }catch(e){ }
                        },200);
                    }
                }
            },
            error: function (r, s, e) {},
            beforeSend: function () {},
            complete: function (data) {}
        });
    }
    
}

function alertDismissed() {
    var epBadge = Number(localStorage.getItem("EPBadge"));
    badgeService.updateBadgeOnAppIcon(epBadge);
    badgeService.updateBadgeOnAlertsIcon(epBadge);
    if (device.platform == 'Android' || device.platform == 'android') {
        $('.badgeCountText').css('padding-top', '2px');
    }
    if (getPageName(runningPage) == "ViewLatestAlerts") {
        try {
            var landScapeMode = ($(window).width() > $(window).height()) ? true : false;
            if (landScapeMode) {
                loadViewLatestAlertsTab(dbapp.emergencyProcedureData);
            } else {
                loadViewLatestAlerts(dbapp.emergencyProcedureData);
            }
        } catch (e) { }
    }
    if (getPageName(runningPage) == "NotificationSettingsScreen") {
            if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                if (screenOrientation == 90) {
                     setTimeout(function(){
                        updateBadgeInLandScapeMode();
                    },50);
                } else {
                    setTimeout(function(){
                        updateBadgeInPortraitMode("tablate");
                    },50);
                }
            } else {
                setTimeout(function(){
                    updateBadgeInPortraitMode("phone");
                },50);
                
            }
    }
}
function updateBadgeInPortraitMode(type){
    try{
        var epBadge = Number(localStorage.getItem("EPBadge"));
        if (epBadge > 0) {
                    $('#badgeCountDivId').show();
                    $('#badgeId span').text(epBadge);
                    if (epBadge > 9) {
                        if(type == "phone"){
                            $('#latestAlertsTextDiv').css('width', '78%');
                        }else if(type == "tablate"){
                            $('#latestAlertsTextDiv').css('width', '85%');
                        }
                        $('#badgeCountDivId').css('width', '32px');
                    } else {
                        if(type == "phone"){
                            $('#latestAlertsTextDiv').css('width', '80%');
                        }else if(type == "tablate"){
                            $('#latestAlertsTextDiv').css('width', '86.5%');
                        }
                        $('#badgeCountDivId').css('width', '24px');
                    }
        }else{
            $('#badgeCountDivId').hide();
        }
    }catch(e){
    }
}