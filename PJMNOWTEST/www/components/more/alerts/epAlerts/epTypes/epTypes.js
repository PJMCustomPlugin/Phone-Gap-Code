var allTypesDeselected_prev = false;		
var previousTypeToUpdate = null;
var allEPTypesOnlyPrev = null;

function displayCheckedForAllMessageTypesBasedOnPAHFlag(pahTypesOnlyEnabledFlag,switchInstance){
         if(pahTypesOnlyEnabledFlag == "false"){
            $('#allTypesUL li').each(function(){
                    $(this).removeClass('disabled');
            });
            $('#allTypesUL input:checked').each(function() {
                    $(this).css("color", "#5597C6");
            });
            if(switchInstance!=null){
                 switchInstance.check(false);
            }
         }else if(pahTypesOnlyEnabledFlag == "true"){
            $('#allTypesUL li').each(function(){
                    $(this).addClass('disabled');
            });
            $('#allTypesUL input:checked').each(function() {
                    $(this).css("color", "#848484");
            });
            if(switchInstance!=null){
                switchInstance.check(true);
            }
         }
}


function EPTypesInitMethod(){ 
    runningPageChange(18);// epTypesScreen 
    var pahTypesOnlyEnabledFlag = localStorage.getItem("PAHTypesOnlyEnabledFlag");
    var switchInstance = $("#pahSwitch").data("kendoMobileSwitch");
    if(pahTypesOnlyEnabledFlag ==  null || pahTypesOnlyEnabledFlag == undefined){
            getPAHTypeOnlyStatusAndStore();
    } else{
         var allEPTypesOnly = localStorage.getItem("AllEPTypesOnly"); 
         if(allEPTypesOnly == undefined || allEPTypesOnly == null || allEPTypesOnly == 'null'){
                getAllEPTypesAndPopulate();
         }else{
                populateEPTypesData(JSON.parse(allEPTypesOnly)); 
         }
         displayCheckedForAllMessageTypesBasedOnPAHFlag(pahTypesOnlyEnabledFlag,switchInstance);
    }
    var text = toChangePAHtoPAI('type1');
    document.getElementById("allowAlertsSubDivId").innerHTML = text;
    text =  toChangePAHtoPAI('type2');
    document.getElementById("epAlertTextId").innerHTML = "Selects only the emergency procedure types that can trigger a "+text+".";
}

function getAllEPTypesAndPopulate() {
            var deviceuuid = localStorage.getItem("deviceuuId");
            var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllEPTypes';
            try {
                window.plugins.spinnerDialog.show();
            } catch (error) {}
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
                    localStorage.setItem("AllEPTypesOnly", JSON.stringify(data));
                    var pahTypesFlag = localStorage.getItem("PAHTypesOnlyEnabledFlag");
                    updateEmergencyMessageTypesCountDetails(null);
                     if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                            var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                            if (screenOrientation == 90) {
                                populateEPTypesDataTab(data);
                                if(pahTypesFlag=='true'){
                                    $('#allTypesULTab li').each(function(){
                                           $(this).addClass('disabled');
                                    });
                                    $('#allTypesULTab input:checked').each(function() {
                                           $(this).css("color", "#848484");
                                    });
                                }
                            }else{
                                populateEPTypesData(data);
                                if(pahTypesFlag=='true'){
                                    $('#allTypesUL li').each(function(){
                                            $(this).addClass('disabled');
                                    });
                                    $('#allTypesUL input:checked').each(function() {
                                        $(this).css("color", "#848484");
                                    });
                                }
                            }
                     }
                	 else{
                         populateEPTypesData(data); 
                         if(pahTypesFlag=='true'){
                                    $('#allTypesUL li').each(function(){
                                            $(this).addClass('disabled');
                                    });
                                    $('#allTypesUL input:checked').each(function() {
                                        $(this).css("color", "#848484");
                                    });
                         }
                     }   
                    try{
                        window.plugins.spinnerDialog.hide();    
                    }catch(e){}
                },
                error: function (r, s, e) {
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

function populateEPTypesData(data){
    var tablet = false;
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                            var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                            if (screenOrientation == 0) {
                                tablet = true;
                            }
    }else{
         tablet = false;
    }
    
    var typesDiv ='';
    jQuery.each(data, function() {
                  typesDiv = typesDiv + "<li id='"+this.messageType.messageTypeId+"' class>";
               
                        typesDiv = typesDiv + "<label class='km-listview-label' style='background-color:white !important;'> ";
                        if(this.selectionFlag){
                            typesDiv = typesDiv + "<input id='ep_type_"+this.messageType.messageTypeId+"' type='checkbox'  onclick='changeEPType(this)' class='km-widget km-icon km-check' name='"+this.messageType.messageName+"' value='"+this.selectionFlag+"' checked></input>";
                        }else{
                            typesDiv = typesDiv + "<input id='ep_type_"+this.messageType.messageTypeId+"' type='checkbox'  onclick='changeEPType(this)' class='km-widget km-icon km-check' name='"+this.messageType.messageName+"' value='"+this.selectionFlag+"'></input>";
                        }
                if(tablet){
                      typesDiv = typesDiv + "<div style='float:right;width:96.5% !important;'>"+this.messageType.messageName+"</div>";
                }else{
                      typesDiv = typesDiv + "<div style='float:right;width:93% !important;'>"+this.messageType.messageName+"</div>";
                }
              
                  typesDiv = typesDiv + "</label></li>";
    });
    var viewTypesdiv = document.getElementById("allTypesUL");
    viewTypesdiv.innerHTML = "";
    viewTypesdiv.innerHTML = viewTypesdiv.innerHTML + typesDiv;
}

function populateEPTypesDataTab(data){
    var typesDiv ='';
   
    jQuery.each(data, function() {
                  typesDiv = typesDiv + "<li id='"+this.messageType.messageTypeId+"' class>";
                  typesDiv = typesDiv + "<label class='km-listview-label' style='background-color:white !important;'>  ";
        
                if(this.selectionFlag){
                    typesDiv = typesDiv + "<input id='ep_type_tab_"+this.messageType.messageTypeId+"' onclick='changeEPType(this)' class='km-widget km-icon km-check' type='checkbox' name='"+this.messageType.messageName+"' value='"+this.selectionFlag+"' checked></input>";
                }else{
                    typesDiv = typesDiv + "<input id='ep_type_tab_"+this.messageType.messageTypeId+"' onclick='changeEPType(this)' class='km-widget km-icon km-check' type='checkbox' name='"+this.messageType.messageName+"' value='"+this.selectionFlag+"'></input>";
                }
                  typesDiv = typesDiv + "<div style='float:right;width:96.5% !important;'>"+this.messageType.messageName+"</div>";
                  typesDiv = typesDiv + "</label></li>";
    });
    var viewTypesdiv = document.getElementById("allTypesULTab");
    viewTypesdiv.innerHTML = "";
    viewTypesdiv.innerHTML = viewTypesdiv.innerHTML + typesDiv;
    $('#headerTag').text('Types');
}

function changeEPType(currentobj){
    var tempChecked = $("#"+currentobj.id).prop("checked");
     if (isOnline()) { 
            var portrait = false;
            if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                                    var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                                    if (screenOrientation == 90) {
                                        portrait = true;
                                    }
            }else{
                 portrait = false;
            }
            var currentObjId = currentobj.id;
            var currentObjName = null;
            var currentObjVal = null;
            if(portrait == true){
                currentObjName = $('#'+currentObjId).attr("name");
                currentObjVal =JSON.parse($("#"+currentObjId).val());
            }else{
                currentObjName = $('#'+currentObjId).attr("name");
                currentObjVal =JSON.parse($("#"+currentObjId).val());
            }
            var typesSelectedCount = 0; 
            var propChecked = !currentObjVal;
            if(allEPTypesOnly == undefined || allEPTypesOnly == null || allEPTypesOnly == 'null'){
                      allEPTypesOnly = JSON.parse(localStorage.getItem("AllEPTypesOnly"));
            }
            allEPTypesOnlyPrev = JSON.parse(localStorage.getItem("AllEPTypesOnly"));
            if(currentObjName == "All"){
                             if(currentObjVal == true){
                                 allTypesDeselected = true; 
                             }else{
                                 allTypesDeselected = false; 
                             }
                             jQuery.each(allEPTypesOnly, function() {
                                 if(portrait==true){
                                     $("#ep_type_tab_"+this.messageType.messageTypeId).prop("checked",propChecked);
                                     $("#ep_type_tab_"+this.messageType.messageTypeId).prop("value",propChecked);
                                 }else{
                                     $("#ep_type_"+this.messageType.messageTypeId).prop("checked",propChecked);
                                     $("#ep_type_"+this.messageType.messageTypeId).prop("value",propChecked);
                                 }
                                 this.selectionFlag = propChecked;
                             });
                             localStorage.setItem("TypesSelectedCount", typesSelectedCount);
              }else{
                    if(portrait==true){
                            jQuery.each(allEPTypesOnly, function() {
                                        if(currentObjName == this.messageType.messageName || ( this.messageType.messageName == "All" && currentObjVal == true ) ){
                                            this.selectionFlag = propChecked;
                                            // console.log("---------------------- this.messageType.messageName : "+ this.messageType.messageName+ " ; propChecked : "+propChecked);
                                            $("#ep_type_tab_"+this.messageType.messageTypeId).prop("checked",propChecked);
                                            $("#ep_type_tab_"+this.messageType.messageTypeId).prop("value",propChecked);
                                        }
                                        if($("#ep_type_tab_"+this.messageType.messageTypeId).prop("checked") == true){
                                            typesSelectedCount++;
                                        }
                            });
                    } else{
                      jQuery.each(allEPTypesOnly, function() {
                                 if(currentObjName == this.messageType.messageName || ( this.messageType.messageName == "All" && currentObjVal == true ) ){
                                     this.selectionFlag = propChecked;
                                     $("#ep_type_"+this.messageType.messageTypeId).prop("checked",propChecked);
                                     $("#ep_type_"+this.messageType.messageTypeId).prop("value",propChecked);
                                 }
                                 if($("#ep_type_"+this.messageType.messageTypeId).prop("checked") == true){
                                     typesSelectedCount++;
                                 }
                             });
                    }
                    if(typesSelectedCount < 1) {
                        allTypesDeselected = true; 
                    }else{
                        localStorage.setItem("TypesSelectedCount", typesSelectedCount);
                        allTypesDeselected = false;
                    }
              }
              if(allTypesDeselected == true){
                      allTypesDeselected_prev = allTypesDeselected;
                      previousTypeToUpdate = currentobj;
              } 
              else if(allTypesDeselected == false ){
                      if(allTypesDeselected_prev == true){
                          setTimeout(function(){
                               updateUserActionOnEPTypeSelection(currentobj,previousTypeToUpdate); 
                          },50);
                      }else{
                          setTimeout(function(){
                               updateUserActionOnEPTypeSelection(null,currentobj); 
                          },50);
                      }
                      localStorage.setItem("AllEPTypesOnly",JSON.stringify(allEPTypesOnly)); 
                      allTypesDeselected_prev = false; 
              }
     } else{
        navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
        $("#"+currentobj.id).prop("checked",!tempChecked);
     }
}

function resetEPTypesOnError(){
    localStorage.setItem("AllEPTypesOnly",JSON.stringify(allEPTypesOnlyPrev)); 
    jQuery.each(allEPTypesOnlyPrev, function() {
        $("#ep_type_"+this.messageType.messageTypeId).prop("checked",this.selectionFlag);
        $("#ep_type_"+this.messageType.messageTypeId).prop("value",this.selectionFlag);
    });
}

function updateUserActionOnEPTypeSelection(secondObjToUpdate,firstObjToUpdate){
    var portrait = false;
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                            var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                            if (screenOrientation == 90) {
                                portrait = true;
                            }
    }else{
         portrait = false;
    }
    var selectionFlag = null;
    var messageName = null; 
    var typeId = null;
    if(portrait==true){
          selectionFlag = $('#'+firstObjToUpdate.id).prop("checked");
          messageName = $('#'+firstObjToUpdate.id).attr("name");
          typeId = Number(firstObjToUpdate.id.substring(12,firstObjToUpdate.id.length));
    }else{
         selectionFlag = $('#'+firstObjToUpdate.id).prop("checked");
         messageName = $('#'+firstObjToUpdate.id).attr("name");
         typeId = Number(firstObjToUpdate.id.substring(8,firstObjToUpdate.id.length));
    }
     var deviceuuid = localStorage.getItem("deviceuuId");
     var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateSelectedEPType';
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
              "udid" : deviceuuid,
              "selectionFlag":selectionFlag,
              "messageType":{
                  "messageTypeId":typeId ,
                  "messageName":messageName,
              }
        }),
        success: function (data) {
            if(data.success){
                if(secondObjToUpdate !=null){
                    updateUserActionOnEPTypeSelection(null,secondObjToUpdate);
                }
            }else{
                resetEPTypesOnError();
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
            }
            try{
                window.plugins.spinnerDialog.hide();
            }catch(e){
            }
        },
        error: function (r, s, e) {
            if (!isOnline()) {
                navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
            } else if (s === 'timeout') {
                window.plugins.spinnerDialog.hide();
                navigator.notification.alert(networkTimeoutMessage, null, "PJM Now", "OK");
            } else {
                window.plugins.spinnerDialog.hide();
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
            }
            try{
                window.plugins.spinnerDialog.hide();
            }catch(e){
            }
            resetEPTypesOnError();
        },
        beforeSend: function () {},
        complete: function (data) {}
    });
}
function onPAHTypeOnlySwitchChange(e){
    var portrait = false;
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                            var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                            if (screenOrientation == 90) {
                                portrait = true;
                            }
    }else{
         portrait = false;
    }
    var tempAllEPTypesOnly = null;
    if(allEPTypesOnly == undefined || allEPTypesOnly == null || allEPTypesOnly == 'null'){
                 allEPTypesOnly = JSON.parse(localStorage.getItem("AllEPTypesOnly")); 
    }
    tempAllEPTypesOnly = JSON.parse(localStorage.getItem("AllEPTypesOnly")); 
    
    if(isOnline()){
            var epPAHTypeOnlyEnabled = false;
            if (e.checked) {
                epPAHTypeOnlyEnabled = true;
                if(portrait==true){
                     jQuery.each(allEPTypesOnly, function() {
                         $("#ep_type_tab_"+this.messageType.messageTypeId).prop("checked",this.messageType.pahFlag);
                         this.selectionFlag = this.messageType.pahFlag;
                         $("#ep_type_tab_"+this.messageType.messageTypeId).prop("value",this.messageType.pahFlag);
                     });
                }else{
                     jQuery.each(allEPTypesOnly, function() {
                         $("#ep_type_"+this.messageType.messageTypeId).prop("checked",this.messageType.pahFlag);
                         this.selectionFlag = this.messageType.pahFlag;
                         $("#ep_type_"+this.messageType.messageTypeId).prop("value",this.messageType.pahFlag);
                     });
                }
                localStorage.setItem("AllEPTypesOnly",JSON.stringify(allEPTypesOnly));
            } else {
                localStorage.setItem("TypesSelectedCount", Number(localStorage.getItem("PAHCount")));
                epPAHTypeOnlyEnabled = false;
            }
            localStorage.setItem("PAHTypesOnlyEnabledFlag",epPAHTypeOnlyEnabled);
            var landScapeMode = false;
            if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                   var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                   if (screenOrientation == 90) {
                           landScapeMode = true;
                   }
            }
            if(landScapeMode == true){
                     if(epPAHTypeOnlyEnabled == true){
                            $('#allTypesULTab li').each(function(){
                                   $(this).addClass('disabled');
                            });
                            $('#allTypesULTab input:checked').each(function() {
                                   $(this).css("color", "#848484");
                            });
                     }else{
                      	    $('#allTypesULTab li').each(function(){
                                   $(this).removeClass('disabled');
                            });
                            $('#allTypesULTab input:checked').each(function() {
                                   $(this).css("color", "#5597C6");
                            });
                      }            
             }else{
                     if(epPAHTypeOnlyEnabled == true){
                             $('#allTypesUL li').each(function(){
                                    $(this).addClass('disabled');
                             });
                             $('#allTypesUL input:checked').each(function() {
                                            $(this).css("color", "#848484");
                             });
                       }else{
                              $('#allTypesUL li').each(function(){
                                   $(this).removeClass('disabled');
                              });
                              $('#allTypesUL input:checked').each(function() {
                                    $(this).css("color", "#5597C6");
                              });
                       }
            }
            allTypesDeselected = false;
            setTimeout(function(){
                 updatePAHTypeSwitchStatus(epPAHTypeOnlyEnabled,tempAllEPTypesOnly);
            },50);
    }else{
         navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
         var switchInstance = null;
         if(portrait == true){
                    switchInstance = $("#pahSwitchTab").data("kendoMobileSwitch");
         }else {
                    switchInstance = $("#pahSwitch").data("kendoMobileSwitch");
         }
         switchInstance.check(!e.checked);
         localStorage.setItem("PAHTypesOnlyEnabledFlag",!e.checked);
         localStorage.setItem("AllEPTypesOnly",JSON.stringify(tempAllEPTypesOnly));
         window.plugins.spinnerDialog.hide();
    }           
}

function resetEPTypesDataOnToggleError(epPAHTypeOnlyEnabled,tempAllEPTypesOnly){
                var switchInstance = null;
                var landScapeMode = false;
                if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                    var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                    if (screenOrientation == 90) {
                            landScapeMode = true;
                    }
                }
                if(landScapeMode == true){
                    switchInstance = $("#pahSwitchTab").data("kendoMobileSwitch");
                }else {
                    switchInstance = $("#pahSwitch").data("kendoMobileSwitch");
                }
                
                switchInstance.check(!epPAHTypeOnlyEnabled);
                localStorage.setItem("PAHTypesOnlyEnabledFlag",!epPAHTypeOnlyEnabled);
                localStorage.setItem("AllEPTypesOnly",JSON.stringify(tempAllEPTypesOnly));
                if(landScapeMode == true){
                     jQuery.each(tempAllEPTypesOnly, function() {
                         $("#ep_type_tab_"+this.messageType.messageTypeId).prop("checked",this.selectionFlag);
                         $("#ep_type_tab_"+this.messageType.messageTypeId).prop("value",this.selectionFlag);
                     });
                }else{
                     jQuery.each(tempAllEPTypesOnly, function() {
                            $("#ep_type_"+this.messageType.messageTypeId).prop("checked",this.selectionFlag);
                            $("#ep_type_"+this.messageType.messageTypeId).prop("value",this.selectionFlag);
                     });
                }
                if(landScapeMode == true){
                        if(epPAHTypeOnlyEnabled == false){
                                $('#allTypesULTab li').each(function(){
                                    $(this).addClass('disabled');
                                });
                                $('#allTypesULTab input:checked').each(function() {
                                    $(this).css("color", "#848484");
                                });
                        }else{
                                $('#allTypesULTab li').each(function(){
                                    $(this).removeClass('disabled');
                                });
                                $('#allTypesULTab input:checked').each(function() {
                                    $(this).css("color", "#5597C6");
                                });
                        }            
                }else{
                        if(epPAHTypeOnlyEnabled == false){
                                $('#allTypesUL li').each(function(){
                                        $(this).addClass('disabled');
                                });
                                $('#allTypesUL input:checked').each(function() {
                                                $(this).css("color", "#848484");
                                });
                        }else{
                                $('#allTypesUL li').each(function(){
                                    $(this).removeClass('disabled');
                                });
                                $('#allTypesUL input:checked').each(function() {
                                        $(this).css("color", "#5597C6");
                                });
                        }
                }

}

function updatePAHTypeSwitchStatus(epPAHTypeOnlyEnabled,tempAllEPTypesOnly){
    try{
        window.plugins.spinnerDialog.show();
    }catch(e){}
    var landScapeMode = false;
         if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
               var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
               if (screenOrientation == 90) {
                        landScapeMode = true;
               }
         }
     var deviceuuid = localStorage.getItem("deviceuuId");
     var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updatePAHTypeSwitchStatus';
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
              "udid" : deviceuuid,
              "pahTypesOnlyEnabled" :  epPAHTypeOnlyEnabled
        }),
        success: function (data) {
            if(data.success){
            }else{
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                resetEPTypesDataOnToggleError(epPAHTypeOnlyEnabled,tempAllEPTypesOnly);
            }
            window.plugins.spinnerDialog.hide();
        },
        error: function (r, s, e) {
            if (!isOnline()) {
                navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
            } else if (s === 'timeout') {
                window.plugins.spinnerDialog.hide();
                navigator.notification.alert(networkTimeoutMessage, null, "PJM Now", "OK");
            } else {
                window.plugins.spinnerDialog.hide();
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
            }
             resetEPTypesDataOnToggleError(epPAHTypeOnlyEnabled,tempAllEPTypesOnly);
             window.plugins.spinnerDialog.hide();
        },
        beforeSend: function () {},
        complete: function (data) {}
    });
}

function getPAHTypeOnlyStatusAndStore(){
    var deviceuuid = localStorage.getItem("deviceuuId");
     var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getPAHTypeOnlyStatus';
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
              "udid" : deviceuuid
        }),
        success: function (data) {
            try{
                window.plugins.spinnerDialog.hide();
            }catch(e){}
            
            localStorage.setItem("PAHTypesOnlyEnabledFlag",data.pahTypesOnlyEnabled);
            
            var landScapeMode = false ;
            var allEPTypesOnly = localStorage.getItem("AllEPTypesOnly"); 
            if(allEPTypesOnly == undefined || allEPTypesOnly == null || allEPTypesOnly == 'null'){
                 getAllEPTypesAndPopulate();
            }else{
                    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                        var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                        if (screenOrientation == 90) {
                                landScapeMode = true;
                        }
                   }
            }
            if(landScapeMode == true){
                     var switchInstance = $("#pahSwitchTab").data("kendoMobileSwitch");
                     populateEPTypesDataTab(JSON.parse(allEPTypesOnly)); 
                     if(localStorage.getItem("PAHTypesOnlyEnabledFlag") == "false"){
                            $('#allTypesULTab li').each(function(){
                                    $(this).removeClass('disabled');
                            });
                            $('#allTypesULTab input:checked').each(function() {
                                $(this).css("color", "#5597C6");
                            });
                            switchInstance.check(false);
                     }else if(localStorage.getItem("PAHTypesOnlyEnabledFlag") == "true"){
                          	$('#allTypesULTab li').each(function(){
                                $(this).addClass('disabled');
                            });
                            $('#allTypesULTab input:checked').each(function() {
                                $(this).css("color", "#848484");
                            });
                            switchInstance.check(true);
                     }
            }else{
                     var switchInstance = $("#pahSwitch").data("kendoMobileSwitch");
                     populateEPTypesData(JSON.parse(allEPTypesOnly)); 
                
                  	 if(localStorage.getItem("PAHTypesOnlyEnabledFlag") == "false"){
                            $('#allTypesUL li').each(function(){
                                    $(this).removeClass('disabled');
                            });
                            $('#allTypesUL input:checked').each(function() {
                                $(this).css("color", "#5597C6");
                            });
                            switchInstance.check(false);
                     }else if(localStorage.getItem("PAHTypesOnlyEnabledFlag") == "true"){
                          	$('#allTypesUL li').each(function(){
                                $(this).addClass('disabled');
                            });
                            $('#allTypesUL input:checked').each(function() {
                                $(this).css("color", "#848484");
                            });
                            switchInstance.check(true);
                     }
            }
        },
        error: function (r, s, e) {
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

function backToEPAlertsFromTypes(){
    
    if(runningPage == 18){
        if(allTypesDeselected == true && localStorage.getItem("PAHTypesOnlyEnabledFlag") == 'false' ){
             navigator.notification.alert("You must select at least one Type.", null, "Warning", "OK");
        }else{
             app.navigate("components/more/alerts/epAlerts/epAlerts.html", "slide:right");
        }
    }
}