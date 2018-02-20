$('#editValDiv').css('margin-right', '3%');
if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
    $('#individualSwitchDiv').css('margin-top', '-1.5px');
    $('#editValDiv').css('margin-top', '0.6%');
} else {
    $('#individualSwitchDiv').css('margin-top', '0px');
    $('#editValDiv').css('margin-top', '1%');
}

var upperLimitScreenHasToBeDisplayed = false;
var lowerLimitScreenHasToBeDisplayed = false;

function upperLimitDisplay(){
    upperLimitScreenHasToBeDisplayed = true;
    $('#zoneLMPFrequencyText').text("Set Upper Limit");
    $('.enterZoneHeading').text('Alert me if '+myTitle+' goes above');
    if(upperThresholdValue == 'None'){
        $("#textBox").text('');
    } else{
        $("#textBox").text(upperThresholdValue);
    }
}
function lowerLimitDisplay(){
    lowerLimitScreenHasToBeDisplayed = true;
    $('#zoneLMPFrequencyText').text("Set Lower Limit");
    $('.enterZoneHeading').text('Alert me if '+myTitle+' goes below');
    if(lowerThresholdValue == "None"){
        $("#textBox").text('');
    } else{
        $("#textBox").text(lowerThresholdValue);
    }
}
var upperThresholdValue;
var lowerThresholdValue;
function displayIndividualZoneLMPValues() {
    setTimeout(function () {
        $('#individualTitle').text(myTitle);
        var switchInstance = $("#individualSwitch").data("kendoMobileSwitch");
        var notificationsAllowed;
        $.each(notificationsObj, function () {
            if (this.zoneName === myTitle) {
                notificationsAllowed = this.allowNotifications;
                upperThresholdValue = this.LMPValue;
                lowerThresholdValue = this.lowerThresholdValue;
            }
        });
        if (upperThresholdValue >= 0) {
            document.getElementById("individualLMPUpperValue").innerHTML="$"+upperThresholdValue+".00";
        } else {
            document.getElementById("individualLMPUpperValue").innerHTML="None";
        }
        if (lowerThresholdValue >= 0) {
            document.getElementById("individualLMPLowerValue").innerHTML="$"+lowerThresholdValue+".00";
        }else{
            document.getElementById("individualLMPLowerValue").innerHTML="None";
        }
        if (notificationsAllowed == 'Off') {
            $('#frequncyDiv').hide();
            switchInstance.check(false);
        } else if (notificationsAllowed == 'On') {
            $('#frequncyDiv').show();
            switchInstance.check(true);
        }
        var value = myTitle;
        if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
            var titleId = $('#individualTitle');
            if (value == 'WESTERN HUB') {
                titleId.css('margin-left', '8px');
            } else {
                titleId.removeAttr('style');
            }
        }
    }, 100);
}
function editClicked() {
    try {
        SetFocus();
    } catch (ex) {}
    runningPageChange(13);
}
displayIndividualZoneLMPValues();
function backToZoneLMPAlertsPage() {
    try {
        displayAllZoneLMPAlertsStatus();
    } catch (ex) {}
    try {
        runningPageChange(11);
    } catch (error) {}
}
$(document).ready(function () {});