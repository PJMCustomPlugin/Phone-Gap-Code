var Network_Error = 0;
var Update_Error_Check = false;
var isZoneLMPFiveMinuteIntervalDataReceived = null;
var isDemandFiveMinuteIntervalDataReceived = null;
var isRegionsDemandFiveMinuteIntervalDataReceived = null;
var isOperationalReservesDataReceived = null;
var isDispatchedReservesDataReceived = null;

var servicesModel = {
    zoneData: {},
    serviceUrls: [],
    serviceUpdateURL: [],
    epServiceURLs:[],
    getServiceData: function (type) {
        servicesModel.serviceUrls['zone'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllZoneLMPs';
        servicesModel.serviceUrls['tie'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllTieFlows';
        servicesModel.serviceUrls['aggregateZones'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getZoneWiseAggregateLMPs';
        servicesModel.serviceUrls['analytics'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/addAnalyticData';
        servicesModel.serviceUrls['updateSendingCheck'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getNewestUpdatedDates';
        servicesModel.serviceUrls['allRegionsDemandGraph'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllRegionsDemandGraphPointsWithFiveMinuteInterval';
        var deviceuuid = localStorage.getItem("deviceuuId");
        $.ajax({
            type: "POST",
            async: true,
            url: servicesModel.serviceUrls[type],
            dataType: 'json',
            timeout: 10000,
            contentType: "application/json; charset=utf-8",
            headers: {
                'Origin': 'file:///'
            },
            data: JSON.stringify({
                "udid": deviceuuid
            }),
            success: function (data) {
                if (type == "zone") {
                    if (data.Zone_LMP_Last_Updated_Date != dbapp.zoneData.Zone_LMP_Last_Updated_Date && !jQuery.isEmptyObject(data)) {
                        dbapp.zoneData = data;
                        updatingZoneLMPAndZoneTrendAndZoneLists(data);
                    }
                } else if (type == "allRegionsDemandGraph") {
                    if (((localStorage.getItem("isRegionsDemandFiveMinuteIntervalDataReceived") == "true" 
                                && !jQuery.isEmptyObject(dbapp.allRegionsDemand.allRegionsDemandGraphLastUpdatedDate)
                                && data.allRegionsDemandGraphLastUpdatedDate != dbapp.allRegionsDemand.allRegionsDemandGraphLastUpdatedDate )
                            || localStorage.getItem("isRegionsDemandFiveMinuteIntervalDataReceived")==null)
                            && !jQuery.isEmptyObject(data)) {
                                    window.plugins.spinnerDialog.show();
                                    dbapp.allRegionsDemand = data;
                                    updatingRegionsDemandGraphdata(data);
                        }
                } else if (type = "tie") {
                    if (data.Tie_Flow_Last_Updated_Date != dbapp.tieData.Tie_Flow_Last_Updated_Date && !jQuery.isEmptyObject(data)) {
                        dbapp.tieData = data;
                        updatingTieData(data);
                    }
                }
                try{
                    window.plugins.spinnerDialog.hide();
                }catch(e){} 
            },
            error: function (r, t, e) {
                try {
                    if (t === 'timeout') {
                        if (type == "zone")
                            navigator.notification.alert("Zone LMP is not updated due to network timeout.", null, "PJM Now", "OK");
                        if (type == "allRegionsDemandGraph")
                            navigator.notification.alert("Demand is not updated due to network timeout.", null, "PJM Now", "OK");
                        if (type = "tie")
                            navigator.notification.alert("Tie Flows is not updated due to network timeout.", null, "PJM Now", "OK");
                    } else {
                         if (!isOnline()) {
                            navigator.notification.alert("The Internet connection appears to be offline.", null, "PJM Now", "OK");
                         }else{
                        	navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                         }
                    } 
                } catch (error) {}
            },
            beforeSend: function (xhr, settings) { }
        });
    },

    getEPUpdates : function (type,dateToUpdate) {
        servicesModel.epServiceURLs['regions'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllRegions';
        servicesModel.epServiceURLs['states']= serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllStates';
        servicesModel.epServiceURLs['messageTypes'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllEPTypes';

        var deviceuuid = localStorage.getItem("deviceuuId");
        $.ajax({
            type: "POST",
            async: true,
            url: servicesModel.epServiceURLs[type],
            dataType: 'json',
            timeout: 10000,
            contentType: "application/json; charset=utf-8",
            headers: {
                'Origin': 'file:///'
            },
            data: JSON.stringify({
                "udid": deviceuuid
            }),
            success: function (data) {
                if(!jQuery.isEmptyObject(data)){
                    var landScapeMode = false;
                    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                                        var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                                        if (screenOrientation == 90) {
                                                landScapeMode = true;
                                        }
                    }
                    if(type == "regions"){
                      localStorage.setItem("AllRegionsData", JSON.stringify(data));
                      localStorage.setItem("NEWEST_EP_ZONES_UPDATED_DATE", dateToUpdate);
                      if(runningPage == 17 && localStorage.getItem("AreaSelected")=="region"){
                        try{
                          if(landScapeMode == true){
                                populateRegionsDataTab(data);
                          }else{
                                populateRegionsData(data);
                          } 
                        }catch(error){}
                     }
                    }else if(type == "states" ){
                        localStorage.setItem("AllStatesData", JSON.stringify(data));
                        localStorage.setItem("NEWEST_EP_STATES_UPDATED_DATE", dateToUpdate);
                        if(runningPage == 17 && localStorage.getItem("AreaSelected")=="state"){
                            try{
                                if(landScapeMode == true){
                                        populateStatesDataTab(data);
                                }else{
                                        populateStatesData(data);
                                } 
                            }catch(error){}
                        }
                   }else if(type == "messageTypes"){
                        localStorage.setItem("AllEPTypesOnly", JSON.stringify(data));
                        allEPTypesOnly =  JSON.parse(localStorage.getItem("AllEPTypesOnly"));
                        updateEmergencyMessageTypesCountDetails(dateToUpdate);
                        if(runningPage == 18){
                            try{
                                var pahTypesOnlyEnabledFlagTemp = localStorage.getItem("PAHTypesOnlyEnabledFlag");
                                if(landScapeMode == true){
                                    populateEPTypesDataTab(data);
                                    displayCheckedForAllMessageTypesBasedOnPAHFlag_Tab(pahTypesOnlyEnabledFlag,null);
                                }else{
                                    populateEPTypesData(data);
                                    displayCheckedForAllMessageTypesBasedOnPAHFlag(pahTypesOnlyEnabledFlagTemp,null);
                                }
                            }catch(error){}
                        }
                   }
                }
                try{
                        window.plugins.spinnerDialog.hide();
                }catch(e){} 
            },
            error: function (r, t, e) {
                Update_Error_Check = true;
            },
            beforeSend: function (xhr, settings) { }
        });
    },

    getUpdateDataFiveMinutesInterval: function (type) {
        servicesModel.serviceUpdateURL['zone'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllZoneLMPs';
        servicesModel.serviceUpdateURL['tie'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllTieFlows';
        servicesModel.serviceUpdateURL['aggregateZones'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getZoneWiseAggregateLMPs';
        servicesModel.serviceUpdateURL['analytics'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/addAnalyticData';
        servicesModel.serviceUpdateURL['updateSendingCheck'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getNewestUpdatedDates';
        servicesModel.serviceUpdateURL['ep'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/viewDeviceLatestAlerts';
        servicesModel.serviceUpdateURL['allRegionsDemandGraph'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllRegionsDemandGraphPointsWithFiveMinuteInterval';
        servicesModel.serviceUpdateURL['zoneWiseAggregateLMPs'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getZoneWiseAggregateLMPsLatest';
        var deviceuuid = localStorage.getItem("deviceuuId");
        $.ajax({
            type: "POST",
            async: true,
            url: servicesModel.serviceUpdateURL[type],
            dataType: 'json',
            timeout: 10000,
            contentType: "application/json; charset=utf-8",
            headers: {
                'Origin': 'file:///'
            },
            data: JSON.stringify({
                "udid": deviceuuid
            }),
            success: function (data) {
                if (type == "zone") {
                    if ((data.Zone_LMP_Last_Updated_Date != dbapp.zoneData.Zone_LMP_Last_Updated_Date || localStorage.getItem("isZoneLMPFiveMinuteIntervalDataReceived")==null)
                         && !jQuery.isEmptyObject(data)) {
                        try{
                            window.plugins.spinnerDialog.show();
                        }catch(e){} 
                        dbapp.zoneData = data;
                        updatingZoneLMPAndZoneTrendAndZoneLists(data);
                    }
                } else if (type == "graph") {
                    if ((data.Demand_Graph_Last_Updated_Date != dbapp.demandData.Demand_Graph_Last_Updated_Date || localStorage.getItem("isDemandFiveMinuteIntervalDataReceived")==null )
                            && !jQuery.isEmptyObject(data)) {
                        try{
                            window.plugins.spinnerDialog.show();
                        }catch(e){} 
                        dbapp.demandData = data;
                        updatingGraphdata(data);
                    }
                } else if(type == "allRegionsDemandGraph"){
                   try{
                       if (((localStorage.getItem("isRegionsDemandFiveMinuteIntervalDataReceived") == "true" 
                                && !jQuery.isEmptyObject(dbapp.allRegionsDemand.allRegionsDemandGraphLastUpdatedDate)
                                && (data.allRegionsDemandGraphLastUpdatedDate != dbapp.allRegionsDemand.allRegionsDemandGraphLastUpdatedDate 
                                    || data.allZonesDemandGraphLastUpdatedDate != dbapp.allRegionsDemand.allZonesDemandGraphLastUpdatedDate )
                         || localStorage.getItem("isRegionsDemandFiveMinuteIntervalDataReceived")==null)
                            && !jQuery.isEmptyObject(data))){
                            try{
                                    window.plugins.spinnerDialog.show();
                            }catch(e){} 
                            dbapp.allRegionsDemand = data;
                            updatingRegionsDemandGraphdata(data);
                        }else if(data.allRegionsDemandGraphLastUpdatedDate != dbapp.allRegionsDemand.allRegionsDemandGraphLastUpdatedDate
                                || data.allZonesDemandGraphLastUpdatedDate != dbapp.allRegionsDemand.allZonesDemandGraphLastUpdatedDate){
                            dbapp.retrieveRegionsDemand();
                            setTimeout(function(){
                                if(localStorage.getItem("isRegionsDemandFiveMinuteIntervalDataReceived") == "true" 
                                    && !jQuery.isEmptyObject(dbapp.allRegionsDemand.allRegionsDemandGraphLastUpdatedDate)
                                    && ( data.allRegionsDemandGraphLastUpdatedDate != dbapp.allRegionsDemand.allRegionsDemandGraphLastUpdatedDate 
                                        || data.allZonesDemandGraphLastUpdatedDate != dbapp.allRegionsDemand.allZonesDemandGraphLastUpdatedDate)){
                                            try{
                                                    window.plugins.spinnerDialog.show();
                                            }catch(e){} 
                                            dbapp.allRegionsDemand = data;
                                            updatingRegionsDemandGraphdata(data);   
                                            window.plugins.spinnerDialog.hide(); 
                                }
                            },200);
                        }
                   }catch(e){ }
                } else if (type == "tie") {
                    if (data.Tie_Flow_Last_Updated_Date != dbapp.tieData.Tie_Flow_Last_Updated_Date && !jQuery.isEmptyObject(data)) {
                        try{window.plugins.spinnerDialog.show();}catch(e){}
                        dbapp.tieData = data;
                            updatingTieData(data);
                    }
                } else if (type == "ep") {
                    if (
                        (dbapp.emergencyProcedureData == undefined 
                         || data.Emergency_Procedure_Last_Updated_Date != dbapp.emergencyProcedureData.Emergency_Procedure_Last_Updated_Date) 
                        && !jQuery.isEmptyObject(data)) {
                        try{
                             window.plugins.spinnerDialog.show();
                        }catch(e){
                        }
                        dbapp.emergencyProcedureData = data;
                        setTimeout(function(){
                            updatingEPData(data);
                         },200);
                    }
                } else if (type =="zoneWiseAggregateLMPs"){
                    var zoneName = localStorage.getItem("zoneToBeDisplayedOnNotification");
                    dbapp.zoneTrendData = data;
                    dbapp.dropZoneTrendDetails();
                    dbapp.createzoneTrendDetails(dbapp.zoneTrendData);
                    localStorage.setItem("isZoneLMPFiveMinuteIntervalDataReceived",true);
                    if(!jQuery.isEmptyObject(zoneName) && zoneName!="null"){
                        ZoneMapModule.displayZoneTrend(zoneName);
                        setTimeout(function(){
                            localStorage.setItem("zoneToBeDisplayedOnNotification","null");
                        },50);
                    }
                }
                try{
                    window.plugins.spinnerDialog.hide();
                }catch(e){}
            },
            error: function (r, t, e) {
                Update_Error_Check = true;
            },
            beforeSend: function (xhr, settings) { }
        });
    },

    checkIftheStartUpFiveMinuteIntervalDataIsReceived : function(){
       isZoneLMPFiveMinuteIntervalDataReceived = localStorage.getItem("isZoneLMPFiveMinuteIntervalDataReceived");
       if(isZoneLMPFiveMinuteIntervalDataReceived == null || isZoneLMPFiveMinuteIntervalDataReceived == false){
           servicesModel.getUpdateDataFiveMinutesInterval("zone");
       }
       
       isRegionsDemandFiveMinuteIntervalDataReceived = localStorage.getItem("isRegionsDemandFiveMinuteIntervalDataReceived");
       if(isRegionsDemandFiveMinuteIntervalDataReceived == null || isRegionsDemandFiveMinuteIntervalDataReceived == false){
            servicesModel.getUpdateDataFiveMinutesInterval("allRegionsDemandGraph");
       }
    },


    updateCheckForEveryTwoMinutes: function () {
        var deviceuuid = localStorage.getItem("deviceuuId");
        isAutomaticUpdate = true;
        var appUpdatedTime = new Date().getTime() / 1000;
        localStorage.setItem("appUpdatedTime", appUpdatedTime);
        try{
            servicesModel.checkIftheStartUpFiveMinuteIntervalDataIsReceived();
        }catch(e){}
        
        $.ajax({
            type: "POST",
            async: true,
            url: serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getNewestUpdatedDates',
            contentType: "application/json; charset=utf-8",
            timeout: 10000,
            data: JSON.stringify({
                "udid": deviceuuid
            }),
            headers: {
                'Origin': 'file:///'
            },
            success: function (data) {
                /*if ("NEWEST_EMERGENCY_PROCEDURE_DATE" == data[3][0]){
                    try{
                        setTimeout(function(){
                            if (dbapp.emergencyProcedureData == undefined 
                                || dbapp.emergencyProcedureData.Emergency_Procedure_Last_Updated_Date != data[3][1] ) {
                                badgeService.updateBadgeOnAlertsIcon(Number(data[9][1]));
                                servicesModel.getUpdateDataFiveMinutesInterval("ep");
                            }
                        },50);
                        
                    }catch (error) {}
                }*/
                if ("NEWEST_AGGREGATE_LMP_DATE" == data[0][0]) {
                    try {
                        if (dbapp.zoneData.Zone_LMP_Last_Updated_Date != data[0][1]) {
                            servicesModel.getUpdateDataFiveMinutesInterval("zone");
                        }
                    } catch (error) {}
                }
                /*if ("NEWEST_DEMAND_GRAPH_DATE" == data[1][0]) {
                    try {
                        if (dbapp.demandData.Demand_Graph_Last_Updated_Date != data[1][1]) {
                            servicesModel.getUpdateDataFiveMinutesInterval("graph");
                        }
                    } catch (error) {}
                }*/
                if ("NEWEST_TIE_FLOW_DATE" == data[2][0]) {
                    try { 
                        if (dbapp.tieData.Tie_Flow_Last_Updated_Date != data[2][1]) {
                            servicesModel.getUpdateDataFiveMinutesInterval("tie");
                        }
                    } catch (error) {}
                }
                if("NEWEST_EP_ZONES_UPDATED_DATE" ==  data[4][0]){
                    try { 
                        if(!jQuery.isEmptyObject(data[4][1]) && localStorage.getItem("NEWEST_EP_ZONES_UPDATED_DATE") != data[4][1]){
                            servicesModel.getEPUpdates("regions",data[4][1]);
                        }
                    } catch(error){}
                }
                if("NEWEST_EP_STATES_UPDATED_DATE" == data[5][0]){
                    try{
                        if(!jQuery.isEmptyObject(data[5][1]) && localStorage.getItem("NEWEST_EP_STATES_UPDATED_DATE") != data[5][1]){
                            servicesModel.getEPUpdates("states",data[5][1]);
                        }
                    }catch(error){}
                }
                if("NEWEST_EP_MESSAGE_TYPES_UPDATED_DATE" == data[6][0]){
                    try{
                        if(!jQuery.isEmptyObject(data[6][1]) && localStorage.getItem("NEWEST_EP_MESSAGE_TYPES_UPDATED_DATE") != data[6][1]){
                            servicesModel.getEPUpdates("messageTypes",data[6][1]);
                        }
                    }catch(error){}
                }
                if("NEWEST_ALL_ZONES_DEMAND_GRAPH_DATE" == data[7][0]
                    || "NEWEST_ALL_REGIONS_DEMAND_GRAPH_DATE" == data[8][0]){
                    try{
                         if(!jQuery.isEmptyObject(data[7][1]) && !jQuery.isEmptyObject(data[8][1])
                          && (localStorage.getItem("NEWEST_ALL_ZONES_DEMAND_GRAPH_DATE") != data[7][1] 
                                || localStorage.getItem("NEWEST_ALL_REGIONS_DEMAND_GRAPH_DATE") != data[8][1] ) ){
                            servicesModel.getUpdateDataFiveMinutesInterval("allRegionsDemandGraph");
                        }
                    }catch(error){}
                }
                if ("NEWEST_OPERATIONAL_RESERVES_DATE" == data[10][0]){
                    try{
                        setTimeout(function(){
                            if (dbapp.operationalReservesData == undefined 
                                || dbapp.operationalReservesData.updatedTimestamp != data[10][1] ) {
                                servicesModel.getReservesData("operational");
                            }
                        },50);
                        
                    }catch (error) {}
                }
                if ("NEWEST_DISPATCHED_RESERVES_DATE" == data[11][0]){
                    try{
                        setTimeout(function(){
                            if (dbapp.dispatchedReservesData == undefined 
                                || dbapp.dispatchedReservesData.updatedTimestamp != data[11][1] ) {
                                servicesModel.getReservesData("dispatched");
                            }
                        },50);
                        
                    }catch (error) {}
                }
                if ("NEWEST_APPLICATION_PROPS_DATE" == data[12][0]){
                    try{
                        if(localStorage.getItem("NEWEST_APPLICATION_PROPS_DATE") == null || (!jQuery.isEmptyObject(data[12][1]) && 
                        localStorage.getItem("NEWEST_APPLICATION_PROPS_DATE") != data[12][1])){
                            console.log("inside if");
                            localStorage.setItem("NEWEST_APPLICATION_PROPS_DATE",data[12][1]);
                            servicesModel.getApplicationPropData("applicationProps");
                        }
                    }catch (error) {}
                }
                setTimeout(function () {
                    if (Update_Error_Check) {
                        Network_Error++;
                        if (Network_Error >= 2) {
                            Network_Error = 0;
                            if (!isOnline()) {
                                navigator.notification.alert("The Internet connection appears to be offline.", null, "PJM Now", "OK");
                            }else {
                                navigator.notification.alert("App is not updated due to network timeout.", null, "PJM Now", "OK");
                            }
                        }
                        Update_Error_Check = false;
                    } else {
                        Network_Error = 0;
                    }
                }, 30000);
            },
            error: function (r, s, e) {
                Network_Error++;
                if (Network_Error >= 2) {
                    Network_Error = 0;
                    Update_Error_Check = false;
                    try {
                        if (s === 'timeout') {
                            navigator.notification.alert("App is not updated due to network timeout.", null, "PJM Now", "OK");
                        } else {
                            if (!isOnline()) {
                                navigator.notification.alert("The Internet connection appears to be offline.", null, "PJM Now", "OK");
                            }else {
                                navigator.notification.alert("App is not updated due to network problem.", null, "PJM Now", "OK");
                            }
                        }
                   } catch (error) { }
                }
            },
            beforeSend: function () {},
            complete: function (data) {}
        });
    },
    updateCheckForEveryOneMinute: function () {
        var deviceuuid = localStorage.getItem("deviceuuId");
        isAutomaticUpdate = true;
        var appUpdatedTime = new Date().getTime() / 1000;
        localStorage.setItem("appUpdatedTime", appUpdatedTime);
        try{
            servicesModel.checkIftheStartUpFiveMinuteIntervalDataIsReceived();
        }catch(e){}
        
        $.ajax({
            type: "POST",
            async: true,
            url: serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getNewestUpdatedDatesForLatestAlerts',
            contentType: "application/json; charset=utf-8",
            timeout: 10000,
            data: JSON.stringify({
                "udid": deviceuuid
            }),
            headers: {
                'Origin': 'file:///'
            },
            success: function (data) {
                if ("NEWEST_EMERGENCY_PROCEDURE_DATE" == data[0][0]){
                    try{
                        setTimeout(function(){
                            if (dbapp.emergencyProcedureData == undefined 
                                || dbapp.emergencyProcedureData.Emergency_Procedure_Last_Updated_Date != data[0][1] ) {
                                badgeService.updateBadgeOnAlertsIcon(Number(data[1][1]));
                                servicesModel.getUpdateDataFiveMinutesInterval("ep");
                            }
                        },50);
                        
                    }catch (error) {}
                }
                setTimeout(function () {
                    if (Update_Error_Check) {
                        Network_Error++;
                        if (Network_Error >= 2) {
                            Network_Error = 0;
                            if (!isOnline()) {
                                navigator.notification.alert("The Internet connection appears to be offline.", null, "PJM Now", "OK");
                            }else {
                                navigator.notification.alert("App is not updated due to network timeout.", null, "PJM Now", "OK");
                            }
                        }
                        Update_Error_Check = false;
                    } else {
                        Network_Error = 0;
                    }
                }, 30000);
            },
            error: function (r, s, e) {
                Network_Error++;
                if (Network_Error >= 2) {
                    Network_Error = 0;
                    Update_Error_Check = false;
                    try {
                        if (s === 'timeout') {
                            navigator.notification.alert("App is not updated due to network timeout.", null, "PJM Now", "OK");
                        } else {
                            if (!isOnline()) {
                                navigator.notification.alert("The Internet connection appears to be offline.", null, "PJM Now", "OK");
                            }else {
                                navigator.notification.alert("App is not updated due to network problem.", null, "PJM Now", "OK");
                            }
                        }
                   } catch (error) { }
                }
            },
            beforeSend: function () {},
            complete: function (data) {}
        });
    },
    getReservesData: function (type) {
        servicesModel.serviceUpdateURL['operational'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getOperationalReservesValues';
        servicesModel.serviceUpdateURL['dispatched'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getDispatchedReservesValues';
        var deviceuuid = localStorage.getItem('deviceuuId');
        $.ajax({
            type: "GET",
            async: true,
            url: servicesModel.serviceUpdateURL[type],
            contentType: "application/json; charset=utf-8",
            headers: {
                'Origin': 'file:///'
            },
            success: function (data) {
                    if (!jQuery.isEmptyObject(data)) {
                        if (type == "operational") {
                            updateOperationalData(data);
                        }else if(type == "dispatched"){
                            updateDispatchedData(data);
                        }      
                    }
            },
            error: function (r, s, e) { },
            beforeSend: function (jqXHR, settings) { },
            complete: function (data) { }
        });
    },
    getApplicationPropData: function (type) {
        servicesModel.serviceUpdateURL['applicationProps'] = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getApplicationPropValues';
        $.ajax({
            type: "GET",
            async: true,
            url: servicesModel.serviceUpdateURL[type],
            contentType: "application/json; charset=utf-8",
            headers: {
                'Origin': 'file:///'
            },
            success: function (data) {
                    if (!jQuery.isEmptyObject(data)) {
                        if (type == "applicationProps") {
                            console.log("applicationProps: "+JSON.stringify(data));
                            localStorage.setItem("applicationPropsData", JSON.stringify(data));
                            aboutPJMInit();
                        }      
                    }
            },
            error: function (r, s, e) { },
            beforeSend: function (jqXHR, settings) { },
            complete: function (data) { }
        });
    }
}
function updateOperationalData(data){
    dbapp.operationalReservesData = data;
    isOperationalReservesDataReceived = localStorage.getItem("isOperationalReservesDataReceived");
    if(isOperationalReservesDataReceived == null || isOperationalReservesDataReceived == false){
        dbapp.dropTableOperationalReserves();
        dbapp.createTableOperationalReserves(dbapp.operationalReservesData);
        dbapp.retrieveOperationalReserves();
        localStorage.setItem("isOperationalReservesDataReceived",true);
    }else if(isOperationalReservesDataReceived){
        dbapp.updateDataOperationalReserves(dbapp.operationalReservesData);
        try{
            if(runningPage == 19){
                var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                if (screenOrientation == 90) {
                    showOperationalReserves_landscape();
                }else{
                    showOperationalReserves();
                }
            }
        }catch(e){
        }
    }
}
function updateDispatchedData(data){
    dbapp.dispatchedReservesData = data;
    isDispatchedReservesDataReceived = localStorage.getItem("isDispatchedReservesDataReceived");
    if(isDispatchedReservesDataReceived == null || isDispatchedReservesDataReceived == false){
        dbapp.dropTableDispatchedReserves();
        dbapp.createTableDispatchedReserves(dbapp.dispatchedReservesData);
        dbapp.retrieveDispatchedReserves();
        localStorage.setItem("isDispatchedReservesDataReceived",true);
    }else if(isDispatchedReservesDataReceived == true){
        dbapp.updateDataDispatchedReserves(dbapp.dispatchedReservesData);
         if(runningPage == 19){
             var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
             if (screenOrientation == 90) {
                showDispatchedReserves_landscape();
             }else{
                showDispatchedReserves();
            }
        }
    }
}

function updatingZoneLMPAndZoneTrendAndZoneLists(data) {
    dbapp.zoneData = data;
    servicesModel.zoneData = data;
    dbapp.dropTable();
    dbapp.createTable(servicesModel.zoneData);
    try {
        ZoneMapModule.zones.remove();
        ZoneMapModule.init();
        ZoneMapModule.createZones();
    } catch (error) {}
    try {
        renderZoneLMPList();
    } catch (ex) {}
    try {
        zoneTrendUpdate();
    } catch (ex) {}
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        try {
            renderZoneLMPListTablate();
        } catch (error) {}
    }
    //localStorage.setItem("isZoneLMPFiveMinuteIntervalDataReceived",true);
}

function updatingGraphdata(data) {
    dbapp.demandData = data;
    servicesModel.zoneData = data;
    dbapp.dropTableDemand();
    dbapp.createTableDemand(servicesModel.zoneData);
    try {
        regionsDemandGraphOrientationDeviceCSschanges();
    } catch (error) {}
    localStorage.setItem("isDemandFiveMinuteIntervalDataReceived",true);
}

function updatingRegionsDemandGraphdata(data) {
    dbapp.allRegionsDemand = data;
    localStorage.setItem("NEWEST_ALL_ZONES_DEMAND_GRAPH_DATE", data.allZonesDemandGraphLastUpdatedDate);
    localStorage.setItem("NEWEST_ALL_REGIONS_DEMAND_GRAPH_DATE", data.allRegionsDemandGraphLastUpdatedDate);
    dbapp.updateTableRegionsDemand(data); 
    if(runningPage == 3){
            var response = (function() {
                var regionId = $('#dropDownButton span:first').text();
                if("PJM-RTO" == regionId){
                    regionId = "PJM RTO Total";
                    return regionId;
                }else{
                    return regionId;
                }
            })();  
            clickRegionId(response);
    }
    localStorage.setItem("isRegionsDemandFiveMinuteIntervalDataReceived",true);
}

function updatingTieData(data) {
    dbapp.tieData = data;
    servicesModel.zoneData = data;
    dbapp.dropTableTie();
    dbapp.createTableTie(servicesModel.zoneData);
    try {
        loadTieFlowsData();
    } catch (error) {}
    try {
        loadControlAreas();
    } catch (error) {}
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        try {
            loadControlAreas_tab();
        } catch (error) {}
    }
}
function updatingEPData(data){
	dbapp.updateDataEmergencyProcedure(data);
    localStorage.setItem("EPBadge",data.badgeCount);
    setTimeout(function(){
        badgeService.updateBadgeOnAlertsIcon(data.badgeCount);
        badgeService.updateBadgeOnAppIcon(data.badgeCount);
    },5); 
    JSON.stringify(dbapp.emergencyProcedureData);
    if(runningPage == 9){
        setTimeout(function(){
            alertsService.checkBadgeAndShow();
        },50);
        var landscapeView = false;
        if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
            if (($(window).width() > $(window).height()) ? 90 : 0 == 90) {
                landscapeView = true;
                updateBadgeInLandScapeMode();
            }
        }
        if(landscapeView == false){
            navigateFromLatestAlertsToAlerts();
        }    
    }else if(runningPage == 10){
        try {
          setTimeout(function(){
            var landScapeMode = ($(window).width() > $(window).height()) ? true : false;
            if(landScapeMode){
                loadViewLatestAlertsTab(dbapp.emergencyProcedureData);
            }else{
                loadViewLatestAlerts(dbapp.emergencyProcedureData);  
            }
          },200);
        } catch (error) {}
    }
    try{
        setTimeout(()=>{
            window.plugins.spinnerDialog.hide();
        },50);
    } catch (error) {}    
   //TODO service call to get the badge count;
}
function getBadgeCount(){
    try {
        window.plugins.spinnerDialog.show();
    } catch (error) {}
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
           localStorage.setItem("EPBadge",data.badgeCount);
           window.plugins.spinnerDialog.hide();
        },
        error: function (r, s, e) {
			if (!isOnline()) {
                navigator.notification.alert("The Internet connection appears to be offline.", null, "PJM Now", "OK");
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

function updateEmergencyMessageTypesCountDetails(dateToUpdate){
    try {
        window.plugins.spinnerDialog.show();
    } catch (error) {}
    var deviceuuid = localStorage.getItem("deviceuuId");
   
    var EPTypesCount_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getEmergencyMessageTypesCountDetails';
    $.ajax({
        type: "POST",
        async: true,
        url: EPTypesCount_URL,
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
           localStorage.setItem("MessageTypesSelectedCountToUpdate",data.messageTypesSelectedCount);
           if(localStorage.getItem("TypesSelectedCount") > 0){
               if(localStorage.getItem("TypesSelectedCount") != Number(data.messageTypesSelectedCount)){
                   localStorage.setItem("TypesSelectedCount", Number(data.messageTypesSelectedCount));
                   if(runningPage == 16){
                      try{
                          var landScapeMode = false;
                          if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                                        var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                                        if (screenOrientation == 90) {
                                                landScapeMode = true;
                                        }
                          }
                          if(landScapeMode == true){
                              populateEPTypeSelectedStatus();
                          }else{
                              $('#typeSelectedDiv').show();
                              $('#typesCountDivId').hide();
                              $('#typeSelectedText').text(localStorage.getItem("TypesSelectedCount"));
                          }
                       }catch(error){}
                   }
               }
           }
           localStorage.setItem("PAHCount",data.countOfPAH);
           if(jQuery.isEmptyObject(dateToUpdate) == false){
               localStorage.setItem("NEWEST_EP_MESSAGE_TYPES_UPDATED_DATE", dateToUpdate);
           }
           window.plugins.spinnerDialog.hide();
        },
        error: function (r, s, e) {
			if (!isOnline()) {
                navigator.notification.alert("The Internet connection appears to be offline.", null, "PJM Now", "OK");
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