var openedWindow = null;
var graphPopupDivGlobal = null; 
var isOperationalReservesDataReceived = null;
var isDispatchedReservesDataReceived = null;

var appService = {
        checkAndClosePopupIfAny : function () {
                if(!jQuery.isEmptyObject(graphPopupDivGlobal)){
                            graphPopupDivGlobal.close();
                }
                if(!jQuery.isEmptyObject(openedWindow)){
                            openedWindow.close();
                }
        },
        lockPortraitViewInOnlyMobile : function(){
            try {
                if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
                    window.screen.lockOrientation('portrait');
                } else {
                    window.screen.unlockOrientation();
                }
            } catch (error) { }
        },
        retrieveOfflineData : function (){
            try {
                dbapp.retrieveZone();
            } catch (error) {}
            try {
                dbapp.retrieveDemand();
            } catch (error) {}
            try {
                dbapp.retrieveTie();
            } catch (error) {}
            try{
                dbapp.retrieveZoneTrendDetails();
            }catch(error){}
            try{
                dbapp.retrieveRegionsDemand();
            }catch(error){}
            try {
                dbapp.retrieveOperationalReserves();
            } catch (error) {}
            try {
                dbapp.retrieveDispatchedReserves();
            } catch (error) {}
            try{
                dbapp.retrieveEmergencyProcedure();
            }catch(error){}
        },
        checkForUpdatesAndUpdateFlagIfNotificationIsReceived : function(accepted){
            if(accepted=="accepted") {
                        if(jQuery.isEmptyObject(localStorage.getItem('NotificationHasComeNow')) 
                                                || ( jQuery.isEmptyObject(localStorage.getItem('NotificationHasComeNow')) == false 
                                                    && JSON.parse(localStorage.getItem('NotificationHasComeNow')) == false)) {
                                                        
                        setTimeout(function(){
                            servicesModel.updateCheckForEveryOneMinute();
                            servicesModel.updateCheckForEveryTwoMinutes();
                         },500);
                        }else{
                            setTimeout(function(){
                                servicesModel.updateCheckForEveryOneMinute();
                            },500);
                                setTimeout(function(){
                                    localStorage.setItem('NotificationHasComeNow',false);
                                },4000); 
                        }
             }
       },
       getInitialZoneLMPData : function(){
                var deviceuuid = localStorage.getItem("deviceuuId");
                $.ajax({
                    type: "POST",
                    async: false,
                    url: serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllZoneLMPs',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Origin': 'file:///'
                    },
                    data: JSON.stringify({
                        "udid": deviceuuid
                    }),
                    success: function (data) {
                        dbapp.openDb();
                        dbapp.zoneData = data;
                        dbapp.createTable(dbapp.zoneData);
                        zoneTrendUpdate();
                        localStorage.setItem("isAccepted", "accepted");
                        isInitialDataAvailable = true;
                        servicesModel.getUpdateDataFiveMinutesInterval('tie');
                        servicesModel.getUpdateDataFiveMinutesInterval('allRegionsDemandGraph');

                        isOperationalReservesDataReceived = localStorage.getItem("isOperationalReservesDataReceived");
                        if(isOperationalReservesDataReceived == null || isOperationalReservesDataReceived == false){
                            operationalData();
                        }

                        isDispatchedReservesDataReceived = localStorage.getItem("isDispatchedReservesDataReceived");
                        if(isDispatchedReservesDataReceived == null || isDispatchedReservesDataReceived == false){
                            dispatchedData();
                        }
                    },
                    error: function (r, t, e) {
                        isErrorOccured = true;
                        if (t === "timeout") {
                            navigator.notification.alert('Network timeout. Please try again.', null, "PJM Now", "OK");
                        } else {
                            navigator.notification.alert('Network problem. Please try again.', null, "PJM Now", "OK");
                             
                        }
                    }
                });
               
      },
      enableZoneLMPIconByDefault : function (){
        try{
            $('div.km-footer div.km-widget.km-tabstrip a.km-state-active').removeClass("km-state-active");
            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-text').css("color","#7A848D");
            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(2)').addClass("km-state-active");
        }catch(e){}
      },      
      enabledLatestAlertsIcon: function(){
          //var classesCollection = $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1).km-state-active span.km-icon').attr("class"));
          if($('div.km-footer div.km-widget.km-tabstrip a:nth-child(1).km-state-active span.km-icon').attr("class")!= null){
              if($('div.km-footer div.km-widget.km-tabstrip a:nth-child(1).km-state-active span.km-icon').attr("class").indexOf("km-readAlerts") == -1){
                $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1).km-state-active').removeClass("km-state-active");
              }
          }
          $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-text').css("color","#2984B3"); 
      }  , 
}


function successHandler() { }

function errorHandler() { }

function errorCallback(error) { }

function ackAPNPushNotification() { }

function getPageName(pageNumber) {
    if(pageNumber == 1){
        return "ZoneLMP";
    }else if(pageNumber == 2){
        return "ZoneLMPList";
    }else if(pageNumber == 3){
        return "Demand";
    }else if(pageNumber == 4){
        return "TieFlows";
    }else if(pageNumber == 5){
        return "TieFlowsList";
    }else if(pageNumber == 6){
        return "MoreTabs";
    }else if(pageNumber == 7){
        return "LegalDesclaimer";
    }else if(pageNumber == 8){
        return "aboutPJM";
    }else if(pageNumber == 9){
        return "NotificationSettingsScreen";
    }else if(pageNumber == 10){
        return "ViewLatestAlerts";
    }else if(pageNumber == 11){
        return "ZoneLMPAlerts";
    }else if(pageNumber == 12){
        return "IndividualZoneLMPAlertsScreen";
    }else if(pageNumber == 13){
        return "SetZoneLMPScreen";
    }else if(pageNumber == 14){
        return "FeedbackScreen";
    }else if(pageNumber == 15){
        return "alertDetailScreen";
    }else if(pageNumber == 16){
        return "EPNotificationSettingsScreen";
    }else if(pageNumber == 17){
        return "EPAreasScreen";
    }else if(pageNumber == 18){
        return "EPTypesScreen";
    }else if(pageNumber == 19){
        return "OperationalReservesScreen";
    }else if(pageNumber == 20){
        return "DispatchedReservesScreen";
    }
}

/*
	Running page change in when you select the page for analytics
*/
function runningPageChange(number) {
    
    var tempPrevious = previouslyUsedPage;
    var temp = runningPage;
    previouslyUsedPage = runningPage;
    //previousPage = previouslyUsedPage;
    runningPage = number;
    
    var endingTimeOfPage = Math.floor(Date.now()/ 1000);
    var spendingTime = endingTimeOfPage - startingTimeOfPage;
    startingTimeOfPage = Math.floor(Date.now()/ 1000);
    var badge = Number(localStorage.getItem("EPBadge"));
    //alert("previous-page+++"+getPageName(previouslyUsedPage)+" spending time+++"+spendingTime+" +++current running page+++"+getPageName(runningPage));
    if((isAlertsClicked == true && isMoreClicked == false)){
        $('div.km-footer div.km-widget.km-tabstrip a:nth-child(5)').removeClass("km-state-active");
        if(isAlertsClicked == true){
            if(badge<=0){
                 $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1)').addClass("km-state-active");
            }
            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-text').css("color","#2984B3"); 
        }
    }else{
        if(badge<=0){
            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1)').removeClass("km-state-active");
        }
        $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-text').css("color","#7A848D");
        if(isMoreClicked == true){
             $('div.km-footer div.km-widget.km-tabstrip a:nth-child(5)').addClass("km-state-active");
        }
    }
    UpdatePagedetails(temp, spendingTime);
}


function zoneLMPData() {
    dbapp.openDb();
    if (isOnline()) {
         servicesModel.getServiceData("zone");
    }
}

function zoneTrendUpdate() {
    try {
        var regionData={};
        if (isOnline()) {
            //servicesModel.getRegionsZoneLMPData();
            servicesModel.getUpdateDataFiveMinutesInterval("zoneWiseAggregateLMPs");
        }
    } catch (error) {}
}

function tieflowsAndDemandUpdate() {
    // save Demand data in SQL
    try {
        demandData();
    } catch (error) {}
    // save Tie data in SQL
    try {
        tieFlowsData();
    } catch (error) {}
}

function tieFlowsData() {
    if (isOnline()) {
         servicesModel.getServiceData("tie");
    }
}

function demandData() {
    if (isOnline()) {
         servicesModel.getServiceData("allRegionsDemandGraph");
    }
}

function operationalData() {
    if (isOnline()) {
         servicesModel.getReservesData("operational");
    }
}

function dispatchedData() {
    if (isOnline()) {
         servicesModel.getReservesData("dispatched");
    }
}

function getDeviceZoneDataAndUpdate(){
    var getDeviceZoneDataServiceCall = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getDeviceZoneData';
    var deviceuuid = localStorage.getItem('deviceuuId');
    $.ajax({
        type: "POST",
        async: true,
        url: getDeviceZoneDataServiceCall,
        contentType: "application/json; charset=utf-8",
        headers: {
            'Origin': 'file:///'
        },
        data: JSON.stringify({
            "udid": deviceuuid
        }),
        success: function (data) {
            var notificationDetails = localStorage.getItem("notificationDetails");
            notificationsObj = JSON.parse(notificationDetails);
             for (var index = 0; index < notificationsObj.length; index++) {
                  var localStrgDeviceZoneData = notificationsObj[index];
                  var nameFound = false;
                  for (var index2 = 0; index2 < data.length; index2++) {
                       var deviceZoneData = data[index2];
                       if(deviceZoneData.zoneName == notificationsObj[index].zoneName){
                           nameFound = true;
                           notificationsObj[index].LMPValue = deviceZoneData.thresholdValue;
                           notificationsObj[index].lowerThresholdValue = deviceZoneData.lowerThresholdValue;
                           break;
                       }
                  }
                  if(nameFound == false){
                       notificationsObj[index].lowerThresholdValue = "None";
                       notificationsObj[index].LMPValue = "None";
                  }
            }
            localStorage.setItem("notificationDetails", JSON.stringify(notificationsObj));
        },
        error: function (r, s, e) { },
        beforeSend: function (jqXHR, settings) { },
        complete: function (data) { }
    });
}
