function showAlertDetail(){
    try {
        window.screen.lockOrientation('portrait');
    } catch (error) {}
    runningPageChange(15);
    var alertDetail = '';
    if(!jQuery.isEmptyObject(alertData.emergencyMessage) && jQuery.isEmptyObject(alertData.messageVO)){
            alertDetail = alertDetail + "<div id='alertDetailsDiv'>"+
                                        "<div id='alertDetailMessageType'>"+alertData.emergencyMessage.messageType+"</div>"+
                                        "<div id='alertDetailSmallText'>"+alertData.emergencyMessage.issuedDateStr+"</div>";
            if(jQuery.isEmptyObject(alertData.emergencyMessage.effectiveEndTimeStr)==false){
                alertDetail = alertDetail + "<div id='alertDetailSmallText'>Effective End: "+alertData.emergencyMessage.effectiveEndTimeStr+"</div>";
            }
                        alertDetail = alertDetail + "<div id='alertDetailSmallText'>Message ID: "+alertData.emergencyMessage.messageId+"</div>"+
                                                "<div id='alertDetailSmallText'>Priority: "+alertData.emergencyMessage.priority+"</div>"+
                                                "<div id='alertDetailMediumText'>Regions: "+alertData.emergencyMessage.commmaSeperatedRegions+"</div>"+
                                                "<div id='emptySpace' style='padding-top:8px !important;'></div>";
            
            if(isiPadPro(device.model) || kendo.support.mobileOS.tablet || (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet && Number($(window).width()) > 360)){
                    if(alertData.emergencyMessage.pjmDrill&& alertData.emergencyMessage.pahEnabled){
                                alertDetail = alertDetail + "<div class='bannerTypeClass bannerBGColorPink' style='width: 353px !important;margin: auto;'><div id='bannerText'>Drill Performance Assessment Hour Trigger</div></div>";
                    }
                    else if(alertData.emergencyMessage.pjmDrill){
                                alertDetail = alertDetail + "<div class='bannerTypeClass bannerBGColorPink' style='width: 353px !important;margin: auto;'><div id='bannerText'>Drill</div></div>";
                    }
                    else if(alertData.emergencyMessage.pahEnabled){
                                alertDetail = alertDetail + "<div class='bannerTypeClass bannerBGColorYellow' style='width: 353px !important;margin: auto;'><div id='bannerText'>Performance Assessment Hour Trigger</div></div>";
                    }    
            }else if(isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet && Number($(window).width()) <= 360){
                if(alertData.emergencyMessage.pjmDrill&& alertData.emergencyMessage.pahEnabled){
                                alertDetail = alertDetail + "<div class='bannerTypeClass bannerBGColorPink' style='width: 100% !important;margin: auto;'><div id='bannerText'>Drill Performance Assessment Hour Trigger</div></div>";
                    }
                    else if(alertData.emergencyMessage.pjmDrill){
                                alertDetail = alertDetail + "<div class='bannerTypeClass bannerBGColorPink' style='width: 100% !important;margin: auto;'><div id='bannerText'>Drill</div></div>";
                    }
                    else if(alertData.emergencyMessage.pahEnabled){
                                alertDetail = alertDetail + "<div class='bannerTypeClass bannerBGColorYellow' style='width: 100% !important;margin: auto;'><div id='bannerText'>Performance Assessment Hour Trigger</div></div>";
                    }  
            }
            alertDetail = alertDetail+"</div>"+
                                    "<div id='messageDiv'>"+
                                            alertData.emergencyMessage.message.replace("Additional Comments:", "</br></br>Additional Comments:")
                                    "</div>";
    }else if(jQuery.isEmptyObject(alertData.emergencyMessage) && !jQuery.isEmptyObject(alertData.messageVO)){
            alertDetail = alertDetail + "<div id='alertDetailsDiv'>"+
                                        "<div id='alertDetailMessageType'>"+alertData.messageVO.messageTitle+"</div>"+
                                        "<div id='alertDetailSmallText'>"+alertData.messageVO.startDate+"</div>";
            if(jQuery.isEmptyObject(alertData.messageVO.endDate)==false && alertData.messageVO.endDate !=null){
                alertDetail = alertDetail + "<div id='alertDetailSmallText'>Effective End: "+alertData.messageVO.endDate+"</div>";
            }
                        alertDetail = alertDetail + "<div id='alertDetailSmallText'>Message ID: "+alertData.messageVO.messageId+"</div>"+
                                                //   "<div id='alertDetailSmallText'>Priority: "+alertData.messageVO.priority+"</div>"+
                                                "<div id='alertDetailMediumText'>Regions: PJM-RTO</div>"+
                                                "<div id='emptySpace' style='padding-top:8px !important;'></div>";
            
            if(isiPadPro(device.model) || kendo.support.mobileOS.tablet || (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet && Number($(window).width()) > 360)){
                    alertDetail = alertDetail + "<div class='bannerTypeClass bannerBGColorGreen' style='width: 353px !important;margin: auto;'><div id='bannerText'>Special Message</div></div>";   
            }else if(isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet && Number($(window).width()) <= 360){
                    alertDetail = alertDetail + "<div class='bannerTypeClass bannerBGColorGreen' style='width: 100% !important;margin: auto;'><div id='bannerText'>Special Message</div></div>";
            }
            var sampleInput=alertData.messageVO.messageContent;
            var sampleOutput = [sampleInput.slice(0, sampleInput.indexOf(":")+3), "&#8203;", sampleInput.slice(sampleInput.indexOf(":")+3)].join('');
            var finalOutput = [sampleOutput.slice(0, sampleOutput.lastIndexOf(":")+3), "&#8203;", sampleOutput.slice(sampleOutput.lastIndexOf(":")+3)].join('');
            alertDetail = alertDetail+"</div>"+
                                    "<div id='messageDiv'>"+
                                        finalOutput;
                                    "</div>";
    }
    var alertDetailDiv = document.getElementById("alertDetailContainer");
    alertDetailDiv.innerHTML = "";
    alertDetailDiv.innerHTML = alertDetailDiv.innerHTML +  alertDetail;
    if (!isOnline()) {
        navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
        alertDetailIndex = -1;
    }else{
        if(alertData.read == false){
             alertData.read = true;
             if(!jQuery.isEmptyObject(alertData.emergencyMessage) && jQuery.isEmptyObject(alertData.messageVO)){
                 dbapp.emergencyProcedureData.deviceEPDataList[alertDetailIndex] = alertData;
             }else if(jQuery.isEmptyObject(alertData.emergencyMessage) && !jQuery.isEmptyObject(alertData.messageVO)){
                 dbapp.emergencyProcedureData.deviceSpecialMessageDataList[alertDetailIndex] = alertData;
             }
             alertDetailIndex = -1;
             dbapp.updateDataEmergencyProcedure(dbapp.emergencyProcedureData);
             updateIsReadFlag(alertData);
        }
    }
}

function updateIsReadFlag(resultdata){
    var emergencyMessageId=-9999;
    var messageId=0;
    if(!jQuery.isEmptyObject(resultdata.emergencyMessage) && jQuery.isEmptyObject(resultdata.messageVO)){
                emergencyMessageId=resultdata.emergencyMessage.id;
    }else if(jQuery.isEmptyObject(resultdata.emergencyMessage) && !jQuery.isEmptyObject(resultdata.messageVO)){
                 messageId=resultdata.messageVO.messageId
    }
    $.ajax({
            type: "POST",
            async: false,
            url: serviceIpAddress_PJM+"/pjm/rest/services/edatafeed/updateIsEPRead",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            headers: {
                'Origin': 'file:///'
            },
            data: JSON.stringify({
                "udid": resultdata.udid,
                "emergencyMessage" : { 
                            "id" :  emergencyMessageId
                },
                "messageVO" : { 
                            "messageId" : messageId 
                },
                "read": resultdata.read
            }),
            success: function (data) {
                localStorage.setItem("EPBadge",localStorage.getItem("EPBadge")-1);
                var epBadge  = Number(localStorage.getItem("EPBadge"));
                badgeService.updateBadgeOnAppIcon(epBadge);
                badgeService.updateBadgeOnAlertsIcon(epBadge);
            },
            error: function (r, s, e) {
                if (!isOnline()) {
                    navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
                } else if (s === 'timeout') {
                    try{
                            window.plugins.spinnerDialog.hide();
                    }catch(e){}
                    
                    navigator.notification.alert(networkTimeoutMessage, null, "PJM Now", "OK");
                } else {
                    try{
                            window.plugins.spinnerDialog.hide();
                    }catch(e){}
                    navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                }
            },
            beforeSend: function (xhr, settings) {},
            complete: function (data) {}
      });
}
function goToLatestAlerts(){
    runningPageChange(10);
}
