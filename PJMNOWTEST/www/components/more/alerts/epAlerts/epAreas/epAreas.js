var areasData = [
    {id:'region', name: 'By Region/Zone', value: true},
    {id:'state' , name: 'By State', value: false},
];

var allRegionsDeselected_prev = false;		
var allStatesDeselected_prev = false;		
var previousRegionToUpdate = null;		
var previousStateToUpdate = null;		
var allRegionsData = null;		
var allStatesData = null;
var allRegionsDataPrev = null;		
var allStatesDataPrev = null;
var allAreasDataPrev = null;

function EPAreasInitMethod(){
    runningPageChange(17);// epAreasScreen 
    var allAreaData = localStorage.getItem("AllAreasData"); 
     if(allAreaData==undefined || allAreaData == null || allAreaData == 'null'){
         getAllAreasAndPopulate();
     }else{
         populateAreasData(JSON.parse(allAreaData)); 
     }
}

function getAllAreasAndPopulate() {
            var deviceuuid = localStorage.getItem("deviceuuId");
            var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllAreas';
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
                    localStorage.setItem("AllAreasData", JSON.stringify(data));
                    var landScapeMode = false;
                     if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                                var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                                if (screenOrientation == 90) {
                                        landScapeMode = true;
                                }
                    }
                    if(landScapeMode == true){
                         populateAreasDataTab(data); 
                    }else{
                         populateAreasData(data); 
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
                    window.plugins.spinnerDialog.hide();
                },
                beforeSend: function () {},
                complete: function (data) {}
            });
}

function populateAreasData(data){
    	   var areasDataSource = new kendo.data.DataSource({});
           areasDataSource.data(data);
           $('#areasNames').kendoMobileListView({
                  template : '<label style="background-color:white !important;">'+'# if (selectionFlag) { #<input id="area_#:id#" type="checkbox" onclick="changeEPArea(this)" checked value="#:selectionFlag#"># }'
                                            +'else{ #<input id="area_#:id#" type="checkbox" onclick="changeEPArea(this)" value="#:selectionFlag#">#}#'+' #:name#</label>',
                  dataSource: areasDataSource
           });
           checkAreaSelectedAndDisplay();	
}

function populateAreasDataTab(data){
      var landScapeMode = false;
      if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                    var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                    if (screenOrientation == 90) {
                               landScapeMode = true;
                    }
      }
      var areasDataSource = new kendo.data.DataSource({});
      areasDataSource.data(data);
      $('#areasNamesTab').kendoMobileListView({
                template : '<label style="background-color:white !important;">'+'# if (selectionFlag) { #<input id="area_tab_#:id#" type="checkbox" onclick="changeEPArea(this)" checked value="#:selectionFlag#"># }'
                                        +'else{ #<input id="area_tab_#:id#" type="checkbox" onclick="changeEPArea(this)" value="#:selectionFlag#">#}#'+' #:name#</label>',
                dataSource: areasDataSource
      });
      checkAreaSelectedAndDisplay();
}

function getAllRegionsAndPopulate() {
    var deviceuuid = localStorage.getItem("deviceuuId");
    var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllRegions';
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
            localStorage.setItem("AllRegionsData", JSON.stringify(data));
            var landScapeMode = false;
            if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                if (screenOrientation == 90) {
                        landScapeMode = true;
                }
            }
            if(landScapeMode == true){
                 populateRegionsDataTab(data); 
            }else{
                 populateRegionsData(data); 
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
            window.plugins.spinnerDialog.hide();
        },
        beforeSend: function () {},
        complete: function (data) {}
    });
}

function getAllStatesAndPopulate(){
   
    var deviceuuid = localStorage.getItem("deviceuuId");
    var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllStates';
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
            localStorage.setItem("AllStatesData", JSON.stringify(data));
            var landScapeMode = false;
            if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                        var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                        if (screenOrientation == 90) {
                                landScapeMode = true;
                        }
            }
            if(landScapeMode == true){
                 populateStatesDataTab(data);
            }else{
                 populateStatesData(data);
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
            window.plugins.spinnerDialog.hide();
        },
        beforeSend: function () {},
        complete: function (data) {}
    });
    
}

function populateRegionsData(data){
    var regionsDataSource = new kendo.data.DataSource({});
    regionsDataSource.data(data);
    $('#areasCategory').kendoMobileListView({
        template : '<label style="background-color:white !important;">'+'# if (selectionFlag) { #<input id="region_id_#:region.regionId#" type="checkbox" onclick="changeRegionArea(this)" checked name="#:region.name#" value="#:selectionFlag#"># }'
                                +'else{ #<input id="region_id_#:region.regionId#" type="checkbox" onclick="changeRegionArea(this)" name="#:region.name#" value="#:selectionFlag#"># }#'+' #:region.name#</label>',
        dataSource: regionsDataSource
	});
}

function populateRegionsDataTab(data){
    
    var regionsDataSourceTab = new kendo.data.DataSource({});
    regionsDataSourceTab.data(data);
    $('#areasCategoryTab').kendoMobileListView({
        template : '<label style="background-color:white !important;">'+'# if (selectionFlag) { #<input id="region_id_tab_#:region.regionId#" type="checkbox" onclick="changeRegionArea(this)" checked name="#:region.name#" value="#:selectionFlag#"># }'
                                +'else{ #<input id="region_id_tab_#:region.regionId#" type="checkbox" onclick="changeRegionArea(this)" name="#:region.name#" value="#:selectionFlag#"># }#'+' #:region.name#</label>',
        dataSource: regionsDataSourceTab
	});
    $('#headerTag').text('Areas');
}

function populateStatesData(data){
    var statesDataSource = new kendo.data.DataSource({});
    statesDataSource.data(data);
    $('#areasCategory').kendoMobileListView({
        template : '<label style="background-color:white !important;">'+'# if (selectionFlag) { #<input id="state_id_#:state.stateCode#" type="checkbox" onclick="changeStateArea(this)" checked name="#:state.stateName#" value="#:selectionFlag#"># }'
                                +'else{ #<input id="state_id_#:state.stateCode#" type="checkbox" onclick="changeStateArea(this)" name="#:state.stateName#" value="#:selectionFlag#"># }#'+' #:state.stateName#</label>',
        dataSource: statesDataSource
	});
}

function populateStatesDataTab(data){
    var statesDataSourceTab = new kendo.data.DataSource({});
    statesDataSourceTab.data(data);
    $('#areasCategoryTab').kendoMobileListView({
        template : '<label style="background-color:white !important;">'+'# if (selectionFlag) { #<input id="state_id_tab_#:state.stateCode#" type="checkbox" onclick="changeStateArea(this)" checked name="#:state.stateName#" value="#:selectionFlag#"># }'
        	                         +'else{ #<input id="state_id_tab_#:state.stateCode#" type="checkbox" onclick="changeStateArea(this)" name="#:state.stateName#" value="#:selectionFlag#"># }#'+' #:state.stateName#</label>',
        dataSource: statesDataSourceTab
	});
    $('#headerTag').text('Areas');
}

function changeRegionArea(currentobj){
         var portrait = false;
         if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                                var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                                if (screenOrientation == 90) {
                                    portrait = true;
                                }
         }else{
             portrait = false;
         }
    var tempChecked = $("#"+currentobj.id).prop("checked");
     if (isOnline()) {
         
        
         var prev_re = new Date();
         var regionsSelectedCount = 0;
         if(allRegionsData == null){
              allRegionsData = JSON.parse(localStorage.getItem("AllRegionsData"));
         }
         allRegionsDataPrev = JSON.parse(localStorage.getItem("AllRegionsData"));
         if(currentobj.name == "All"){
              if(portrait == true){
                   jQuery.each(allRegionsData, function() {
                         $("#region_id_tab_"+this.region.regionId).prop("checked",$("#"+currentobj.id).prop("checked"));
                         this.selectionFlag = $("#"+currentobj.id).prop("checked");
                     });
              }else{
                   jQuery.each(allRegionsData, function() {
                         $("#region_id_"+this.region.regionId).prop("checked",$("#"+currentobj.id).prop("checked"));
                         this.selectionFlag = $("#"+currentobj.id).prop("checked");
                     });
              }
                     
              if($("#"+currentobj.id).prop("checked") == false){
                    allRegionsDeselected = true; 
              } else{
                    allRegionsDeselected = false; 
              }
         }else{
              if(portrait == true){
                  jQuery.each(allRegionsData, function() {
                         if(currentobj.name == this.region.name || ( this.region.name == "All" && $("#"+currentobj.id).prop("checked") == false ) ){
                             this.selectionFlag = $("#"+currentobj.id).prop("checked");
                             $("#region_id_tab_"+this.region.regionId).prop("checked",$("#"+currentobj.id).prop("checked"));
                         }
                         if($("#region_id_tab_"+this.region.regionId).prop("checked") == true){
                             regionsSelectedCount++;
                         }
                     });
              }else{
                  jQuery.each(allRegionsData, function() {
                         if(currentobj.name == this.region.name || ( this.region.name == "All" && $("#"+currentobj.id).prop("checked") == false ) ){
                             this.selectionFlag = $("#"+currentobj.id).prop("checked");
                             $("#region_id_"+this.region.regionId).prop("checked",$("#"+currentobj.id).prop("checked"));
                         }
                         if($("#region_id_"+this.region.regionId).prop("checked") == true){
                             regionsSelectedCount++;
                         }
                     });
              }
                     
              if(regionsSelectedCount < 1) {
                  allRegionsDeselected = true; 
              }else{
                    allRegionsDeselected = false;
              }
         }
         if(allRegionsDeselected == true){
              allRegionsDeselected_prev = allRegionsDeselected;
              previousRegionToUpdate = currentobj;
         } 
         else if(allRegionsDeselected == false ){
              if(allRegionsDeselected_prev == true){
                  setTimeout(function(){
                      updateUserActionOnRegionSelection(currentobj,previousRegionToUpdate); 
                  },50);
              }else{
                  setTimeout(function(){
                       updateUserActionOnRegionSelection(null,currentobj); 
                  },50);
              }
              localStorage.setItem("AllRegionsData",JSON.stringify(allRegionsData));
              allRegionsDeselected_prev = false; 
         }
          
         var new_re = new Date();
     }else{
          navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
          $("#"+currentobj.id).prop("checked",!tempChecked);
         
     }
}

function changeStateArea(currentobj){
    var tempChecked = $("#"+currentobj.id).prop("checked");
  
    var portrait = false;
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
        if (screenOrientation == 90) {
            portrait = true;
        }
    }else{
         portrait = false;
    }
    if(isOnline()){

        var statesSelectedCount = 0;
        if(allStatesData==null){
                allStatesData =  JSON.parse(localStorage.getItem("AllStatesData"));
        }
        allStatesDataPrev = JSON.parse(localStorage.getItem("AllStatesData"));
   		 if(currentobj.name == "All"){
             if(portrait==true){
                     jQuery.each(allStatesData, function() {
                         $("#state_id_tab_"+this.state.stateCode).prop("checked",$("#"+currentobj.id).prop("checked"));
                         this.selectionFlag = $("#"+currentobj.id).prop("checked");
                     });
             }else{
                    jQuery.each(allStatesData, function() {
                         $("#state_id_"+this.state.stateCode).prop("checked",$("#"+currentobj.id).prop("checked"));
                         this.selectionFlag = $("#"+currentobj.id).prop("checked");
                     });
             }
                    
                     if($("#"+currentobj.id).prop("checked") == false){
                         allStatesDeselected = true; 
                     }else{
                         allStatesDeselected = false; 
                     }
          }else{
              if(portrait==true){
                    jQuery.each(allStatesData, function() {
                         if(currentobj.name == this.state.stateName || ( this.state.stateName == "All" && $("#"+currentobj.id).prop("checked") == false ) ){
                             this.selectionFlag = $("#"+currentobj.id).prop("checked");
                             $("#state_id_tab_"+this.state.stateCode).prop("checked",$("#"+currentobj.id).prop("checked"));
                         }
                         if($("#state_id_tab_"+this.state.stateCode).prop("checked") == true){
                             statesSelectedCount++;
                         }
                     });
              }else{
                    jQuery.each(allStatesData, function() {
                         if(currentobj.name == this.state.stateName || ( this.state.stateName == "All" && $("#"+currentobj.id).prop("checked") == false ) ){
                             this.selectionFlag = $("#"+currentobj.id).prop("checked");
                             $("#state_id_"+this.state.stateCode).prop("checked",$("#"+currentobj.id).prop("checked"));
                         }
                         if($("#state_id_"+this.state.stateCode).prop("checked") == true){
                             statesSelectedCount++;
                         }
                     });
              }
              if(statesSelectedCount < 1) {
                  allStatesDeselected = true; 
              } else{
                    allStatesDeselected = false;
              }
          }
          if(allStatesDeselected == true){
                  allStatesDeselected_prev = allStatesDeselected;
                  previousStateToUpdate = currentobj;
          } else if(allStatesDeselected == false){
                  if(allStatesDeselected_prev == true){
                      setTimeout(function(){
                         updateUserActionOnStateSelection(currentobj,previousStateToUpdate);    
                      },50);
                  }
                  else{
                        setTimeout(function(){
                            updateUserActionOnStateSelection(null,currentobj);
                        },50);
               	  }
                  localStorage.setItem("AllStatesData",JSON.stringify(allStatesData));
                  allStatesDeselected_prev = false;
           }
    }else{
         navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
         $("#"+currentobj.id).prop("checked",!tempChecked);
    }
}

function updateUserActionOnRegionSelection(secondObjToUpdate,firstObjToUpdate){
    
     var portrait = false;
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                            var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                            if (screenOrientation == 90) {
                                portrait = true;
                            }
    }else{
         portrait = false;
    }
    var regionId = "";
    if(portrait==false){
        regionId = Number(firstObjToUpdate.id.substring(10,firstObjToUpdate.id.length));
    }else{
        regionId = Number(firstObjToUpdate.id.substring(14,firstObjToUpdate.id.length));
    }
    
    var deviceuuid = localStorage.getItem("deviceuuId");
    var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateSelectedRegion';
    
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
              "selectionFlag":$("#"+firstObjToUpdate.id).prop("checked"),
              "region":{
                  "name":firstObjToUpdate.name,
                  "regionId":regionId,
              }
        }),
        success: function (data) {
            if(data.success){
                if(secondObjToUpdate == null){
                }else if(secondObjToUpdate !=null){
                    updateUserActionOnRegionSelection(null,secondObjToUpdate);
                }
            }else{
                resetRegionsDataOnError(firstObjToUpdate,secondObjToUpdate,portrait);
            }
            window.plugins.spinnerDialog.hide();
        },
        error: function (r, s, e) {
			resetRegionsDataOnError(firstObjToUpdate,secondObjToUpdate,portrait);
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
function resetRegionsDataOnError(firstObjToUpdate,secondObjToUpdate, portrait){
     var tempObject = (secondObjToUpdate==null)?firstObjToUpdate: secondObjToUpdate;
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                var tempChecked = $("#"+tempObject.id).prop("checked");
                $("#"+tempObject.id).prop("checked",!tempChecked);
               
                localStorage.setItem("AllRegionsData",JSON.stringify(allRegionsDataPrev)); 
                if(portrait == true){
                     jQuery.each(allRegionsDataPrev, function() {
                            $("#region_id_tab_"+this.region.regionId).prop("checked",this.selectionFlag);
                            $("#region_id_tab_"+this.region.regionId).prop("value",this.selectionFlag);
                     });
                }else{
                     jQuery.each(allRegionsDataPrev, function() {
                            $("#region_id_"+this.region.regionId).prop("checked",this.selectionFlag);
                            $("#region_id_"+this.region.regionId).prop("value",this.selectionFlag);
                     });
                }
}
function resetStatesDataOnError(firstObjToUpdate,secondObjToUpdate, portrait){
                var tempObject = (secondObjToUpdate==null)?firstObjToUpdate: secondObjToUpdate;
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                var tempChecked = $("#"+tempObject.id).prop("checked");
                $("#"+tempObject.id).prop("checked",!tempChecked);
                localStorage.setItem("AllStatesData", JSON.stringify(allStatesDataPrev));
                if(portrait == true){
                     jQuery.each(allStatesDataPrev, function() {
                            $("#state_id_tab_"+this.state.stateCode).prop("checked",this.selectionFlag);
                            $("#state_id_tab_"+this.state.stateCode).prop("value",this.selectionFlag);
                     });
                }else{
                     jQuery.each(allStatesDataPrev, function() {
                            $("#state_id_"+this.state.stateCode).prop("checked",this.selectionFlag);
                            $("#state_id_"+this.state.stateCode).prop("value",this.selectionFlag);
                     });
                }
}
function updateUserActionOnStateSelection(secondObjToUpdate,firstObjToUpdate){
    var portrait = false;
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
            var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
            if (screenOrientation == 90) {
                portrait = true;
            }
    }else{
            portrait = false;
    }
    var stateId = "";
    if(portrait==false){
        stateId = firstObjToUpdate.id.substring(9,firstObjToUpdate.id.length);
    }else{
        stateId = firstObjToUpdate.id.substring(13,firstObjToUpdate.id.length);
    }
    var deviceuuid = localStorage.getItem("deviceuuId");
    var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateSelectedState';
    
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
              "selectionFlag":$("#"+firstObjToUpdate.id).prop("checked"),
              "state":{
                  "stateCode":stateId,
                  "stateName":firstObjToUpdate.name,
              }
        }),
        success: function (data) {
            if(data.success){
                if(secondObjToUpdate == null){
                }else if(secondObjToUpdate !=null){
                    updateUserActionOnStateSelection(null,secondObjToUpdate);
                }
            }else{
                resetStatesDataOnError(firstObjToUpdate,secondObjToUpdate, portrait);
            }
            window.plugins.spinnerDialog.hide();
        },
        error: function (r, s, e) {
            resetStatesDataOnError(firstObjToUpdate,secondObjToUpdate, portrait);
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


function changeEPArea(currentobj) {
    var landScapeMode = false;
      if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                    var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                    if (screenOrientation == 90) {
                               landScapeMode = true;
                    }
      }
    var allAreasData = JSON.parse(localStorage.getItem("AllAreasData"));
    var area_id_prefix = (landScapeMode==true)?"area_tab_" : "area_";
    if(isOnline()){
         var selectedArea = null;    
         allRegionsDeselected = false;
         allStatesDeselected = false;
    
         jQuery.each(allAreasData, function() {
             var checkedValue = $("#"+currentobj.id).prop("checked");
          
             if(currentobj.id == area_id_prefix+this.id){
                
                 this.selectionFlag = checkedValue;
                
                 $("#"+area_id_prefix+this.id).prop("checked",checkedValue);
                 $("#"+area_id_prefix+this.id).val(checkedValue);
                 if(checkedValue == true){
                     selectedArea = this ;
                     if(this.id == "region"){
                         localStorage.setItem("AreaSelected","region");
                     }else if(this.id == "state"){
                         localStorage.setItem("AreaSelected","state");
                     }
                 }
             }else{
                
                 this.selectionFlag = (!checkedValue);
               
                 $("#"+area_id_prefix+this.id).prop("checked",(!checkedValue));
                 $("#"+area_id_prefix+this.id).val(!checkedValue);
                 if(checkedValue == false){
                      selectedArea = this;
                      if(this.id == "region"){
                         localStorage.setItem("AreaSelected","region");
                      }else if(this.id == "state"){
                         localStorage.setItem("AreaSelected","state");
                      }
                 }
             }
         });
        localStorage.setItem("AllAreasData",JSON.stringify(allAreasData)); 
        setTimeout(function(){
            checkAreaSelectedAndDisplay();
            updateUserActionOnAreaSelection();  
        },50); 
    }else{
        navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
         jQuery.each(allAreasData, function() {
             if(localStorage.getItem("AreaSelected") == this.id){
                   $("#"+area_id_prefix+this.id).prop("checked",true);
             }else{
                  $("#"+area_id_prefix+this.id).prop("checked",false);
             }
         });
    }
 
}

function checkAreaSelectedAndDisplay(){
      var landScapeMode = false;
      if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                    var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                    if (screenOrientation == 90) {
                               landScapeMode = true;
                    }
      }
     var allRegionsData = JSON.parse(localStorage.getItem("AllRegionsData"));
     var allStatesData = JSON.parse(localStorage.getItem("AllStatesData"));
     var areaSelected = localStorage.getItem("AreaSelected");
     var allAreasData =  JSON.parse(localStorage.getItem("AllAreasData"));
    
   		 
     if(areaSelected == null || areaSelected == undefined || areaSelected == 'null'){
         
         jQuery.each(allAreasData, function() {
             if(this.selectionFlag){
                 localStorage.setItem("AreaSelected",this.id);
                 areaSelected = localStorage.getItem("AreaSelected");
             }
         });
     }
     if(areaSelected == "region"){
          if(landScapeMode == true){
               $('#epStateTextLandTab').hide();
               $('#areaHeadingTab').text("SELECT REGIONS/ZONES");
          }else{
               $('#epStateText').hide();
               $('#areaHeading').text("SELECT REGIONS/ZONES");
          }
          if( allRegionsData == undefined || allRegionsData == null || allRegionsData == 'null'){
                getAllRegionsAndPopulate();
          }else{
               if(landScapeMode == true){
                   populateRegionsDataTab(allRegionsData);
                    
               }else{
                   populateRegionsData(allRegionsData);
               }
                
          }
     }else if(areaSelected == "state"){
        if(landScapeMode == true){
             $('#epStateTextLandTab').show();
             $('#areaHeadingTab').text("SELECT STATES");
        }else{
             $('#epStateText').show();
             $('#areaHeading').text("SELECT STATES");
        }
       
        if(allStatesData==undefined || allStatesData == null || allStatesData == 'null'){
                getAllStatesAndPopulate();
       	}else{
            if(landScapeMode == true){
                populateStatesDataTab(allStatesData);
            }else{
                populateStatesData(allStatesData);
            }
                
        }
     }
}

function regionOKButton(){ 
    var regionsPopupDiv = $("#regionsPopup");
    regionsPopupDiv.data("kendoWindow").close();
}
         
function updateUserActionOnAreaSelection(){
    var deviceuuid = localStorage.getItem("deviceuuId");
    var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateSelectedArea';
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
              "areaSelected" : localStorage.getItem("AreaSelected")
        }),
        success: function (data) {
            if(data.success == false){
                navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
                jQuery.each(allAreasData, function() {
                    if(localStorage.getItem("AreaSelected") == this.id){
                        $("#"+area_id_prefix+this.id).prop("checked",true);
                    }else{
                        $("#"+area_id_prefix+this.id).prop("checked",false);
                    }
                });
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
            window.plugins.spinnerDialog.hide();
        },
        beforeSend: function () {},
        complete: function (data) {}
    });
}

function backToEPAlerts(){
    if(runningPage == 17){
        if(allRegionsDeselected == true || allStatesDeselected == true){
            if(allRegionsDeselected == true){
                 displayRegionSelectionNeededPopup();
            }else{
                 navigator.notification.alert("You must select at least one State.", null, "Warning", "OK");
            }
        }else{
             app.navigate("components/more/alerts/epAlerts/epAlerts.html", "slide:right");
        }
    }
}

function displayRegionSelectionNeededPopup(){
                $("#regionsPopup").html("");
                $("#regionsPopup").html("<div id='upper' style='height:66.5%; '> " +
                    "<div style='padding-top:18px;font-size:25px;color:black;'><h6 style='-webkit-margin-before: 0.25em !important;-webkit-margin-after: 0.30em !important;text-align:center;'>Warning</h6></div>" +
                    "<span style='display:block;padding:3px;font-size:14px;color:black;text-align:center;'>You must select at least one Region/Zone.</span>" +
                    "</div>" +
                    "<div id='lower' style='height:33.5%;'>" +
                    "<div style='border-top: 1px solid #DCDFE1;padding-top:2PX;'></div>" +
                    "<div style='padding-top:11px;padding-bottom:5px;font-size: 17px !important;text-align:center;' onclick='regionOKButton()'>" +
                    "<a id='regionOKButton' style='color:#007aff !important;'>OK</a>" +
                    "</div>" +
                    "</div>"
                );
                var regionsPopupDiv = $("#regionsPopup");
                regionsPopupDiv.kendoWindow({
                    title: false,
                    draggable: false,
                    modal: true,
                    resizable: false,
                    scrollable: false,
                    pinned: false,
                    animation: false,
                    autoFocus: false,
                    iframe: true,
                    position: 'fixed'
                });
                var win1 = regionsPopupDiv.data("kendoWindow");
                win1.setOptions({
                    width: '300px',
                    height: '140px'
                });
                win1.center().open();
}




