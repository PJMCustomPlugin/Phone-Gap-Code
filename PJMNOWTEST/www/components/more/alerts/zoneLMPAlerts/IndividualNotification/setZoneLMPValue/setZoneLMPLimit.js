var editThresholdValue = true;
$("#key1").kendoTouch({
    touchstart: function (e) {
        if(editThresholdValue){ 
            $("#textBox").text('');
            editThresholdValue = false;
        }
        addCode('1');
    }
});
$("#key2").kendoTouch({
    touchstart: function (e) {
        if(editThresholdValue){ 
            $("#textBox").text('');
            editThresholdValue = false;
        }
        addCode('2');
    }
});
$("#key3").kendoTouch({
    touchstart: function (e) {
        if(editThresholdValue){ 
            $("#textBox").text('');
            editThresholdValue = false;
        }
        addCode('3');
    }
});
$("#key4").kendoTouch({
    touchstart: function (e) {
        if(editThresholdValue){ 
            $("#textBox").text('');
            editThresholdValue = false;
        }
        addCode('4');
    }
});
$("#key5").kendoTouch({
    touchstart: function (e) {
        if(editThresholdValue){ 
            $("#textBox").text('');
            editThresholdValue = false;
        }
        addCode('5');
    }
});
$("#key6").kendoTouch({
    touchstart: function (e) {
        if(editThresholdValue){ 
            $("#textBox").text('');
            editThresholdValue = false;
        }
        addCode('6');
    }
});
$("#key7").kendoTouch({
    touchstart: function (e) {
        if(editThresholdValue){ 
            $("#textBox").text('');
            editThresholdValue = false;
        }
        addCode('7');
    }
});
$("#key8").kendoTouch({
    touchstart: function (e) {
        if(editThresholdValue){ 
            $("#textBox").text('');
            editThresholdValue = false;
        }
        addCode('8');
    }
});
$("#key9").kendoTouch({
    touchstart: function (e) {
        if(editThresholdValue){ 
            $("#textBox").text('');
            editThresholdValue = false;
        }
        addCode('9');
    }
});
$("#key0").kendoTouch({
    touchstart: function (e) {
        if(editThresholdValue){ 
            $("#textBox").text('');
            editThresholdValue = false;
        }
        addCode('0');
    }
});
$("#keyClear").kendoTouch({
    touchstart: function (e) {
        addCode('clear');
    }
});
$("#keyDelete").kendoTouch({
    touchstart: function (e) {
        editThresholdValue = false;
        addCode('#');
    }
});

function SetFocus() {
    $("#textBox").text('');
    setTimeout(function () {
        $('.km-content').addClass('grayClass');
    }, 100);
}

function showFooter() {
    $('.km-content').removeClass('grayClass');
    runningPageChange(12);
}

function addCode(number) {
    var length = $('#textBox').text().length;
    var actual = $('#textBox').text()
    if (number == '#') {
        $('#textBox').text(actual.slice(0, -1));
    } else if (number == 'clear') {
       $('#textBox').text(actual.slice(0, -(length)));
       checkAndUpdateUpperAndLowerLimits("None");
    } else if (length < 4) {
        $('#textBox').text(actual + number);
    }
}

function Expand(obj) {
    if (!obj.savesize) obj.savesize = obj.size;
    obj.size = Math.max(obj.savesize, obj.value.length);
};

$(document).ready(function () {
     $('.enterZoneHeading').css('font-size','15px');
     $('.enterZoneHeading').css('font-family','HelveticaNeue');
     if(upperLimitScreenHasToBeDisplayed == true){
         $('#zoneLMPFrequencyText').text("Set Upper Limit");
         $('.enterZoneHeading').text('Alert me if '+myTitle+' goes above');
            if(upperThresholdValue == 'None'){
                $("#textBox").text('');
            } else{
                $("#textBox").text(upperThresholdValue);
            }
     }else if(lowerLimitScreenHasToBeDisplayed == true){
         $('#zoneLMPFrequencyText').text("Set Lower Limit");
          $('.enterZoneHeading').text('Alert me if '+myTitle+' goes below');
          if(lowerThresholdValue == "None"){
                $("#textBox").text('');
          } else{
                $("#textBox").text(lowerThresholdValue);
          }
     }
     setTimeout(function () {
         $('.km-content').addClass('grayClass');
     }, 100);
     var size = {
         width: window.innerWidth || document.body.clientWidth,
         height: window.innerHeight || document.body.clientHeight
     }
     $("#keypad_phone tr td").css('width', (size.width) / 3);
     $(".keybrdImgs").css('width', (size.width) / 3);
     $("#keypad_phone tr td").css('float', 'left');
     if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
         $("#keypad_phone tr td").css('height', (size.height) / 10);
         $(".keybrdImgs").css('height', (size.height) / 10);
     } else {
         $("#keypad_phone tr td").css('height', (size.height) / 8);
         $(".keybrdImgs").css('height', (size.height) / 8);
     }
     $('#doneLMPValue').click(function () {
         runningPageChange(12);
         checkAndUpdateUpperAndLowerLimits($('#textBox').text());
     });
    $('#cancelLMPValue').click(function () {
         runningPageChange(12);
         editThresholdValue = true;
         location.href = "#individualNotificationView";
     });
});

function checkAndUpdateUpperAndLowerLimits(setValue){
        var thresholdValue = setValue;
        if (setValue == '') {
            navigator.notification.alert('You must set the LMP for zones', null, "PJM Now", "OK");
        } else {
            $('.km-content').removeClass('grayClass');
            var deviceuuid = localStorage.getItem("deviceuuId");
            var updateUser_URL = "";
            var data = {};
            if($('#zoneLMPFrequencyText').text() == "Set Upper Limit"){
                updateUser_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceZoneThresholdValue';
                data = { "zoneName": myTitle, 
                        "thresholdValue": thresholdValue,
                        "deviceData": {
                            "udid": deviceuuid
                        }
                }
            }else if($('#zoneLMPFrequencyText').text() == "Set Lower Limit"){
                updateUser_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceZoneLowerThresholdValue';
                data = { "zoneName": myTitle, 
                        "lowerThresholdValue": thresholdValue,
                        "deviceData": {
                        "udid": deviceuuid
                        }
                }
            }
             $.ajax({
                type: "POST",
                async: false,
                url: updateUser_URL,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Origin': 'file:///'
                },
                Accept: 'application/json',
                data: JSON.stringify(data),
                success: function (data) {
                    if(data.success){
                        if(upperLimitScreenHasToBeDisplayed == true){
                            $.each(notificationsObj, function () {
                                if (this.zoneName === myTitle) {
                                    this.LMPValue = thresholdValue;
                                }
                            });
                        }else if(lowerLimitScreenHasToBeDisplayed == true){
                            $.each(notificationsObj, function () {
                                if (this.zoneName === myTitle) {
                                    this.lowerThresholdValue = thresholdValue;
                                }
                            });
                        }
                        upperLimitScreenHasToBeDisplayed = false;
                        lowerLimitScreenHasToBeDisplayed = false;
                        localStorage.setItem("notificationDetails", JSON.stringify(notificationsObj));
                        displayIndividualZoneLMPValues();
                        displayAllZoneLMPAlertsStatus();
                        editThresholdValue = true;
                    }else{
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
                        navigator.notification.alert(networkTimeoutMessage, null, "PJM Now", "OK");
                    } else {
                        navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                    }
                    try{
                        window.plugins.spinnerDialog.hide();
                    }catch(e){
                    }
                },
                beforeSend: function () {},
                complete: function (data) {}
            });
            location.href = "#individualNotificationView";
            
        }

}