console.log("deviceModel.js");
var deviceModel = {
    getDeviceDetailsAndRegister : function () {
        if(device.platform == "iOS"){
            var keychain = new Keychain();
            var key = "UUIDKey";
            var servicename = "MY_PASSWORDS";
            var win = function (value) {
                localStorage.setItem("deviceuuId", value);
                pushNotificationService.registerForPushNotifications();
            };
            var fail = function (error) {
                try{
                    deviceModel.setDeviceUDID();
                }catch(e){
                }
            };
            keychain.getForKey(win, fail, key, servicename);
        }else if (device.platform == 'android' || device.platform == 'Android') {
            pushNotificationService.registerForPushNotifications();
        }
    },
    setDeviceUDID : function () {
        var keychain = new Keychain();
        var key = "UUIDKey";
        var servicename = "MY_PASSWORDS";
        var value = device.uuid;
        var win = function () {
            deviceModel.getDeviceDetailsAndRegister();
        };
        var fail = function (error) {
        };
        keychain.setForKey(win, fail, key, servicename, value);
    },
    doRegisterDevice :  function (token) {
        var deviceuuid = '';
        var appVersion = '';
        var registerAPI = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/registerDevice';
        if (device.platform == "iOS") {
            deviceuuid = localStorage.getItem('deviceuuId');
            appVersion = localStorage.getItem('appversion');

            if (jQuery.isEmptyObject(deviceuuid) || deviceuuid == '') {
                deviceModel.getDeviceDetailsAndRegister();
            } else if(jQuery.isEmptyObject(appVersion)){
                cordova.getAppVersion.getVersionNumber(function (value) {
                             localStorage.setItem("appversion", value);
                             appVersion = localStorage.getItem('appversion');
                             setTimeout(function () {
                                deviceModel.doRegisterDeviceOnServerEnd(deviceuuid,token,appVersion,registerAPI);
                             },150);
                });
            } else {
                setTimeout(function () {
                    deviceModel.doRegisterDeviceOnServerEnd(deviceuuid,token,appVersion,registerAPI);
                 },150);
            }
        } else {
            deviceuuid = device.uuid;
            appVersion = localStorage.getItem('appversion');
            localStorage.setItem("deviceuuId", device.uuid);
            setTimeout(function () {
                if (deviceuuid == '') {
                    deviceuuid = localStorage.getItem('deviceuuId');
                }
                if(jQuery.isEmptyObject(appVersion)){
                     cordova.getAppVersion.getVersionNumber(function (value) {
                             localStorage.setItem("appversion", value);
                             appVersion = localStorage.getItem('appversion');
                             deviceModel.doRegisterDeviceOnServerEnd(deviceuuid,token,appVersion,registerAPI);
                     });
                }else{
                    deviceModel.doRegisterDeviceOnServerEnd(deviceuuid,token,appVersion,registerAPI);
                }
                
            }, 150);
         }
      },
      doRegisterDeviceOnServerEnd : function(deviceuuid,token,appVersion,registerAPI){
          $.ajax({
                    type: "POST",
                    async: true,
                    url: registerAPI,
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Origin': 'file:///'
                    },
                    data: JSON.stringify({
                        "udid": deviceuuid,
                        "token": token,
                        "devicePlatform": device.platform,
                        "deviceModel": device.model,
                        "deviceVersion": device.version,
                        "appVersion" : appVersion
                    }),
                    success: function (data) {
                        //lert("e : "+data.success);
                        if (data.success == true) {
                            localStorage.setItem("tokenValue", token);
                            localStorage.setItem("deviceName", data.deviceName);
                            localStorage.setItem("appversion",appVersion);
                            isDeviceRegistered = true;
                            isDeviceRegistrationFailed = false;
                            localStorage.setItem("isDeviceRegisteredVal", "registered");
                            if (!jQuery.isEmptyObject(data.deviceEmergencyProcedureDataList)){
                                    try{
                                        //window.plugins.spinnerDialog.show();
                                        setTimeout(function(){
                                            dbapp.emergencyProcedureData = data.deviceEmergencyProcedureDataList;
                                            updatingEPData(data.deviceEmergencyProcedureDataList);
                                        },500);     
                                    }catch(e){
                                    }
                            }
                            //TODO get no of unread alerts count
                            if(device.platform == "iOS"){
                                 ThreeDeeTouch.isAvailable(function (avail) {
                                   if(avail == true){
                                       threeDimTouchService.updateQuickActions();
                                   }
                                 });
                            }
                        } else {
                            isDeviceRegistrationFailed = true;
                        }
                        dbapp.createTableForAnalytics();
                        dbapp.createTableForAnalyticsSending();
                    },
                    error: function (r, s, e) {
                        this.registrationFailedOnServerEnd();
                    },
                    beforeSend: function (jqXHR, settings) { },
                    complete: function (data) { }
                });
      },
      registrationFailedOnServerEnd : function(){
                    dbapp.createTableForAnalytics();
                    dbapp.createTableForAnalyticsSending();
                    isDeviceRegistrationFailed = true;
      },
      updateDeviceToken : function (token) {
            var updateDeviceTokenAPI = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceToken';
            var deviceuuid = localStorage.getItem('deviceuuId');
            $.ajax({
                type: "POST",
                async: true,
                url: updateDeviceTokenAPI,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Origin': 'file:///'
                },
                data: JSON.stringify({
                    "udid": deviceuuid,
                    "token": token
                }),
                success: function (data) {
                    if(data.success == true){
                        localStorage.setItem("tokenValue", token);
                    }
                },
                error: function (r, s, e) { },
                beforeSend: function (jqXHR, settings) { },
                complete: function (data) { }
            });
    },
    updateAppVersion : function(appversion,type) {
        
        var updateAppVersionServiceCall = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateAppVerion';
        var deviceuuid = localStorage.getItem('deviceuuId');
        //alert("updateAppVersion : deviceuuid : "+deviceuuid+ "; appversion : "+appversion);
        if(!jQuery.isEmptyObject(deviceuuid) && !jQuery.isEmptyObject(appversion)){
             $.ajax({
                type: "POST",
                async: true,
                url: updateAppVersionServiceCall,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Origin': 'file:///'
                },
                data: JSON.stringify({
                    "udid": deviceuuid,
                    "appVersion": appversion
                }),
                success: function (data) {
                   try{  
                         
                            if(data.success == true){
                                localStorage.setItem("appversion", appversion);
                                if( jQuery.isEmptyObject(localStorage.getItem("isDeviceRegisteredVal")) == true){
                                    localStorage.setItem("isDeviceRegisteredVal", "registered");
                                }
                            } else if(data.success == false && data.isDevicePresent == false){
                                    deviceModel.getDeviceDetailsAndRegister();
                            }
                            if(type == "update"){
                                 servicesModel.getUpdateDataFiveMinutesInterval("ep");
                                 setTimeout(function(){
                                    servicesModel.getReservesData("operational");
                                    servicesModel.getReservesData("dispatched");
                                    getDeviceZoneDataAndUpdate();
                                },50);
                            }
                    }catch(e){}                                             
                },
                error: function (r, s, e) {
                },
                beforeSend: function (jqXHR, settings) { },
                complete: function (data) { }
            });
         }else{
             //console.log(" one thing is empty-----------");
         }
    },
    checkAppVersion : function (){
           try {
                appVersion = localStorage.getItem('appversion');
                if(jQuery.isEmptyObject(appVersion) == true){
                         cordova.getAppVersion.getVersionNumber(function (value) {
                            deviceModel.updateAppVersion(value,"new");
                         });
                }else{
                     cordova.getAppVersion.getVersionNumber(function (value) {
                               if(value != appVersion){
                                   threeDimTouchService.updateQuickActions();
                                   deviceModel.updateAppVersion(value,"update");
                               }
                         });
                }  
            } catch (error) {}
    }
}