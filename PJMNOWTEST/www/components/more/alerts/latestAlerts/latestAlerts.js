if (window.DeviceOrientationEvent) {
    window.addEventListener("resize", function () {
        var landScapeView = false;
        if(getPageName(runningPage)=="ViewLatestAlerts"){
            if(isiPadPro(device.model) || kendo.support.mobileOS.tablet){
                var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                if (screenOrientation == 90) {
                    landScapeView = true;
                }
            }
            $("div.relative").css("height","81vh");
            if(landScapeView == true){
                showLatestAlertsPage();
            }
        }
    },false);
}
$('.LMPSmallText').css('word-wrap','break-word');
function navigateFromLatestAlertsToAlerts() {
    setTimeout(function(){
        runningPageChange(9);
            var epBadge = localStorage.getItem("EPBadge");
            if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                $('#latestAlertsTextDiv').css('width','87%');
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
    },500);
}
var globalScroller ;
function latestAlertsInit(e) {
    try{
        var scroller = e.view.scroller;
        globalScroller =  e.view.scroller;
        scroller.bind("scroll", function (e) {
             if (e.scrollTop < 0) {
                scroller.reset();
                e.preventDefault();
             }
        });
        scroller.setOptions({
            pullToRefresh: true,
            messages: {
                pullTemplate: "",
                releaseTemplate: function () {
                    $(".km-scroller-pull").remove();
                },
                refreshTemplate: function () {
                    $(".km-scroller-pull").remove();
                }
            },
            pull: function () {
                if (isiPadPro(device.model) || kendo.support.mobileOS.tablet && ($(window).width() > $(window).height()) ? 90 : 0 == 90) {
                    e.preventDefault();
                } else {
                    $(".km-scroller-pull").remove();
                    setTimeout(function () {
                        scroller.pullHandled();
                        $("#updateLatestAlerts").css("display", "none");
                    }, 100);
                }
            },
        })
    }catch(e){
        alert("latestAlertsInit Exception: "+e);
    }
}
function clearBadgeCount() {
    var count = 0; 
    setTimeout(function () {
         try{
             if($('div.km-footer div.km-widget.km-tabstrip a:nth-child(1)').attr("class").split(' ').indexOf("km-state-active") == -1){
                count++;          
            }
            if($('div.km-footer div.km-widget.km-tabstrip a:nth-child(5)').attr("class").split(' ').indexOf("km-state-active") == -1){
                count++;          
            }
            if(count==0){
                $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-text').css("color","#2984B3"); 
            }
         }catch(e){}
     },50);
    dbapp.retrieveEmergencyProcedure();
    var tempEPData = dbapp.emergencyProcedureData;
    if((device.platform == 'Android' || device.platform == 'android')){
        $('#markAllAsReadAnchorId').css('vertical-align','bottom');
        $('#markAllAsUnreadAnchorId').css('vertical-align','bottom');
    }
    if(tempEPData == null || tempEPData ==  undefined || jQuery.isEmptyObject(tempEPData)){
          $('.relative').css('height',$(window).height()-130);
          $('#mark').hide();
          $('#noAlertDiv').show();
    }else{
          loadViewLatestAlerts(tempEPData);
    }
}
function markAllByFlag(checked){
    try {
        window.plugins.spinnerDialog.show();
    } catch (error) {}
    if (!isOnline()) {
            navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
            try {
                    window.plugins.spinnerDialog.hide();
            } catch (error) {}
    }else{
        updateAllIsReadFlag(checked);
        try {
                window.plugins.spinnerDialog.hide();
        } catch (error) {}
        jQuery.each(dbapp.emergencyProcedureData.deviceEPDataList, function() {
            this.read= checked;
        });
        jQuery.each(dbapp.emergencyProcedureData.deviceSpecialMessageDataList, function() {
            this.read= checked;
        });
        var landScapeMode = false;
        if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                if (screenOrientation == 90) {
                        landScapeMode = true;
                }
        }
        if(landScapeMode){
            try {
                loadViewLatestAlertsTab(dbapp.emergencyProcedureData);
            } catch (e) {}
        }else{
            loadViewLatestAlerts(dbapp.emergencyProcedureData);
        }
        dbapp.updateDataEmergencyProcedure(dbapp.emergencyProcedureData);
    }
}
function markAllAsRead(){
    markAllByFlag(true);
}
function markAllAsUnread(){
     markAllByFlag(false);
}
function updateAllIsReadFlag(isReadFlag){
    var deviceuuid = localStorage.getItem("deviceuuId");
     $.ajax({
                type: "POST",
                async: false,
                url: serviceIpAddress_PJM+"/pjm/rest/services/edatafeed/updateAllIsReadFlag",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Origin': 'file:///'
                },
                data: JSON.stringify({
                    "udid": deviceuuid,
                    "read": isReadFlag
                }),
                success: function (data) {
                    if(JSON.parse(data.success)==true){
                        var count = 0; 
                        if(isReadFlag == false){
                           count = dbapp.emergencyProcedureData.deviceEPDataList.length + dbapp.emergencyProcedureData.deviceSpecialMessageDataList.length;
                        }
                        localStorage.setItem("EPBadge",count);
                        badgeService.updateBadgeOnAppIcon(count);
                        badgeService.updateBadgeOnAlertsIcon(count);
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
                },
                beforeSend: function (xhr, settings) {},
                complete: function (data) {}
      });
}
function loadViewLatestAlerts(data) {
    try{
    var alertsdata = data;
    var alertsDiv = '';
    var commonArray=[];
    if(data == null 
        || data ==  undefined 
        || jQuery.isEmptyObject(data) 
        || (data!=null&&jQuery.isEmptyObject(data.deviceEPDataList)&&jQuery.isEmptyObject(data.deviceSpecialMessageDataList)) 
        || (jQuery.isEmptyObject(data.deviceEPDataList) == false && data.deviceEPDataList.length ==0) 
        ||(jQuery.isEmptyObject(data.deviceSpecialMessageDataList) == false && data.deviceSpecialMessageDataList.length ==0)){
        var viewAlertsdiv = document.getElementById("latestAlertsDiv");
        viewAlertsdiv.innerHTML = "";
        $('.relative').css('height',$(window).height()-130);
        $('#mark').hide();
        $('#noAlertDiv').show();
    }
    else{
        if(jQuery.isEmptyObject(alertsdata.deviceEPDataList)){
            commonArray = alertsdata.deviceSpecialMessageDataList;
        }else{
            commonArray = alertsdata.deviceEPDataList.concat(alertsdata.deviceSpecialMessageDataList);
        }
        commonArray.sort(function(a, b) {
            if (a.postedTimeStamp > b.postedTimeStamp)
                return -1;
            if (a.postedTimeStamp < b.postedTimeStamp)
                return 1;
            return 0;
        });
        if(commonArray.length > 0){
            $('#mark').show();
            $('#noAlertDiv').hide();
            for(var i = 0; i < commonArray.length; i++){
                    if(!jQuery.isEmptyObject(commonArray[i].emergencyMessage) && jQuery.isEmptyObject(commonArray[i].messageVO)){
                        alertsDiv = alertsDiv + "<li class='epDiv' style='width: 100%; list-style-type:none;padding-left: 0px !important;' id='"+commonArray[i].emergencyMessage.messageId+"'>"+
                                                    "<a class='latestEPAlertLink' data-role='button' href='components/more/alerts/latestAlerts/alertDetail/alertDetail.html' >";
                                if(isiPadPro(device.model) || kendo.support.mobileOS.tablet){
                                    if(commonArray[i].read == false){
                                        alertsDiv = alertsDiv + "<div style='width:3.5%;float: left;height: 40px;'><div class='unread_mes'></div></div>";
                                    }
                                    else{
                                        alertsDiv = alertsDiv + "<div style='width:3.5%;float: left;height: 40px;'></div>"; 
                                    }
                                    alertsDiv = alertsDiv +  "<div class='epAlertHeaderLeftDivTabPor'>";
                                }
                                else{
                                    if(commonArray[i].read == false){
                                        alertsDiv = alertsDiv + "<div style='width:6.5%;float: left;height: 40px;'><div class='unread_mes'></div></div>";
                                    }
                                    else{
                                        alertsDiv = alertsDiv + "<div style='width:6.5%;float: left;height: 40px;'></div>";  
                                    }
                                    alertsDiv = alertsDiv +  "<div class='epAlertHeaderLeftDiv'>";
                                }
                                    alertsDiv = alertsDiv +  "<div id='epMessageType'>"+
                                                                        commonArray[i].emergencyMessage.messageType+
                                                                "</div>"+
                                                                "<div id='effectiveDateStr'>"+
                                                                        commonArray[i].emergencyMessage.issuedDateStr+
                                                                "</div>";
                            var text = toChangePAHtoPAI('type3');
                            if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                                    if(commonArray[i].emergencyMessage.pjmDrill&& commonArray[i].emergencyMessage.pahEnabled){
                                        alertsDiv = alertsDiv + "<div class='bannerTypeClass bannerBGColorPink' style='width: 353px !important;margin: auto;'><div id='bannerText'>Drill "+text+"  Trigger</div></div>";
                                    }
                                    else if(commonArray[i].emergencyMessage.pjmDrill){
                                        alertsDiv = alertsDiv + "<div class='bannerTypeClass bannerBGColorPink' style='width: 353px !important;margin: auto;'><div id='bannerText'>Drill</div></div>";
                                    }
                                    else if(commonArray[i].emergencyMessage.pahEnabled){
                                    alertsDiv = alertsDiv + "<div class='bannerTypeClass bannerBGColorYellow' style='width: 353px !important;margin: auto;'><div id='bannerText'>"+text+"  Trigger</div></div>";
                                    }
                            }else{
                                if(commonArray[i].emergencyMessage.pjmDrill&& commonArray[i].emergencyMessage.pahEnabled){
                                        alertsDiv = alertsDiv + "<div class='bannerTypeClass bannerBGColorPink' style='width: 100% !important;margin: auto;'><div id='bannerText'>Drill "+text+"  Trigger</div></div>";
                                    }
                                    else if(commonArray[i].emergencyMessage.pjmDrill){
                                        alertsDiv = alertsDiv + "<div class='bannerTypeClass bannerBGColorPink' style='width: 100% !important;margin: auto;'><div id='bannerText'>Drill</div></div>";
                                    }
                                    else if(commonArray[i].emergencyMessage.pahEnabled){
                                    alertsDiv = alertsDiv + "<div class='bannerTypeClass bannerBGColorYellow' style='width: 100% !important;margin: auto;'><div id='bannerText'>"+text+"  Trigger</div></div>";
                                    }
                            }
                            alertsDiv = alertsDiv + "</div>"+
                                                        "<div class='alertEPImg'>"+
                                                            "  <img width='15px' height='25px' src='styles/images/gray_arrow.png' />"+
                                                        "</div>"+
                                                        "<br style='clear: left;'/>"+
                                                    "</a>"+
                                                "</li>";         
                    }else if(jQuery.isEmptyObject(commonArray[i].emergencyMessage) && !jQuery.isEmptyObject(commonArray[i].messageVO)){
                        alertsDiv = alertsDiv + "<li class='epDiv' style='width: 100%; list-style-type:none;padding-left: 0px !important;' id='"+commonArray[i].messageVO.messageId+"'>"+
                                                    "<a class='latestEPAlertLink' data-role='button' href='components/more/alerts/latestAlerts/alertDetail/alertDetail.html' >";
                                if(isiPadPro(device.model) || kendo.support.mobileOS.tablet){
                                    if(commonArray[i].read == false){
                                        alertsDiv = alertsDiv + "<div style='width:3.5%;float: left;height: 40px;'><div class='unread_mes'></div></div>";
                                    }
                                    else{
                                        alertsDiv = alertsDiv + "<div style='width:3.5%;float: left;height: 40px;'></div>"; 
                                    }
                                    alertsDiv = alertsDiv +  "<div class='epAlertHeaderLeftDivTabPor'>";
                                }
                                else{
                                    if(commonArray[i].read == false){
                                        alertsDiv = alertsDiv + "<div style='width:6.5%;float: left;height: 40px;'><div class='unread_mes'></div></div>";
                                    }
                                    else{
                                        alertsDiv = alertsDiv + "<div style='width:6.5%;float: left;height: 40px;'></div>";  
                                    }
                                    alertsDiv = alertsDiv +  "<div class='epAlertHeaderLeftDiv'>";
                                }
                                    alertsDiv = alertsDiv +  "<div id='epMessageType'>"+
                                                                        commonArray[i].messageVO.messageTitle+
                                                                "</div>"+
                                                                "<div id='effectiveDateStr'>"+
                                                                        commonArray[i].messageVO.startDate+
                                                                "</div>";
                            if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                                    alertsDiv = alertsDiv + "<div class='bannerTypeClass bannerBGColorGreen' style='width: 353px !important;margin: auto;'><div id='bannerText'>Special Message</div></div>";
                            }else{
                                    alertsDiv = alertsDiv + "<div class='bannerTypeClass bannerBGColorGreen' style='width: 100% !important;margin: auto;'><div id='bannerText'>Special Message</div></div>";
                            }
                            alertsDiv = alertsDiv + "</div>"+
                                                        "<div class='alertEPImg'>"+
                                                            "  <img width='15px' height='25px' src='styles/images/gray_arrow.png' />"+
                                                        "</div>"+
                                                        "<br style='clear: left;'/>"+
                                                    "</a>"+
                                                "</li>"; 
                    }
                    var viewAlertsdiv = document.getElementById("latestAlertsDiv");
                        viewAlertsdiv.innerHTML = "";
                        viewAlertsdiv.innerHTML = viewAlertsdiv.innerHTML + alertsDiv;

                    $('#latestAlerts > div.km-content.km-widget.km-scroll-wrapper > div.km-scroll-container')
                         .css('transform', 'translate3d(0px, 0px, 0px) scale(1)');
                        
                     $('#latestAlerts > div.km-content.km-widget.km-scroll-wrapper > div.km-touch-scrollbar.km-vertical-scrollbar')
                         .css('transform', 'translate3d(0px, 0px, 0px) scale(1)');
                              
                   
            }
        }else{
                var viewAlertsdiv = document.getElementById("latestAlertsDiv");
                viewAlertsdiv.innerHTML = "";
                $('.relative').css('height',$(window).height()-130);
                $('#mark').hide();
                $('#noAlertDiv').show();
        }
    }
        try{
            setTimeout(()=>{
                window.plugins.spinnerDialog.hide();
            },50);
        } catch (error) {}
        setTimeout(()=>{
                globalScroller.reset();
                globalScroller.pullHandled();
                },100);
        
    }catch(e){
    }
 }
function clickOnAlert(e){
    var alertDetailId = e.item.attr('id');
    try {
       alertData = getAlertDetail(alertDetailId);
    } catch (e) {} 
}
function getAlertDetail(alertDetailId){
    var resultdata = {};
    var tempEPData = dbapp.emergencyProcedureData;
    if(jQuery.isEmptyObject(tempEPData.deviceEPDataList) == false){
        for (var index = 0; index < tempEPData.deviceEPDataList.length; index++) {
            var tempAlertData = tempEPData.deviceEPDataList[index];
            if (tempAlertData.emergencyMessage.messageId == alertDetailId.trim()) {
                alertDetailIndex = index;
                resultdata = tempAlertData;
                break;
            }
        }
    }
    if(jQuery.isEmptyObject(tempEPData.deviceSpecialMessageDataList) == false){
        for (var index = 0; index < tempEPData.deviceSpecialMessageDataList.length; index++) {
            var tempAlertData = tempEPData.deviceSpecialMessageDataList[index];
            if (tempAlertData.messageVO.messageId == alertDetailId.trim()) {
                alertDetailIndex = index;
                resultdata = tempAlertData;
                break;
            }
        }
    }
    return resultdata;
}