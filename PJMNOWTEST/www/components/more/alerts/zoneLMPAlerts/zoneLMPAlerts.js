function zoneLMPAlertsInit(){
    displayAllZoneLMPAlertsStatus();
}

function displayAllZoneLMPAlertsStatus() {
    var notificationDetails = localStorage.getItem("notificationDetails");
    notificationsObj = JSON.parse(notificationDetails);
    var zoneLMPArray = localStorage.getItem("sortableZoneArray");
    var sortableIncludeDiv = "";
    var sortableExcludeDiv = "";
    if (typeof zoneLMPArray === 'undefined' || zoneLMPArray === null) {
        for (var i = 0; i < notificationsObj.length; i++) {
            if (notificationsObj[i].allowNotifications == 'On') {
                var upperThresholdValue = notificationsObj[i].LMPValue;
                var lowerThresholdValue = notificationsObj[i].lowerThresholdValue;
                var upperTextColor = "";
                var lowerTextColor = "";
                if( upperThresholdValue == "None"){
                    upperTextColor = "#7A838C";
                }else if (upperThresholdValue >= 0) {
                    upperThresholdValue = "$" + upperThresholdValue + ".00";
                    upperTextColor = "#000";
                } 
                if (lowerThresholdValue == "None") {
                    lowerTextColor = "#7A838C";
                }else if (lowerThresholdValue >= 0) {
                    lowerThresholdValue = "$" + lowerThresholdValue + ".00";
                    lowerTextColor = "#000";
                } 
                sortableIncludeDiv = sortableIncludeDiv + 
                                "<li id=" + notificationsObj[i].zoneName + " class='notificationDiv'>"+
                                    "<a class='includeDiv' data-role='button' style='height:44px;border-style: none;font-family:HelveticaNeue !important;font-size:17px !important;' data-id='" + i + "' data-user=" + notificationsObj[i].zoneName + " href =                                                                                          'components/more/alerts/zoneLMPAlerts/IndividualNotification/individualNotifications.html' >"+
                                        "<div style='float:left;' class='zone-lmp-name1'>" + notificationsObj[i].zoneName + "</div>"+
                                        "<div class='grayarrowdiv' align='right' style='float:right;margin-top:0%;'>"+
                                            "<div class='lmpvaluediv' style='line-height: 16px !important;width:100%;margin-top:0%;float:right;margin-right:58px;font-family:HelveticaNeue;font-size:12px;'>"+
                                                "<div style='float:left;width:100%;'><div style='float:left;width:50%;'>Upper: </div><div id='upperText' style='float:right;text-align: right;width:50%;color:"+upperTextColor +" !important;'>"+upperThresholdValue+"</div></div>"+
                                                "<div style='float:left;width:100%;'><div style='float:left;width:50%;'>Lower: </div><div id='lowerText' style='float:right;text-align: right;width:50%;color:"+lowerTextColor +" !important;'>"+lowerThresholdValue+"</div></div>"+
                                            "</div>"+
                                            "<div class='imagediv' style='width:0%;margin-right:19%'>"+
                                                "<img width='9px' height='15px' src='styles/images/gray_arrow.png'/>"+
                                            "</div>"+
                                        "</div>"+
                                    "</a>"+
                                "</li>";
            } else {
                sortableExcludeDiv = sortableExcludeDiv +
                                "<li id=" + notificationsObj[i].zoneName + " class='notificationDiv'>"+
                                    "<a class='includeDiv' data-role='button' style='height:44px;border-style: none;font-family:HelveticaNeue !important;font-size:17px !important;' data-id='" + i + "' data-user=" + notificationsObj[i].zoneName +
                                        " href = 'components/more/alerts/zoneLMPAlerts/IndividualNotification/individualNotifications.html' >"+
                                        "<div style='float:left;' class='zonelmpname'>" + notificationsObj[i].zoneName + "</div>"+
                                        "<div class='grayarrowimg' style='float:right;margin-top:1%;'>"+
                                            "<img width='9px' height='15px' src='styles/images/gray_arrow.png'/>"+
                                        "</div>"+
                                    "</a>"+
                                "</li>";
            }
        }
    } 
    else {
        var tempZoneLMPArray = JSON.parse(zoneLMPArray);
        for (var k = 0; k < tempZoneLMPArray.length; k++) {
            for (var i = 0; i < notificationsObj.length; i++) {
                if (tempZoneLMPArray[k].Zone_LMP == notificationsObj[i].zoneName) {
                    if (notificationsObj[i].allowNotifications == 'On') {
                        var upperThresholdValue = notificationsObj[i].LMPValue;
                        var lowerThresholdValue = notificationsObj[i].lowerThresholdValue;
                        var upperTextColor = "";
                        var lowerTextColor = "";
                        if( upperThresholdValue == "None"){
                            upperTextColor = "#7A838C";
                        }else if (upperThresholdValue >= 0) {
                            upperThresholdValue = "$" + upperThresholdValue + ".00";
                            upperTextColor = "#000";
                        } 
                        if (lowerThresholdValue == "None") {
                            lowerTextColor = "#7A838C";
                        }else if (lowerThresholdValue >= 0) {
                            lowerThresholdValue = "$" + lowerThresholdValue + ".00";
                            lowerTextColor = "#000";
                        } 
                        sortableIncludeDiv = sortableIncludeDiv + "<li id=" + notificationsObj[i].zoneName 
                            + " class='notificationDiv'><a class='includeDiv' data-role='button' style='height:44px;border-style: none;font-family:HelveticaNeue !important;font-size:17px !important;data-id='" 
                            + i + "' data-user=" + notificationsObj[i].zoneName + " href = 'components/more/alerts/zoneLMPAlerts/IndividualNotification/individualNotifications.html'>"
                            +"<div style='float:left;' class='zone-lmp-name1'>" + notificationsObj[i].zoneName + "</div>"+
                             "<div class='grayarrowdiv' align='right' style='float:right;margin-top:0%;'>"+
                                        "<div class='lmpvaluediv' style='line-height: 16px !important;width:100%;margin-top:0%;float:right;margin-right:58px;font-family:HelveticaNeue;font-size:12px;'>"+
                                            "<div style='float:left;width:100%;'><div style='float:left;width:50%;'>Upper: </div><div id='upperText' style='float:right;text-align: right;width:50%;color:"+upperTextColor +" !important;'>"+upperThresholdValue+"</div></div>"+
                                            "<div style='float:left;width:100%;'><div style='float:left;width:50%;'>Lower: </div><div id='lowerText' style='float:right;text-align: right;width:50%;color:"+lowerTextColor +" !important;'>"+lowerThresholdValue+"</div></div>"+
                                        "</div>"+
                                        "<div class='imagediv' style='width:0%;margin-right:19%'>"+
                                            "<img width='9px' height='15px' src='styles/images/gray_arrow.png'/>"+
                                        "</div>"+
                            "</div></a></li>";
                    } else {
                        sortableExcludeDiv = sortableExcludeDiv + "<li id=" + notificationsObj[i].zoneName + " class='notificationDiv'>"+
                            "<a class='includeDiv' data-role='button' style='height:44px;border-style: none;font-family:HelveticaNeue !important;font-size:17px !important;' data-id='"+ i + "' data-user=" + notificationsObj[i].zoneName 
                                + " href = 'components/more/alerts/zoneLMPAlerts/IndividualNotification/individualNotifications.html'>"+
                                    "<div style='float:left;' class='zonelmpname'>" + notificationsObj[i].zoneName + "</div>"+
                                    "<div class='grayarrowimg' style='float:right;margin-top:1%;'>"+
                                        "<img width='9px' height='15px' src='styles/images/gray_arrow.png'/>"+
                                    "</div>"+
                            "</a></li>";
                    }
                }
            }
        }
    }
    var LMPListIncludeDiv = document.getElementById("notificationsIncludeLMPList");
    if (sortableIncludeDiv == '') {
        LMPListIncludeDiv.innerHTML = "";
        $('#includeNone').show();
    } else {
        LMPListIncludeDiv.innerHTML = "";
        LMPListIncludeDiv.innerHTML = LMPListIncludeDiv.innerHTML + sortableIncludeDiv;
        $('#includeNone').hide();
    }
    var LMPListExcludeDiv = document.getElementById("notificationsExcludeLMPList");
    if (sortableExcludeDiv == '') {
        LMPListExcludeDiv.innerHTML = "";
        $('#excludeNone').show();
    } else {
        LMPListExcludeDiv.innerHTML = "";
        LMPListExcludeDiv.innerHTML = LMPListExcludeDiv.innerHTML + sortableExcludeDiv;
        $('#excludeNone').hide();
    }
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        $(".includeDiv").css("width", "104%");
        $('.LMPTextdiv').css('margin-left', '2.5%');
        $('.lmpvaluediv').css('margin-top', '-2%');
        $('.grayarrowdiv').css('margin-top', '0.3%');
        $('.grayarrowimg').css('margin-top', '0.3%');
        $('.zone-lmp-name1').css('width', '87%');
        $('.grayarrowdiv').css('width', '13%');
        $('.zonelmpname').css('width', '97.5%');
        $('.grayarrowimg').css('width', '2.5%');
    } else {
        $(".includeDiv").css("width", "109%");
        $('.LMPTextdiv').css('margin-left', '4.5%');
        $('.zone-lmp-name1').css('margin-top', '0.8%');
        $('.zonelmpname').css('margin-top', '0.8%');
        $('.lmpvaluediv').css('margin-top', '-7px');
        $('.grayarrowdiv').css('margin-top', '3px');
        if (device.platform == 'android' || device.platform == 'Android') {
            $('.grayarrowimg').css('margin-top', '6px');
        } else {
            $('.grayarrowimg').css('margin-top', '2px');
        }
        $('.zone-lmp-name1').css('width', '70%');
        $('.grayarrowdiv').css('width', '30%');
        $('.zonelmpname').css('width', '94%');
        $('.grayarrowimg').css('width', '6%');
    }
}
function setPhoneZoneLMPTitle(e) {
    runningPageChange(12);
    var data = e.item.attr('id');
    if (data == 'WESTERN') {
        myTitle = "WESTERN HUB";
    } else {
        myTitle = data;
    }
    try {
        displayIndividualZoneLMPValues();
    } catch (e) {}
}
displayAllZoneLMPAlertsStatus();

$("#notificationsIncludeLMPList").addClass('notificationLMPList');
$("#notificationsExcludeLMPList").addClass('notificationLMPList');

if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
    $("#includeNone > div").css("margin-left","2.5%");
}

function navigateFromZoneLMPAlertsToAlerts() {
        runningPageChange(9);
        alertsService.displayAlertsStatus();
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
}