 window.addEventListener("resize", function(){
    if(isAlertsClicked == false){
         loadMoreScreen();
    }else{
         alertsService.showLatestAlertsPage();
    }
 }, false);

var myTitle = '';
var zoneLMPObj = dbapp.zoneData;
var zoneLMPArray = zoneLMPObj.zoneLMPList;
var upperLimitTabScreenHasToBeDisplayed = false;
var lowerLimitTabScreenHasToBeDisplayed = false;

var notificationDetails = localStorage.getItem("notificationDetails");
if (typeof notificationDetails === 'undefined' || notificationDetails === null) {
     for (var i = 0; i < zoneLMPArray.length; i++) {
         var individualLMPdetails = {};
         individualLMPdetails.zoneName = zoneLMPArray[i].Zone_LMP;
         individualLMPdetails.allowNotifications = 'Off';
         individualLMPdetails.LMPValue = "None";
         individualLMPdetails.lowerThresholdValue = "None";
         individualLMPdetails.zoneSelected = 'Yes';
         notificationsObj.push(individualLMPdetails);
     }
     localStorage.setItem("notificationDetails", JSON.stringify(notificationsObj));
     var notificationDetails = localStorage.getItem("notificationDetails");
     notificationsObj = JSON.parse(notificationDetails);
} else {
     notificationsObj = JSON.parse(notificationDetails);
}
function moreViewInit(){
   //buildZoneLMPDefaultNotificationDetails();
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
        if (screenOrientation == 90) {
            if(moreScreenLoaded==false){
                $('#legalDisclaimerImg, #aboutPJMImg, #notificationsImg, #feedbackImg,#reservesImg').css('margin-top','0.5em');
                moreScreenLoaded = true;
            }else{
                $('#legalDisclaimerImg, #aboutPJMImg, #notificationsImg, #feedbackImg,#reservesImg').css('margin-top','1em');
            }
            // if(defaultMorePrevPageInPortrait == 0){
            //     runningPageChange(9);
            //     defaultMorePrevPageInPortrait = 9;
            // }else{
            //     runningPageChange(defaultMorePrevPageInPortrait);
            // }
            if(localStorage.getItem('isNavigated')== 'true'){
                loadMoreScreen();
            }else{
                    if(isMoreReserves){
                        loadMoreScreen();
                    }else{
                        if($('#headerTag').text() == "Alerts"){
                            var isnotificationsenabled = localStorage.getItem('NotificationStatus');
                            if( localStorage.getItem('isNavigated') != 'true'){
                                    //if (isnotificationsenabled == "On") {
                                        updateBadgeInLandScapeMode();
                                    //}
                            }
                        }else if(defaultMorePrevPageInPortrait == 10){
                            loadViewLatestAlertsTab(dbapp.emergencyProcedureData);
                        }
                    }
             }
             $('.km-leftitem').css('margin-left', '32%');
             if(!isAlertsClicked){
                runningPageChange(9);
                defaultMorePrevPageInPortrait = 9;
            }else{
                runningPageChange(10);
                defaultMorePrevPageInPortrait = 10;
            }
        }else{
              if($('#headerTag').text() != "More"){
                loadMoreScreen();
              }
        }
    }else{
        if(runningPage!=6){
            runningPageChange(6);
        }
    }	
    if(moreScreenLoaded == false){
        moreScreenLoaded = true;
    }
    var text = toChangePAHtoPAI('type1');
    document.getElementById("allowAlertsLandMoreTabSubDivId").innerHTML = text;
    text =  toChangePAHtoPAI('type2');
    document.getElementById("epAlertTabTextId").innerHTML = "Selects only the emergency procedure types that can trigger a "+text+".";
    // if(runningPage!=6){
    //     runningPageChange(6);
    // }
}

function loadMoreScreen() {
    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    }

    var headerheight = $('.km-header').height();
    var footerheight = $('.km-footer').height();
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
        if (screenOrientation == 90) {
            var windowsize = {
                width: window.innerWidth || document.body.clientWidth,
                height: window.innerHeight || document.body.clientHeight
            };
            var footerheight1 = $('.km-footer').height();
            var headerheight1 = $('.km-header').height();
            if (footerheight1 == 0) {
                footerheight1 = 57;
            }
            if (headerheight1 == 0) {
                headerheight1 = 55;
            }
            $("#moreList_Tab").css("height", (windowsize.height - headerheight1 - footerheight1));
            $('#moreList_Tab').css('overflow-y', 'none');
            $(".menuClass").css('background-color', 'white');
            $("#notifications_li").css('background-color', '#5597C6');
            $(".cellTitle_tab").css('color', '#000000');
            $("#notificationTitle").css('color', 'white');
            $("#notificationEnabledStatus_tab").css('color', 'white');
            $("#notificationsText").css('color', 'white');
            $('#legalDisclaimerImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_0.png');
            $('#aboutPJMImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_2.png');
            $('#notificationsImg').attr('src', 'styles/images/homePageImages/MenuCell_Selected_2.png');
            $('#feedbackImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_3.png');
            $('#legalDisclaimerTabView').hide();
            $('#aboutTabView').hide();
            $('#notificationTabView').hide();
            $('#latestAlertsTabView').hide();
            $('#moreList_Phone').hide();
            $('#moreList_Tab').show();
            $('#epAlertsTabView').hide();
            $('#epAreasTabView').hide();
            $('#epTypesTabView').hide();
            $("#headerTag").show();
            $('#alertTabView').hide();
            $('#alertDetailTabView').hide();
            $('#feedbackTabView').hide();
            $('#individualNotificationTabView').hide();
            $('#sendAlertTabView').hide();
            $("#listTitle").css('float', 'left');
            $("#listTitle").css('width', '31%');
            $("#listTitle").css('border-right', '1px solid #BCC1C6');
            $('#listTitle').css('line-height', '3.5em');
            $('#headerTag').css('line-height', '3.5em');
            $('#backwardImage_Tab').css('line-height', '3.5em');
            $('#backToZoneLMP_Tab').css('line-height', '3.5em');
            $('#backToNotifications_Tab').css('line-height', '3.5em');
            $('.km-view-title').css('height', '2.5em');
            $("#moreList_Tab").css("width", (size.width * 31) / 100);
            $(".moreTabView").css("width", (size.width * 69) / 100);
            $(".textdiv").css("margin-left", '3%');
            $(".textdiv").css("padding-top", '10px');
            $(".LMPSmallText").css("margin-left", "6%");
            $(".LMPSmallText").css("margin-right", "6%");
            $("#switchDiv").css("padding-top", "5px");
            $(".afterClass").css("margin-right", "-3%");
            $(".afterClass").css("padding-top", "8px");
            $("#notificationsIncludeLMPTabList li").css("height", "44px");
            $("#notificationsExcludeLMPTabList li").css("height", "44px");
            $("#individualTabDiv").css('padding-top', '6px');
            $('#notificationTabView').css('height', (windowsize.height - headerheight1 - footerheight1));
            $('#latestAlertsTabView').css('height', (windowsize.height - headerheight1 - footerheight1));
            $('#epAreasTabView').css('height', (windowsize.height - headerheight1 - footerheight1));
            $('#epTypesTabView').css('height', (windowsize.height - headerheight1 - footerheight1));
            $("#LMPTextId").css("margin-left", "3%");
            if(getPageName(runningPage)!='ZoneLMP' && getPageName(runningPage)!='Demand' && getPageName(runningPage)!='TieFlows' 
            && getPageName(runningPage)!='OperationalReservesScreen' && getPageName(runningPage)!='DispatchedReservesScreen'){
                if(defaultMorePrevPageInPortrait == 0){
                        runningPageChange(9);
                        defaultMorePrevPageInPortrait = 9;
                }else{
                        runningPageChange(defaultMorePrevPageInPortrait);
                }
            }
            if(isAlertsClicked == false){
                 $('#backToNotifications_Tab').hide();
                 $('#alertTabView').show();
                 $("#headerTag").text("Alerts");
                 $('#backToZoneLMP_Tab').hide();  
                 $('#backToLatestAlerts_Tab').hide();  
                 $('#backToEP_Tab').hide();
            }else{
                 $("#headerTag").text("Latest Alerts and Messages");		
                 $('#backToNotifications_Tab').show();
                 $('#backToZoneLMP_Tab').hide();  
                 $('#backToLatestAlerts_Tab').hide();  
                 $('#backToEP_Tab').hide();		
                 runningPageChange(10);		
                 loadViewLatestAlertsTab(dbapp.emergencyProcedureData);		
                 $('#latestAlertsTabView').show();		
            }
            setTimeout(function () {
                if(getPageName(runningPage)!='OperationalReservesScreen' && getPageName(runningPage)!='DispatchedReservesScreen' ){
                     $('.km-leftitem').css('margin-left', '32%');
                }
                var switchInstance = $("#alertTabSwitch").data("kendoMobileSwitch");
                var isNotificationsEnabled = localStorage.getItem('NotificationStatus');
                 if( localStorage.getItem('isNavigated')== 'true'){
                        navigateToAlertDetailOnClickOfBanner();
                 }else{
                            if (typeof isNotificationsEnabled === 'undefined' || isNotificationsEnabled === null) {
                                switchInstance.check(false);
                                $('#notificationEnabledStatus_tab').html('Off');
                                // $('#viewLatestAlertsTabDiv').hide();
                                $('#settingsTabDiv').hide();
                                  if (device.platform == 'android' || device.platform == 'Android') { 
                                        $("#androidAlertsSettingsLand").hide();
                                  }else {
                                        $("#iosAlertsSettingsLand").hide();
                                  }
                                $('#alertTabSwitchdiv').css('border-radius', '5pt');
                            } else {
                                if (isNotificationsEnabled == "On") {
                                    $('#notificationEnabledStatus_tab').html('On');
                                    switchInstance.check(true);
                                    $('#viewLatestAlertsTabDiv').show();
                                    $('#settingsTabDiv').show();
                                    if (device.platform == 'android' || device.platform == 'Android') { 
                                        $("#androidAlertsSettingsLand").show();
                                    }else {
                                        $("#iosAlertsSettingsLand").show();
                                    }
                                    $('#alertTabSwitchdiv').css('border-radius', '5pt 5pt 5pt 5pt');
                                    alertsService.displayAlertsStatus();
                                } else {
                                    switchInstance.check(false);
                                    $('#notificationEnabledStatus_tab').html('Off');
                                    // $('#viewLatestAlertsTabDiv').hide();
                                    $('#settingsTabDiv').hide();
                                    if (device.platform == 'android' || device.platform == 'Android') { 
                                        $("#androidAlertsSettingsLand").hide();
                                    }else {
                                        $("#iosAlertsSettingsLand").hide();
                                    }
                                    $('#alertTabSwitchdiv').css('border-radius', '5pt');
                                }
                            }
                            updateBadgeInLandScapeMode();
                            $(".km-widget.km-navbar").css("height", '55px');
                            $("#LMPValueScreen").css("background-color", "#BABEC3");
                 }
            }, 100);
        } else {
            if(moreScreenLoaded == true){
     		   	$('#legalDisclaimerImg, #aboutPJMImg, #notificationsImg, #feedbackImg,#reservesImg').css('margin-top','1em');
            }
          	$('#backToNotifications_Tab').hide();
            $('#backToZoneLMP_Tab').hide();
            $('#backwardImage_Tab').hide();
            $('#backToLatestAlerts_Tab').hide();
            $('#backToEP_Tab').hide();
            $('.km-leftitem').removeAttr('style');
            $('#latestAlertsTabView').hide();
            $('#alertDetailTabView').hide();
            $('#epAlertsTabView').hide();
            $('#epTypesTabView').hide();
            $('#epAreasTabView').hide();
            $('#legalDisclaimerTabView').hide();
            $('#aboutTabView').hide();
            $('#alertTabView').hide();
            $('#notificationTabView').hide();
            $('#feedbackTabView').hide();
            $('#individualNotificationTabView').hide();
            $('#moreList_Phone').show();
            $('#moreList_Tab').hide();
            $("#headerTag").hide();
            $("#listTitle").removeAttr('style');
            $(".moreListImg").css("width", "94%");
            $('#notificationEnabledStatus').css('margin-top', '-4px');
            $(".menuCellImg").css("margin-left", "1em");
            $(".cellTitle").css("padding-left", "3em");
            $(".divCellImg").css("margin-top", "7px");
            $('.grayArrowImgDiv').css('margin-top', '-3.0%');
            $(".cellTitle").css("padding-top", "12px");
            $('.cellTitle').css('margin-top', '-0.5%');
            if(runningPage!=6 && getPageName(runningPage)!='ZoneLMP' && getPageName(runningPage)!='Demand' && getPageName(runningPage)!='TieFlows' 
            && getPageName(runningPage)!='OperationalReservesScreen' && getPageName(runningPage)!='DispatchedReservesScreen'){
                 runningPageChange(6);
                defaultMorePrevPageInPortrait = 0;
            }
            setTimeout(function () {
                var notificationsStatus = localStorage.getItem('NotificationStatus');
                if (typeof notificationsStatus === 'undefined' || notificationsStatus === null) {
                    $('#notificationEnabledStatus').html('Off');
                } else {
                    $('#notificationEnabledStatus').html(notificationsStatus);
                }
                $(".km-widget.km-navbar").css("height", 'auto');
                $(".LMPsmallText").css("margin-left", "3%");
            }, 100);
            try {
                setZoneLMPValues();
            } catch (error) {}
        }
    } else {
        $('#latestAlertsTabView').hide();
        $(".cellTitle").css("padding-left", "2em");
        $(".divCellImg").css("margin-top", "7px");
        $('.grayArrowImgDiv').css('margin-top', '-23px');
        $(".cellTitle").css("padding-top", "10px");
        $(".moreListImg").css("width", "90%");
        if (device.platform == 'android' || device.platform == 'Android') {
            $('#notificationEnabledStatus').css('margin-top', '-2px');
        } else {
            $('#notificationEnabledStatus').css('margin-top', '-4px');
        }
        setTimeout(function () {
            var notificationsStatus = localStorage.getItem('NotificationStatus');
            if (typeof notificationsStatus === 'undefined' || notificationsStatus === null) {
                $('#notificationEnabledStatus').html('Off');
            } else {
                $('#notificationEnabledStatus').html(notificationsStatus);
            }
        }, 100);
    }
}
loadMoreScreen();

function updateBadgeInLandScapeMode(){
    var epBadge = Number(localStorage.getItem("EPBadge"));
    if(epBadge>0){
        $('#badgeCountTabDivId').show();
        $('#badgeIdTab').text(epBadge);
        if(epBadge>9){
            if(device.platform == 'iOS'){
                 $('#latestAlertsTextDivTab').css('width','85%');
            }else if(device.platform == 'Android'){
                $('#latestAlertsTextDivTab').css('width','85%');
            }
            $('#badgeCountTabDivId').css('width','32px');
        }else{
             if(device.platform == 'iOS'){
                $('#latestAlertsTextDivTab').css('width','85%');
             }else if(device.platform == 'Android'){
                  $('#latestAlertsTextDivTab').css('width','86%');
             }
            $('#badgeCountTabDivId').css('width','24px');
        }
    }else if(epBadge == 0){
        $('#badgeCountTabDivId').hide();
        $('#badgeIdTab').text(epBadge);
    }
    // if(device.platform == 'Android' || device.platform == 'android'){
    //     $('.badgeCountText').css('padding-top','2px'); 
    // }
    if(device.platform == 'Android' || device.platform == 'android'){
        $('#badgeIdTab').css('padding-top','2.1px'); 
    }
}

function navigateToAlertDetailOnClickOfBanner(){
            var isNotificationsEnabled = localStorage.getItem('NotificationStatus');
            localStorage.setItem('isNavigated',false);
            try{
                                $('#alertTabView').hide();
                                showAlertDetailTab();
                                setTimeout(function(){
                                    $('#backToNotifications_Tab').hide();
                                    $('#backToEP_Tab').hide();
                                    $('#backToZoneLMP_Tab').hide();
                                    $('#backToLatestAlerts_Tab').show();
                                    $('#headerTag').text('Alert Detail');
                                    $('#latestAlertsTabView').hide();
                                    $('#alertDetailTabView').show();
                                },100);
            }catch(e){} 
            if (typeof isNotificationsEnabled === 'undefined' || isNotificationsEnabled === null) {
                    $('#notificationEnabledStatus_tab').html('Off');
            }else{
                    if (isNotificationsEnabled == "On") {
                            $('#notificationEnabledStatus_tab').html('On');
                    }else {
                            $('#notificationEnabledStatus_tab').html('Off');
                    }
            }
}
function onClick(id, name) {
    if (id == 1) {
        activateMoreAndDeactivateAlerts();
        $(".menuClass").css('background-color', 'white');
        $('#legalDisclaimerTabView').show();
        $('#aboutTabView').hide();
        $('#alertTabView').hide();
        $('#feedbackTabView').hide();
        $('#sendAlertTabView').hide();
        $('#notificationTabView').hide();
        $('#latestAlertsTabView').hide();
        $('#alertDetailTabView').hide();
        $('#epAlertsTabView').hide();
        $('#epAreasTabView').hide();
        $('#epTypesTabView').hide();
        $('#backToNotifications_Tab').hide();
        $('#backToZoneLMP_Tab').hide();
        $('#backwardImage_Tab').hide();
        $('#backToLatestAlerts_Tab').hide(); 
        $('#backToEP_Tab').hide();
        $('#individualNotificationTabView').hide();
       // $('#zonesListTabView').hide();
        $("#legalDisclaimer_li").css('background-color', '#5597C6');
        $(".cellTitle_tab").css('color', '#000000');
        $("#notificationTitle").css('color', '#000000');
        $("#notificationEnabledStatus_tab").css('color', '#000000');
        $("#legalDisclaimerText").css('color', 'white');
        $('#legalDisclaimerImg').attr('src', 'styles/images/homePageImages/MenuCell_Selected_0.png');
        $('#aboutPJMImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_2.png');
        $('#notificationsImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_1.png');
        $('#feedbackImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_3.png');
        $('#headerTag').text(name);
        runningPageChange(7);
        defaultMorePrevPageInPortrait = 7;
    } else if (id == 2) {
        activateMoreAndDeactivateAlerts();
        $(".menuClass").css('background-color', 'white');
        $("#aboutPJM_li").css('background-color', '#5597C6');
        $(".cellTitle_tab").css('color', '#000000');
        $("#notificationTitle").css('color', '#000000');
        $("#notificationEnabledStatus_tab").css('color', '#000000');
        $("#aboutPJMText").css('color', 'white');
        $('#legalDisclaimerImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_0.png');
        $('#aboutPJMImg').attr('src', 'styles/images/homePageImages/MenuCell_Selected_1.png');
        $('#notificationsImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_1.png');
        $('#feedbackImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_3.png');
        $('#headerTag').text(name);
        $('#legalDisclaimerTabView').hide();
        $('#latestAlertsTabView').hide();
        $('#alertDetailTabView').hide();
        $('#epAlertsTabView').hide();
        $('#epAreasTabView').hide();
        $('#epTypesTabView').hide();
        $('#aboutTabView').show();
        $('#alertTabView').hide();
        $('#backToNotifications_Tab').hide();
        $('#backToZoneLMP_Tab').hide();
        $('#backwardImage_Tab').hide();
        $('#backToLatestAlerts_Tab').hide(); 
        $('#backToEP_Tab').hide();
        $('#feedbackTabView').hide();
        $('#sendAlertTabView').hide();
        $('#notificationTabView').hide();
        $('#individualNotificationTabView').hide();
        runningPageChange(8);
        defaultMorePrevPageInPortrait = 8;
    } else if (id == 3) {
        $(".menuClass").css('background-color', 'white');
        $("#notifications_li").css('background-color', '#5597C6');
        $(".cellTitle_tab").css('color', '#000000');
        $("#notificationTitle").css('color', 'white');
        $("#notificationEnabledStatus_tab").css('color', 'white');
        $("#notificationsText").css('color', 'white ');
        $('#legalDisclaimerImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_0.png');
        $('#aboutPJMImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_2.png');
        $('#notificationsImg').attr('src', 'styles/images/homePageImages/MenuCell_Selected_2.png');
        $('#feedbackImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_3.png');
        $('#headerTag').text(name);
        $('#legalDisclaimerTabView').hide();
        $('#backToNotifications_Tab').hide();
        $('#backToZoneLMP_Tab').hide();
        $('#backwardImage_Tab').hide();
        $('#backToLatestAlerts_Tab').hide(); 
        $('#backToEP_Tab').hide();
        $('#aboutTabView').hide();
        $('#alertTabView').show();
        $('#feedbackTabView').hide();
        $('#sendAlertTabView').hide();
        $('#notificationTabView').hide();
        $('#individualNotificationTabView').hide();
       // $('#zonesListTabView').hide();
        $('#latestAlertsTabView').hide();
        $('#alertDetailTabView').hide();
        $('#epAlertsTabView').hide();
        $('#epAreasTabView').hide();
        $('#epTypesTabView').hide();
        updateBadgeInLandScapeMode();
        alertsService.displayAlertsStatus();
        runningPageChange(9);
        defaultMorePrevPageInPortrait = 9;
    } else if (id == 4) {
        activateMoreAndDeactivateAlerts();
        $(".menuClass").css('background-color', 'white');
        $("#feedback_li").css('background-color', '#5597C6');
        $(".cellTitle_tab").css('color', '#000000');
        $("#notificationTitle").css('color', '#000000');
        $("#notificationEnabledStatus_tab").css('color', '#000000');
        $("#feedbackText").css('color', 'white');
        $('#latestAlertsTabView').hide();
        $('#alertDetailTabView').hide();
        $('#epAlertsTabView').hide();
        $('#epAreasTabView').hide();
        $('#epTypesTabView').hide();
        $('#legalDisclaimerImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_0.png');
        $('#aboutPJMImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_2.png');
        $('#notificationsImg').attr('src', 'styles/images/homePageImages/MenuCell_NonSelected_1.png');
        $('#feedbackImg').attr('src', 'styles/images/homePageImages/MenuCell_Selected_3.png');
        $('#headerTag').text(name);
        $('#legalDisclaimerTabView').hide();
        $('#backToNotifications_Tab').hide();
        $('#backToZoneLMP_Tab').hide();
        $('#backwardImage_Tab').hide();
        $('#backToLatestAlerts_Tab').hide(); 
        $('#backToEP_Tab').hide();
        $('#aboutTabView').hide();
        $('#alertTabView').hide();
        $('#feedbackTabView').show();
        $('#sendAlertTabView').hide();
        $('#notificationTabView').hide();
        $('#individualNotificationTabView').hide();
       // $('#zonesListTabView').hide();
        runningPageChange(14);
        defaultMorePrevPageInPortrait = 14;
    }else if (id == 5) {
        activateMoreAndDeactivateAlerts();
        runningPageChange(19);
        defaultMorePrevPageInPortrait = 19;
        // try {
        //         window.screen.lockOrientation("landscape");
        // } catch (error) { }
        app.navigate("components/more/reserves/operationalReserves/operationalReserves_landscape.html", "slide:left");
    }
}

function activateMoreAndDeactivateAlerts(){
    if(isAlertsClicked){
        isMoreClicked = true;
        isAlertsClicked = false;
        previousPage = 4;
        alertsService.activateMoreScreen();
    }
}

function setNotifications_Phone(e) {
    var data = e.button.data();
    if (data.user == "3") {
        try {
            setLMPValue();
        } catch (ex) {}
    }
}

/*about tab */
if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
    $('.moreContent').addClass('moreContent_tab');
} else {
    $('.moreContent').addClass('moreContent_phone');
}

function goToWebsite() {
    var ref = window.open(encodeURI('http://pjm.com'), '_blank', 'location=yes');
}

/*feedback*/
if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
    $('.moreContent').addClass('moreContent_tab');
} else {
    $('.moreContent').addClass('moreContent_phone');
}

function composeEmail(e) {
    var feedbackScreenName = "Feedback";
    if(device.platform == 'Android' || device.platform == 'android'){
          Base64.fileCreationInAndroidAndSendMail(feedbackScreenName); 
    } else if(device.platform == "iOS"){
        var  encodedDeviceData = Base64.get_encoded_device_data();
        var filePath = 'base64:device_info.txt//'+ encodedDeviceData +'/...';
        Base64.sendAMail(filePath,feedbackScreenName);
    }
}

function callback(e) {
    navigator.notification.alert(JSON.stringify(msg), null, 'EmailComposer callback', 'Close');
}

function checkSimulator() {
    if (window.navigator.simulator === true) {
        alert('This plugin is not available in the simulator.');
        return true;
    } else if (window.plugin === undefined) {
        alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
        return true;
    } else {
        return false;
    }
}

/*legalDisclaimerTabView*/
if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
    $('.moreContent').addClass('moreContent_tab');
} else {
    $('.moreContent').addClass('moreContent_phone');
}

/*alertTabView*/

function setTabAlertsAllowedValue() {
    setTimeout(function () {
        var switchInstance = $("#alertTabSwitch").data("kendoMobileSwitch");
        var isNotificationsEnabled = localStorage.getItem("NotificationStatus");
        if (typeof isNotificationsEnabled === 'undefined' || isNotificationsEnabled === null) {
            switchInstance.check(false);
            // $('#viewLatestAlertsTabDiv').hide();
            $('#settingsTabDiv').hide();
        } else {
            if (isNotificationsEnabled == "On") {
                switchInstance.check(true);
                $('#viewLatestAlertsTabDiv').show();
                $('#settingsTabDiv').show();
                alertsService.displayAlertsStatus();
            } else {
                switchInstance.check(false);
                // $('#viewLatestAlertsTabDiv').hide();
                $('#settingsTabDiv').hide();
            }
        }
    }, 100);
}
setTabAlertsAllowedValue();

function onEPDivClick_Tab(){
    if($('#headerTag').text()=="Alerts"){
         setTimeout(function(){
            runningPageChange(16);
            defaultMorePrevPageInPortrait = 16;
            $('#alertTabView').hide();
            $('#backwardImage_Tab').show();
            $('#backToNotifications_Tab').show();
            $('#headerTag').text('Emergency Procedures');
            $('#epAlertsTabView').show();
            var switchInstanceTab = $("#epSwitchTab").data("kendoMobileSwitch");
            var includeDrillsSwitchInstanceTab = $("#includeDrillsSwitchTab").data("kendoMobileSwitch");
            var isEPNotificationsEnabled = localStorage.getItem("EPNotificationStatus");
            var isIncludeDrillsEnabled = localStorage.getItem("IncludeDrillsEnabledStatus");
            if (isEPNotificationsEnabled == "Off"){
                switchInstanceTab.check(false);
                $('#optionsDivTab').hide();
                $('#includeDrillsDivTab').hide();
            }else if(isEPNotificationsEnabled == "On"){
                switchInstanceTab.check(true);
                $('#optionsDivTab').show();
                $('#includeDrillsDivTab').show();
            }
            if(isIncludeDrillsEnabled == "Off"){
                includeDrillsSwitchInstanceTab.check(false);
            }else if(isIncludeDrillsEnabled == "On"){
                includeDrillsSwitchInstanceTab.check(true);
            }
            var areaSelected = localStorage.getItem("AreaSelected");
            var pahTypesOnlyEnabledFlag = localStorage.getItem("PAHTypesOnlyEnabledFlag");
            if(areaSelected == null || areaSelected == undefined || areaSelected == 'region'){
                   $('#areaSelectedTextLandTab').text("By Region/Zone");
            }else if(areaSelected == "state"){
                   $('#areaSelectedTextLandTab').text("By State");
            }
            populateEPTypeSelectedStatus();
        },300);
    }
}

function populateEPTypeSelectedStatus(){
     var pahTypesOnlyEnabledFlag = localStorage.getItem("PAHTypesOnlyEnabledFlag");
      if(pahTypesOnlyEnabledFlag == 'true'){
                $('#typeSelectedLandTabDiv').show();
                $('#typesCountLandTabDivId').hide();
                $('#typeSelectedTextLandTab').text(toChangePAHtoPAI('type1'));
            }else {
                if(pahTypesOnlyEnabledFlag == null || pahTypesOnlyEnabledFlag == undefined ){
                        $('#typeSelectedLandTabDiv').show();
                        $('#typesCountLandTabDivId').hide();
                        $('#typeSelectedTextLandTab').text("All");
                }else if(pahTypesOnlyEnabledFlag == 'false'){
                    var typesSelectedCount = localStorage.getItem("TypesSelectedCount");
                    if(typesSelectedCount != null && typesSelectedCount != undefined){
                        var typesSelectedCount = Number(localStorage.getItem("TypesSelectedCount"));
                        if(typesSelectedCount > 0){
                            $('#typeSelectedLandTabDiv').show();
                            $('#typesCountLandTabDivId').hide();
                            $('#typeSelectedTextLandTab').text(typesSelectedCount);
                        }else{
                            $('#typeSelectedLandTabDiv').show();
                            $('#typesCountLandTabDivId').hide();
                            $('#typeSelectedTextLandTab').text("All");
                        }
                    }else{
                         $('#typeSelectedLandTabDiv').show();
                         $('#typesCountLandTabDivId').hide();
                         $('#typeSelectedTextLandTab').text("All");
                    }
                }
            }
}
function updateIncludeDrillsChangeFirstTime(){
    var includeDrillsEnabled = true;
    var deviceuuid = localStorage.getItem("deviceuuId");
    var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceIncludeDrillsFlag';
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
            "udid": deviceuuid ,
            "includeDrillsEnabled": includeDrillsEnabled
        }),
        success: function (data) {
            if(data.success){
                  if (includeDrillsEnabled) {
                     localStorage.setItem("IncludeDrillsEnabledStatus", 'On');
                  } else {
                    localStorage.setItem("IncludeDrillsEnabledStatus", 'Off');
                  }
                  var includeDrillsSwitchInstance = $("#includeDrillsSwitchTab").data("kendoMobileSwitch");
                  includeDrillsSwitchInstance.check(includeDrillsEnabled);
            }
            else if(data.success == false){
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                EPAlertsInitMethod();
            }
            window.plugins.spinnerDialog.hide();
        },
        error: function (r, s, e) {
            EPAlertsInitMethod();
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
    window.plugins.spinnerDialog.hide();
}
function onEPAlertsTabChange(e){
    try {
        window.plugins.spinnerDialog.show();
    } catch (error) {}
    var epAlertsEnabled = false;
    if (e.checked) {
        epAlertsEnabled = true;
    } else {
        epAlertsEnabled = false;
    }
    var deviceuuid = localStorage.getItem("deviceuuId");
    var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceEPNotificationFlag';
    var switchInstance = $("#epSwitchTab").data("kendoMobileSwitch");
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
            "udid": deviceuuid,
            "epNotificationEnabled": epAlertsEnabled
        }),
        success: function (data) {
            if(data.success){
                 if (epAlertsEnabled) {
                     localStorage.setItem("EPNotificationStatus", 'On');
                     $('#epAlertsStatusTab').html("On");
                     $('#optionsDivTab').show();
                     $('#includeDrillsDivTab').show();
                     var isIncludeDrillsEnabled = localStorage.getItem("IncludeDrillsEnabledStatus");
                     if(isIncludeDrillsEnabled == null){
                         localStorage.setItem("IncludeDrillsEnabledStatus", 'On');
                         updateIncludeDrillsChangeFirstTime();
                     }
                  } else {
                    localStorage.setItem("EPNotificationStatus", 'Off');
                    $('#epAlertsStatusTab').html("Off");
                    $('#optionsDivTab').hide();
                    $('#includeDrillsDivTab').hide();
                  }
            }
            else if(data.success == false){
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                EPAlertsInitMethod();
                epAlertsEnabled = (!epAlertsEnabled);
                switchInstance.check(epAlertsEnabled);
            }
            window.plugins.spinnerDialog.hide();
        },
        error: function (r, s, e) {
             EPAlertsInitMethod();
             epAlertsEnabled = (!epAlertsEnabled);
             switchInstance.check(epAlertsEnabled);
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
function onAlertsTabChange(e) {
    var notificationsenabled = false;
    if (e.checked) {
        notificationsenabled = true;
    } else {
        notificationsenabled = false;
    }
    var switchInstance = $("#alertTabSwitch").data("kendoMobileSwitch");
    var deviceuuid = localStorage.getItem("deviceuuId");
    var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceNotificationFlag';
    try{
    	window.plugins.spinnerDialog.show();
    }catch(error){}
    $.ajax({
        type: "POST",
        async: true,
        url: notificationStatus_URL,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        timeout:10000,
        headers: {
            'Origin': 'file:///'
        },
        Accept: 'application/json',
        data: JSON.stringify({
            "udid": deviceuuid,
            "notificationEnabled": notificationsenabled
        }),
        success: function (data) {
            if(data.success){
                 if (notificationsenabled) {
                    localStorage.setItem("NotificationStatus", 'On');
                    if (device.platform == 'android' || device.platform == 'Android') { 
                        $("#androidAlertsSettingsLand").show();
                    }else {
                        $("#iosAlertsSettingsLand").show();
                    }
                    $('#notificationEnabledStatus_tab').html('On');
                    $('#notificationEnabledStatus').html('On');
                    $('#viewLatestAlertsTabDiv').show();
                    $('#settingsTabDiv').show();
                    $('#alertTabSwitchdiv').css('border-radius', '5pt 5pt 5pt 5pt');
                    alertsService.displayAlertsStatus();
                } else {
                    localStorage.setItem("NotificationStatus", 'Off');
                    if (device.platform == 'android' || device.platform == 'Android') { 
                          $("#androidAlertsSettingsLand").hide();
                    }else {
                          $("#iosAlertsSettingsLand").hide();
                    }
                    $('#notificationEnabledStatus_tab').html('Off');
                    $('#notificationEnabledStatus').html('Off');
                    // $('#viewLatestAlertsTabDiv').hide();
                    $('#alertTabSwitchdiv').css('border-radius', '5pt');
                    $('#settingsTabDiv').hide();
                    //showUserFeedBackForm_Tab();
                }
            }else if(data.success==false){
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                if (localStorage.getItem("NotificationStatus") != 'NULL') {
                if (localStorage.getItem("NotificationStatus") == 'Off') {
                    $('#alertTabSwitchdiv').css('border-radius', '5pt');
                } else {
                    $('#alertTabSwitchdiv').css('border-radius', '5pt 5pt 5pt 5pt');
                }
                $('#notificationEnabledStatus_tab').html(localStorage.getItem("NotificationStatus"));
                $('#notificationEnabledStatus').html(localStorage.getItem("NotificationStatus"));
                } else {
                    $('#notificationEnabledStatus_tab').html('Off');
                    $('#notificationEnabledStatus').html('Off');
                    $('#alertTabSwitchdiv').css('border-radius', '5pt');
                }
                try{
                    loadMoreScreen();
                }catch(error){}
            }
            try{
                window.plugins.spinnerDialog.hide();
            }catch(error){}
        },
        error: function (r, s, e) {
            try{
                window.plugins.spinnerDialog.hide();
            }catch(error){}
            if (localStorage.getItem("NotificationStatus") != 'NULL') {
                if (localStorage.getItem("NotificationStatus") == 'Off') {
                    $('#alertTabSwitchdiv').css('border-radius', '5pt');
                } else {
                    $('#alertTabSwitchdiv').css('border-radius', '5pt 5pt 5pt 5pt');
                }
                $('#notificationEnabledStatus_tab').html(localStorage.getItem("NotificationStatus"));
                $('#notificationEnabledStatus').html(localStorage.getItem("NotificationStatus"));
            } else {
                $('#notificationEnabledStatus_tab').html('Off');
                $('#notificationEnabledStatus').html('Off');
                $('#alertTabSwitchdiv').css('border-radius', '5pt');
            }
             if(s === 'timeout'){
                   navigator.notification.alert(networkTimeoutMessage, null, "PJM Now", "OK");
             }else if (!isOnline()) {
                   navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
             }else {
                   navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
             }
             try{
                loadMoreScreen();
            }catch(error){}
        },
        beforeSend: function () {},
        complete: function (data) {}
    });
}
function showUserFeedBackForm_Tab() {
    var prevClicks = localStorage.getItem('alertsEnabledClicks');
    if (parseInt(prevClicks) ==0) {
            var alertsPopupdiv = $("#modaldialog_alertsTab");
            if (!alertsPopupdiv.data("kendoWindow")) {
                if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
                    if (size.width > 320) {
                        alertsPopupdiv.kendoWindow({
                            width: "350px",
                            height: 'auto',
                            title: false,
                            draggable: false,
                            resizable: false,
                            modal: true,
                            scrollable: false
                        });
                    } else {
                        alertsPopupdiv.kendoWindow({
                            width: "300px",
                            height: 'auto',
                            title: false,
                            draggable: false,
                            resizable: false,
                            modal: true,
                            scrollable: false
                        });
                    }
                } else {
                    alertsPopupdiv.kendoWindow({
                        width: "350px",
                        height: 'auto',
                        title: false,
                        draggable: false,
                        resizable: false,
                        modal: true,
                        scrollable: false
                    });
                }
                var win1 = alertsPopupdiv.data("kendoWindow");
                win1.center().open();
            } else {
                var win1 = alertsPopupdiv.data("kendoWindow");
                win1.center().open();
            }
    }
}
function ZoneLMPTabClick() {
    setTimeout(function () {
       setTabZoneLMPValues();
       $('#alertTabView').hide();
       $('#backwardImage_Tab ').show();
       $('#backToNotifications_Tab').show();
       $('#headerTag').text('Zone LMP');
       $('#notificationTabView').show();
       runningPageChange(11);
       defaultMorePrevPageInPortrait = 11;
    }, 400);
}
function showPopup(limitType){
         $(window).bind('touchmove', function (e) {
             e.preventDefault();
         });
         setTimeout(function () {
             var graphPopupdiv = $("#LMPValueScreen");
             if (!graphPopupdiv.data("kendoWindow")) {
                 if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
                     graphPopupdiv.kendoWindow({
                         width: "320px",
                        height: "457px",
                        display: 'fixed',
                        title: false,
                        draggable: false,
                        resizable: false,
                        modal: true,
                        position: {
                            left: "50%",
                            top: "16%"
                        }
                    });
                } else {
                    graphPopupdiv.kendoWindow({
                        width: "320px",
                        height: "457px",
                        display: 'fixed',
                        title: false,
                        scrollable: false,
                        draggable: false,
                        resizable: false,
                        modal: true,
                        position: {
                            left: "50%",
                            top: "16%"
                        }
                    });
                }
                openedWindow = graphPopupdiv.data("kendoWindow");
                try{
                 window.screen.lockOrientation("landscape");
                }catch(error){}
                openedWindow.open();
                showZoneLMPExistingValuesOnEdit(limitType);
            } else {
                 try{
                 window.screen.lockOrientation("landscape");
                }catch(error){}
                var win1 = graphPopupdiv.data("kendoWindow");
                openedWindow.open();
                //TODO check
            }
        }, 100);
}
function lowerLimitTabDisplay(){
    runningPageChange(13);
    lowerLimitTabScreenHasToBeDisplayed = true;
    defaultMorePrevPageInPortrait = 13;  
    $('#thresholdSetTabTitle').text("Set Lower Limit");
    $('.enterMsgLandTabChild').text("Alert me if "+myTitle+" goes below");
    if(lowerThresholdValueTabGlobal == "None"){
            $("#textBox1").text('');
    }
    else{
            $("#textBox1").text(lowerThresholdValueTabGlobal);
    }
    showPopup("lower_limit");
}
function upperLimitTabDisplay(){
    runningPageChange(13);
    upperLimitTabScreenHasToBeDisplayed = true;
    defaultMorePrevPageInPortrait = 13; 
    $('#thresholdSetTabTitle').text("Set Upper Limit");
     $('.enterMsgLandTabChild').text("Alert me if "+myTitle+" goes above");
     if(upperThresholdValueTabGlobal == "None"){
            $("#textBox1").text('');
    }
    else{
            $("#textBox1").text(upperThresholdValueTabGlobal);
    }
    showPopup("upper_limit");           
}
function showZoneLMPExistingValuesOnEdit(limitType){
    if(limitType == "upper_limit"){
            if(upperThresholdValueTabGlobal == "None"){
                    $('#textBox1').text('');
            }else{
                    $('#textBox1').text(upperThresholdValueTabGlobal);
            }
    }else if(limitType == "lower_limit"){
            if(lowerThresholdValueTabGlobal == "None"){
                    $('#textBox1').text('');
            }else{
                    $('#textBox1').text(lowerThresholdValueTabGlobal);
            }
    }
}
function areasTabDivClick(){
     if($('#headerTag').text() == 'Emergency Procedures') {
        setTimeout(function () {
                $('#epAlertsTabView').hide();
                $('#backToNotifications_Tab').hide();
                $('#backToEP_Tab').show() ;
                $('#epAreasTabView').show(); 
                var allAreaData = localStorage.getItem("AllAreasData"); 
                if(allAreaData==undefined || allAreaData == null|| allAreaData=='null'){
                    getAllAreasAndPopulate();
                }else{
                    populateAreasDataTab(JSON.parse(allAreaData)); 
                }
                runningPageChange(17);
                defaultMorePrevPageInPortrait = 17;
        }, 400);
     }
}
function displayCheckedForAllMessageTypesBasedOnPAHFlag_Tab(pahTypesOnlyEnabledFlag,switchInstance){
    if(pahTypesOnlyEnabledFlag == "false"){
        $('#allTypesULTab li').each(function(){
            $(this).removeClass('disabled');
        });
        $('#allTypesULTab input:checked').each(function() {
            $(this).css("color", "#5597C6");
        });
        if(switchInstance!=null){
            switchInstance.check(false);
        }
    }else if(pahTypesOnlyEnabledFlag == "true"){
        $('#allTypesULTab li').each(function(){
            $(this).addClass('disabled');
        });
        $('#allTypesULTab input:checked').each(function() {
            $(this).css("color", "#848484");
        });
        if(switchInstance!=null){
            switchInstance.check(true);
        }
    }
}
function typesTabDivClick(){
    if($('#headerTag').text() == 'Emergency Procedures') { 
            setTimeout(function () {  
                    $('#epAlertsTabView').hide();
                    $('#backToNotifications_Tab').hide();
                    $('#backToEP_Tab').show() ;
                    $('#epTypesTabView').show(); 
                    var pahTypesOnlyEnabledFlag = localStorage.getItem("PAHTypesOnlyEnabledFlag");
                    var switchInstance = $("#pahSwitchTab").data("kendoMobileSwitch");
                    if(pahTypesOnlyEnabledFlag ==  null || pahTypesOnlyEnabledFlag == undefined){
                            getPAHTypeOnlyStatusAndStore();
                    }else{
                        var allEPTypesOnlyTemp = localStorage.getItem("AllEPTypesOnly");
                        if(allEPTypesOnlyTemp == undefined || allEPTypesOnlyTemp == null || allEPTypesOnlyTemp=='null'){
                            getAllEPTypesAndPopulate();
                        }else{1
                            populateEPTypesDataTab(JSON.parse(allEPTypesOnlyTemp)); 
                        }
                        displayCheckedForAllMessageTypesBasedOnPAHFlag_Tab(pahTypesOnlyEnabledFlag,switchInstance);
                    }
                    runningPageChange(18);
                    defaultMorePrevPageInPortrait = 18;
            }, 400);
    } 
}
function onLatestAlertsDivClick_tab(){
   if($('#headerTag').text()=="Alerts"){
        runningPageChange(10); 
        defaultMorePrevPageInPortrait = 10;
        setTimeout(function () {
           $('#alertTabView').hide();
           $('#backToNotifications_Tab').show();
           $('#headerTag').text('Latest Alerts and Messages');
           loadViewLatestAlertsTab(dbapp.emergencyProcedureData);
           $('#latestAlertsTabView').show();
        }, 200);
   }
}
function latestAlertsULClick(e){
    var alertDetailId = e.item.attr('id');
    try {
       alertData = getAlertDetail(alertDetailId);
       showAlertDetailTab();
    } catch (e) {}
    $('#backToNotifications_Tab').hide();
    $('#backToLatestAlerts_Tab').show();
    $('#headerTag').text('Alert Detail');
    $('#latestAlertsTabView').hide();
    $('#alertDetailTabView').show();
}
function showAlertDetailTab() {
    runningPageChange(15); 
    defaultMorePrevPageInPortrait = 15;
  	var alertDetail = '';
   if(!jQuery.isEmptyObject(alertData.emergencyMessage) && jQuery.isEmptyObject(alertData.messageVO)){
            alertDetail = alertDetail + "<div id='alertDetailsDiv'>"+
                                     "<div id='alertDetailMessageType'>"+alertData.emergencyMessage.messageType+"</div>"+
                                     "<div id='alertDetailSmallText'>"+alertData.emergencyMessage.issuedDateStr+"</div>";
            var text = toChangePAHtoPAI('type3');
            if(jQuery.isEmptyObject(alertData.emergencyMessage.effectiveEndTimeStr)==false){
                alertDetail = alertDetail + "<div id='alertDetailSmallText'>Effective End: "+alertData.emergencyMessage.effectiveEndTimeStr+"</div>";
            }
            alertDetail = alertDetail + "<div id='alertDetailSmallText'>Message ID: "+alertData.emergencyMessage.messageId+"</div>"+
                                            "<div id='alertDetailSmallText'>Priority: "+alertData.emergencyMessage.priority+"</div>"+
                                            "<div id='alertDetailMediumText'>Regions: "+alertData.emergencyMessage.commmaSeperatedRegions+"</div>"+
                                    "<div id='emptySpace' style='padding-top:8px !important;'></div>";
            if(alertData.emergencyMessage.pjmDrill&& alertData.emergencyMessage.pahEnabled){
                            alertDetail = alertDetail + "<div class='bannerTypeClass bannerBGColorPink' style='width: 353px !important;margin: auto;'><div id='bannerText'>Drill "+text+" Trigger</div></div>";
            }
            else if(alertData.emergencyMessage.pjmDrill){
                           alertDetail = alertDetail + "<div class='bannerTypeClass bannerBGColorPink' style='width: 353px !important;margin: auto;'><div id='bannerText'>Drill</div></div>";
            }
            else if(alertData.emergencyMessage.pahEnabled){
                           alertDetail = alertDetail + "<div class='bannerTypeClass bannerBGColorYellow' style='width: 353px !important;margin: auto;'><div id='bannerText'>"+text+" Trigger</div></div>";
            }    
            alertDetail = alertDetail + "</div>"+
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
                                            // "<div id='alertDetailSmallText'>Priority: "+alertData.emergencyMessage.priority+"</div>"+
                                            "<div id='alertDetailMediumText'>Regions: PJM-RTO</div>"+
                                    "<div id='emptySpace' style='padding-top:8px !important;'></div>";
            alertDetail = alertDetail + "<div class='bannerTypeClass bannerBGColorGreen' style='width: 353px !important;margin: auto;'><div id='bannerText'>Special Message</div></div>";  
            var sampleInput=alertData.messageVO.messageContent;
            var sampleOutput = [sampleInput.slice(0, sampleInput.indexOf(":")+3), "&#8203;", sampleInput.slice(sampleInput.indexOf(":")+3)].join('');
            var finalOutput = [sampleOutput.slice(0, sampleOutput.lastIndexOf(":")+3), "&#8203;", sampleOutput.slice(sampleOutput.lastIndexOf(":")+3)].join('');
            alertDetail = alertDetail + "</div>"+
                                "<div id='messageDiv'>"+
                                    finalOutput
                                "</div>";
    }
    var alertDetailDiv = document.getElementById("alertDetailTabContainer");
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
function loadViewLatestAlertsTab(data){

if( isiPadPro(device.model) || kendo.support.mobileOS.tablet && (device.platform == 'Android' || device.platform == 'android')){
        $('#markAllAsReadAnchorTabId').css('vertical-align','bottom');
        $('#markAllAsUnreadAnchorTabId').css('vertical-align','bottom');
    }
    var alertsdata = data;
    var alertsDiv = '';
    var commonArray=[];
   if(data == null 
        || data ==  undefined 
        || jQuery.isEmptyObject(data) 
        || (data!=null&&jQuery.isEmptyObject(data.deviceEPDataList)&&jQuery.isEmptyObject(data.deviceSpecialMessageDataList)) 
        || (jQuery.isEmptyObject(data.deviceEPDataList) == false && data.deviceEPDataList.length ==0) 
        ||(jQuery.isEmptyObject(data.deviceSpecialMessageDataList) == false && data.deviceSpecialMessageDataList.length ==0)){
        var viewAlertsdiv = document.getElementById("latestAlertsTabULDiv");
        viewAlertsdiv.innerHTML = "";
        $('.relative').css('height',$(window).height()-130);
        $('#markTab').hide();
        $('#noAlertDivTab').show();
    }
    else{
        if(jQuery.isEmptyObject(data.deviceEPDataList)){
            commonArray = data.deviceSpecialMessageDataList;
        }else{
             commonArray = data.deviceEPDataList.concat(data.deviceSpecialMessageDataList);
        }
        commonArray.sort(function(a, b) {
            if (a.postedTimeStamp > b.postedTimeStamp)
                return -1;
            if (a.postedTimeStamp < b.postedTimeStamp)
                return 1;
            return 0;
    });
    if(commonArray.length > 0){
        $('#markTab').show();
        $('#noAlertDivTab').hide();
        
        for (var i = 0; i < commonArray.length; i++) {
            if(!jQuery.isEmptyObject(commonArray[i].emergencyMessage) && jQuery.isEmptyObject(commonArray[i].messageVO)){
                alertsDiv = alertsDiv + "<li class='epDiv' style='width: 100%; list-style-type:none;padding-left: 0px !important;' id='"+commonArray[i].emergencyMessage.messageId+"'>";
                if(commonArray[i].read == false){
                        alertsDiv = alertsDiv +         "<div style='width:5%;float: left;height: 40px;'><div id='read_indicator_"+commonArray[i].emergencyMessage.messageId+"' class='unread_mes_TabLand'></div></div>";
                }else{
                        alertsDiv = alertsDiv +         "<div style='width:5%;float: left;height: 40px;'><div id='read_indicator_"+commonArray[i].emergencyMessage.messageId+"'></div></div>";  
                }
                        alertsDiv = alertsDiv +  "<div class='epAlertHeaderLeftDivTabLand'>"+
                                                "<div id='epMessageType'>"+
                                                        commonArray[i].emergencyMessage.messageType+
                                                "</div>"+
                                                "<div id='effectiveDateStr'>"+
                                                        commonArray[i].emergencyMessage.issuedDateStr+
                                                "</div>";
                var text = toChangePAHtoPAI('type3');
                if(commonArray[i].emergencyMessage.pjmDrill&& commonArray[i].emergencyMessage.pahEnabled){
                    // console.log("both Drill and PAH == true");
                    alertsDiv = alertsDiv + "<div class='bannerTypeClass bannerBGColorPink' style='width: 353px !important;margin: auto;'><div id='bannerText'>Drill "+text+" Trigger</div></div>";
                }
                else if(commonArray[i].emergencyMessage.pjmDrill){
                    alertsDiv = alertsDiv + "<div class='bannerTypeClass bannerBGColorPink' style='width: 353px !important;margin: auto;'><div id='bannerText'>Drill</div></div>";
                }
                else if(commonArray[i].emergencyMessage.pahEnabled){
                    alertsDiv = alertsDiv + "<div class='bannerTypeClass bannerBGColorYellow' style='width: 353px !important;margin: auto;'><div id='bannerText'>"+text+" Trigger</div></div>";
                }
                alertsDiv = alertsDiv + "</div>"+
                                        "<div class='alertEPImg'>"+
                                                "  <img width='15px' height='25px' src='styles/images/gray_arrow.png' />"+
                                        "</div>"+
                                        "<br style='clear: left;'/>"+
                                    "</li>";
                }else if(jQuery.isEmptyObject(commonArray[i].emergencyMessage) && !jQuery.isEmptyObject(commonArray[i].messageVO)){
                    alertsDiv = alertsDiv + "<li class='epDiv' style='width: 100%; list-style-type:none;padding-left: 0px !important;' id='"+commonArray[i].messageVO.messageId+"'>";
                    if(commonArray[i].read == false){
                            alertsDiv = alertsDiv +         "<div style='width:5%;float: left;height: 40px;'><div id='read_indicator_"+commonArray[i].messageVO.messageId+"' class='unread_mes_TabLand'></div></div>";
                    }else{
                            alertsDiv = alertsDiv +         "<div style='width:5%;float: left;height: 40px;'><div id='read_indicator_"+commonArray[i].messageVO.messageId+"'></div></div>";  
                    }
                            alertsDiv = alertsDiv +  "<div class='epAlertHeaderLeftDivTabLand'>"+
                                                    "<div id='epMessageType'>"+
                                                            commonArray[i].messageVO.messageTitle+
                                                    "</div>"+
                                                    "<div id='effectiveDateStr'>"+
                                                            commonArray[i].messageVO.startDate+
                                                    "</div>";
                        alertsDiv = alertsDiv + "<div class='bannerTypeClass bannerBGColorGreen' style='width: 353px !important;margin: auto;'><div id='bannerText'>Special Message</div></div>";
                    alertsDiv = alertsDiv + "</div>"+
                                            "<div class='alertEPImg'>"+
                                                    "  <img width='15px' height='25px' src='styles/images/gray_arrow.png' />"+
                                            "</div>"+
                                            "<br style='clear: left;'/>"+
                                        "</li>";
                }
        }
        var viewAlertsdiv = document.getElementById("latestAlertsTabULDiv");
        viewAlertsdiv.innerHTML = "";
        viewAlertsdiv.innerHTML = viewAlertsdiv.innerHTML + alertsDiv;
    }
  }
  try{
        setTimeout(()=>{
            window.plugins.spinnerDialog.hide();
        },50);
    } catch (error) {}    
}
function sendAlertsTabClick() {
    $('#alertTabView').hide();
    $('#backwardImage_Tab ').show();
    $('#backToNotifications_Tab').show();
    $('#headerTag').text('Send Alerts');
    $('#sendAlertTabView').show();
}
/*NotificationTabView*/
function setTabZoneLMPValues() {
    try{
        var LMPZoneArray = localStorage.getItem("sortableZoneArray");
        var sortableIncludeDiv = "";
        var sortableExcludeDiv = "";
        if (typeof LMPZoneArray === 'undefined' || LMPZoneArray === null) {
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
                    sortableIncludeDiv = sortableIncludeDiv 
                        + "<li class='nla' style = 'width:inherit;' ><a id=" + notificationsObj[i].zoneName + " data-role='button' onclick='setTabTitle(this.id)' style='height:44px;width: 100%;text-decoration: none;border-style: none;font-size:17px;' data-id='" 
                        + i + "' data-user=" + notificationsObj[i].zoneName + " >"
                        +"<div style='width:100%;'>"
                             +"<div style='height:44px;width: 50%;float:left;padding:0.5em;padding-left:3.5%;>"
                                 +"<div style='font-family:HelveticaNeue'>"  + notificationsObj[i].zoneName + "</div>"
                             +"</div>"
                             +"<div style='float:left;height:44px;width:42%;padding:0.6em;margin-left:15px !important;'>"
                                  +"<div class='includediv' style='line-height: 16px !important;width:32%;margin-top:-1%;float:right;margin-right:0px;font-family:HelveticaNeue;font-size:12px;'>"
                                          +"<div style='float:left;width:100%;'><div style='float:left;width:50%;'>Upper: </div><div id='upperText' style='float:right;text-align: right;width:50%;color:"+upperTextColor+" !important;'>"+upperThresholdValue+"</div></div>"
                                          +"<div style='float:left;width:100%;'><div style='float:left;width:50%;'>Lower: </div><div id='lowerText' style='float:right;text-align: right;width:50%;color:"+lowerTextColor+" !important;'>"+lowerThresholdValue+"</div></div>"
                                  +"</div>"   
                                
                             +"</div>"
                             +"<div style='width:5%;float:right; padding:0.7em;padding-left:0.1em;'>"
                                     +"<img class='arrowimg' width='9px' height='15px' src='styles/images/gray_arrow.png'/>"
                             +"</div>"
                        +"</div>"
                        +"</a></li>";
                }  else {
                    sortableExcludeDiv = sortableExcludeDiv 
                        + "<li class='nla' style = 'width:inherit;'><a id=" + notificationsObj[i].zoneName + " data-role='button' onclick='setTabTitle(this.id)' style='height:44px;width: 100%;text-decoration: none;border-style: none;font-size:17px;' data-id='" + i + "' "
                        +"data-user=" + notificationsObj[i].zoneName + " >"+
                        "<div style='height:44px;width: 93%;float:left;padding:0.7em;padding-left:3.5%;'><div style='font-family:HelveticaNeue'>" + notificationsObj[i].zoneName + "</div></div>"+
                        "<div class='arrowingdiv' style='float:right;height:44px;width: 7%;padding:0.7em;'>"+
                            "<div><img width='9px' height='15px' src='styles/images/gray_arrow.png'/></div>"+
                        "</div></a></li>";
                }
            }
        } else {
            var tempZoneLMPArray = JSON.parse(LMPZoneArray);
            for (var k = 0; k < tempZoneLMPArray.length; k++) {
                for (var i = 0; i < notificationsObj.length; i++) {
                    if (tempZoneLMPArray[k].Zone_LMP == notificationsObj[i].zoneName) {
                        if (notificationsObj[i].allowNotifications == 'On') {
                            var upperThresholdValue = notificationsObj[i].LMPValue;
                            var lowerThresholdValue = notificationsObj[i].lowerThresholdValue;
                            if (upperThresholdValue >= 0) {
                                upperThresholdValue = "$" + upperThresholdValue + ".00";
                            } else if (lowerThresholdValue < 0) {
                                upperThresholdValue = "None";
                            }
                            if (lowerThresholdValue >= 0) {
                                lowerThresholdValue = "$" + lowerThresholdValue + ".00";
                            } else if (lowerThresholdValue < 0) {
                                lowerThresholdValue = "None";
                            }
                            sortableIncludeDiv = sortableIncludeDiv + "<li class='nla' style = 'width:inherit;'><a id="+ notificationsObj[i].zoneName + " data-role='button' onclick='setTabTitle(this.id)' style='height:44px;width: 100%;text-decoration: none;border-style: none;font-size:17px;                                                                             data-id='" + i + "' data-user=" + notificationsObj[i].zoneName + " >"+
                                                                        "<div style='height:44px;width: 80%;float:left;padding:0.7em;padding-left:3.5%;'><div style='font-family:HelveticaNeue'>" + notificationsObj[i].zoneName + "</div></div>"+
                                                                        "<div align=right style='float:right;height:44px;width: 20%;padding:0.7em;'>"+
                                                                                "<div class='includediv' style='width:70%;float:right;margin-right:25px;color:black;margin-left:22%'>" + value + "</div>"+
                                                                                "<div style='width:0%;margin-right:5%'><img class='arrowimg' width='9px' height='15px' src='styles/images/gray_arrow.png' style='margin-left:75%'/></div>"+
                                                                        "</div></a></li>";
                        } else {
                            sortableExcludeDiv = sortableExcludeDiv + "<li class='nla' style = 'width:inherit;'><a id=" + notificationsObj[i].zoneName + " data-role='button' onclick='setTabTitle(this.id)' style='height:44px;width: 100%;text-decoration: none;border-style: none;font-size:17px;'                                                                           data-id='" + i + "' data-user=" + notificationsObj[i].zoneName + " >"+
                                                                        "<div style='height:44px;width: 93%;float:left;padding:0.7em;padding-left:3.5%;'><div style='font-family:HelveticaNeue'>" + notificationsObj[i].zoneName + "</div></div>"+
                                                                        "<div class='arrowingdiv' style='float:right;height:44px;width: 7%;padding:0.7em;'><div><img width='9px' height='15px' src='styles/images/gray_arrow.png' style='margin-left:75%'/></div></div>"+
                                                                    "</a></li>";
                        }
                    }
                }
            }
        }
        var LMPListIncludeDiv = document.getElementById("notificationsIncludeLMPTabList");
        if (sortableIncludeDiv == '') {
            LMPListIncludeDiv.innerHTML = "";
            $('#includeTabNone').show();
        } else {
            LMPListIncludeDiv.innerHTML = "";
            LMPListIncludeDiv.innerHTML = LMPListIncludeDiv.innerHTML + sortableIncludeDiv;
            $('#includeTabNone').hide();
        }

        var LMPListExcludeDiv = document.getElementById("notificationsExcludeLMPTabList");
        if (sortableExcludeDiv == '') {
            LMPListExcludeDiv.innerHTML = "";
            $('#excludeTabNone').show();
        } else {
            LMPListExcludeDiv.innerHTML = "";
            LMPListExcludeDiv.innerHTML = LMPListExcludeDiv.innerHTML + sortableExcludeDiv;
            $('#excludeTabNone').hide();
        }
        $("#notificationsIncludeLMPTabList  li:first").css("border", "none");
        $("#notificationsExcludeLMPTabList li:first").css("border", "none");   
   }catch(e){}     
}
function setTabZoneLMPValuesM() {
    try{
        var LMPZoneArray = localStorage.getItem("sortableZoneArray");
        var sortableIncludeDiv = "";
        var sortableExcludeDiv = "";
        if (typeof LMPZoneArray === 'undefined' || LMPZoneArray === null) {
            for (var i = 0; i < notificationsObj.length; i++) {
                if (notificationsObj[i].allowNotifications == 'On') {
                    var value = notificationsObj[i].LMPValue;
                    if (value >= 0) {
                        value = "$" + value + ".00"
                    } else if (value < 0) {
                        value = "-$" + -(value) + ".00"
                    }
                    sortableIncludeDiv = sortableIncludeDiv + "<li class='nla' style = 'width:inherit;' ><a id=" + notificationsObj[i].zoneName + " data-role='button' onclick='setTabTitle(this.id)' style='height:44px;width: 100%;text-decoration: none;border-style: none;font-size:17px;' data-id='" 
                        + i + "' data-user=" + notificationsObj[i].zoneName + " >"+
                            "<div style='height:44px;width: 80%;float:left;padding:0.7em;padding-left:3.5%;'><div style='font-family:HelveticaNeue'>" + notificationsObj[i].zoneName + "</div></div>"+
                            "<div align=right style='float:right;height:44px;width: 20%;padding:0.7em;'>"+
                                    "<div class='includediv' style='width:70%;float:right;margin-right:25px;color:black;'>" + value + "</div>"+
                                    "<div style='width:0%;margin-right:5%'><img class='arrowimg' width='9px' height='15px' src='styles/images/gray_arrow.png'/></div>"+
                            "</div></a></li>";
                } else {
                    sortableExcludeDiv = sortableExcludeDiv + "<li class='nla' style = 'width:inherit;'><a id=" + notificationsObj[i].zoneName + " data-role='button' onclick='setTabTitle(this.id)' style='height:44px;width: 100%;text-decoration: none;border-style: none;font-size:17px;' data-id='" +                                                              i + "' data-user=" + notificationsObj[i].zoneName + " >"+
                                                                "<div style='height:44px;width: 93%;float:left;padding:0.7em;padding-left:3.5%;'><div style='font-family:HelveticaNeue'>" + notificationsObj[i].zoneName + "</div></div>"+
                                                                "<div class='arrowingdiv' style='float:right;height:44px;width: 7%;padding:0.7em;'>"+
                                                                    "<div><img width='9px' height='15px' src='styles/images/gray_arrow.png'/></div>"+
                                                                "</div>"+
                                                            "</a></li>";
                }
            }
        } else {
            var tempZoneLMPArray = JSON.parse(LMPZoneArray);
            for (var k = 0; k < tempZoneLMPArray.length; k++) {
                for (var i = 0; i < notificationsObj.length; i++) {
                    if (tempZoneLMPArray[k].Zone_LMP == notificationsObj[i].zoneName) {
                        if (notificationsObj[i].allowNotifications == 'On') {
                            var value = notificationsObj[i].LMPValue;
                            if (Number(value) >= 0) {
                                value = "$" + value + ".00"
                            } else if (Number(value) < 0) {
                                value = "-$" + Number(-value) + ".00"
                            }
                            sortableIncludeDiv = sortableIncludeDiv + "<li class='nla' style = 'width:inherit;'><a id=" + notificationsObj[i].zoneName+ " data-role='button' onclick='setTabTitle(this.id)' style='height:44px;width: 100%;text-decoration: none;border-style: none;font-size:17px;'                                                            data-id='" + i + "' data-user=" + notificationsObj[i].zoneName + " >"+
                                                    "<div style='height:44px;width: 80%;float:left;padding:0.7em;padding-left:3.5%;'><div style='font-family:HelveticaNeue'>" + notificationsObj[i].zoneName + "</div></div>"+
                                                    "<div align=right style='float:right;height:44px;width: 20%;padding:0.7em;'>"+
                                                        "<div class='includediv' style='width:70%;float:right;margin-right:25px;color:black;margin-left:22%'>" + value + "</div>"+
                                                        "<div style='width:0%;margin-right:5%'><img class='arrowimg' width='9px' height='15px' src='styles/images/gray_arrow.png' style='margin-left:75%'/></div>"+
                                                    "</div></a></li>";
                        } else {
                            sortableExcludeDiv = sortableExcludeDiv + "<li class='nla' style = 'width:inherit;'><a id=" + notificationsObj[i].zoneName + " data-role='button' onclick='setTabTitle(this.id)' style='height:44px;width: 100%;text-decoration: none;border-style: none;font-size:17px;'                                                   data-id='" + i + "' data-user=" + notificationsObj[i].zoneName + " >"+
                                                "<div style='height:44px;width: 93%;float:left;padding:0.7em;padding-left:3.5%;'><div style='font-family:HelveticaNeue'>" + notificationsObj[i].zoneName + "</div></div>"+
                                                "<div class='arrowingdiv' style='float:right;height:44px;width: 7%;padding:0.7em;'><div><img width='9px' height='15px' src='styles/images/gray_arrow.png' style='margin-left:75%'/></div></div>"+
                                            "</a></li>";
                        }
                    }
                }
            }
        }

        var LMPListIncludeDiv = document.getElementById("notificationsIncludeLMPTabList");
        if (sortableIncludeDiv == '') {
            LMPListIncludeDiv.innerHTML = "";
            $('#includeTabNone').show();
        } else {
            LMPListIncludeDiv.innerHTML = "";
            LMPListIncludeDiv.innerHTML = LMPListIncludeDiv.innerHTML + sortableIncludeDiv;
            $('#includeTabNone').hide();
        }

        var LMPListExcludeDiv = document.getElementById("notificationsExcludeLMPTabList");
        if (sortableExcludeDiv == '') {
            LMPListExcludeDiv.innerHTML = "";
            $('#excludeTabNone').show();
        } else {
            LMPListExcludeDiv.innerHTML = "";
            LMPListExcludeDiv.innerHTML = LMPListExcludeDiv.innerHTML + sortableExcludeDiv;
            $('#excludeTabNone').hide();
        }
        $("#notificationsIncludeLMPTabList li:first").css("border", "none");
        $("#notificationsExcludeLMPTabList li:first").css("border", "none");
   }catch(e){}
}
setTabZoneLMPValues();
function setTabTitle(title) {
    runningPageChange(12); 
    defaultMorePrevPageInPortrait = 12;
    if (title == 'WESTERN') {
        myTitle = "WESTERN HUB";
    } else {
        myTitle = title;
    }
    try {
        setTabnotificationValues();
    } catch (ex) {}
    $('#notificationTabView').hide();
    $('#backToZoneLMP_Tab').show();
    $('#backToNotifications_Tab').hide();
    $('#headerTag').text(myTitle);
    $('#individualNotificationTabView').show();
}
/*individualNotificationTabView*/
function backToNotificationsClick_Tab() {
    $('#sendAlertTabView').hide();
    $('#notificationTabView').hide();
    $('#backToNotifications_Tab').hide();
    $('#backwardImage_Tab').hide();
    $('#headerTag').text('Alerts');
    $('#alertTabView').show();
    $('#latestAlertsTabView').hide();
    $('#epAlertsTabView').hide();
    //loadMoreScreen();
    alertsService.displayAlertsStatus();
    runningPageChange(9);
    defaultMorePrevPageInPortrait = 9;
    updateBadgeInLandScapeMode();
}
function backToZoneLMPClick_Tab() {
    $('#notificationTabView').show();
    $('#backToNotifications_Tab').show();
    $('#backToZoneLMP_Tab').hide();
    $('#headerTag').text('Zone LMP');
    $('#individualNotificationTabView').hide();
    runningPageChange(11);
    defaultMorePrevPageInPortrait = 11;
}
function backToLatestAlertsClick_Tab(){
    if($('#headerTag').text()=="Alert Detail"){
            if(alertData.read==true){
                if(!jQuery.isEmptyObject(alertData.emergencyMessage) && $('#read_indicator_'+alertData.emergencyMessage.messageId).hasClass("unread_mes")){
                    $('#read_indicator_'+alertData.emergencyMessage.messageId ).removeClass("unread_mes");
                }else if(!jQuery.isEmptyObject(alertData.messageVO) && $('#read_indicator_'+alertData.messageVO.messageId).hasClass("unread_mes")){
                    $('#read_indicator_'+alertData.messageVO.messageId ).removeClass("unread_mes");
                }
            }
            $('#backToNotifications_Tab').show();
            $('#backToLatestAlerts_Tab').hide();
            $('#headerTag').text('Latest Alerts and Messages');
            loadViewLatestAlertsTab(dbapp.emergencyProcedureData);
            $('#latestAlertsTabView').show();
            $('#alertDetailTabView').hide();
            runningPageChange(10);
            defaultMorePrevPageInPortrait = 10;
    }
}
function regionOKButtonTab(){		
    var regionsPopupDiv = $("#regionsPopupTab");		
    regionsPopupDiv.data("kendoWindow").close();		
}
function backToEPClick_Tab(){   
    var needToBeAlerted = false;
    if(runningPage == 17){	
            if(allRegionsDeselected == true || allStatesDeselected == true){		
                needToBeAlerted = true;		
                    if(allRegionsDeselected == true){		
                            $("#regionsPopupTab").html("");
                            $("#regionsPopupTab").html("<div id='upper' style='height:66.5%; '> " +
                                "<div style='padding-top:18px;font-size:25px;color:black;'><h6 style='-webkit-margin-before: 0.25em !important;-webkit-margin-after: 0.30em !important;text-align:center;'>Warning</h6></div>" +
                                    "<span style='display:block;padding:3px;font-size:14px;color:black;text-align:center;'>You must select at least one Region/Zone.</span>" +
                                "</div>" +
                                "<div id='lower' style='height:33.5%;'>" +
                                    "<div style='border-top: 1px solid #DCDFE1;padding-top:2PX;'></div>" +
                                    "<div style='padding-top:11px;padding-bottom:5px;font-size: 17px !important;text-align:center;' onclick='regionOKButtonTab()'>" +
                                        "<a style='color:#007aff !important;'>OK</a>" +
                                    "</div>" +
                                "</div>"
                            );
                            var regionsPopupDiv = $("#regionsPopupTab");
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
                    }else{
                         navigator.notification.alert("You must select at least one State.", null, "Warning", "OK");
                    }
                setTimeout(function(){
                    $('div.km-footer div.km-widget.km-tabstrip a.km-state-active').removeClass("km-state-active");
                    $('div.km-footer div.km-widget.km-tabstrip a:nth-child(4)').addClass("km-state-active");
                },300);
            }
          }else if(runningPage == 18){
              if(allTypesDeselected == true && localStorage.getItem("PAHTypesOnlyEnabledFlag") == 'false'){
                needToBeAlerted = true;
                navigator.notification.alert("You must select at least one Type.", null, "Warning", "OK");
                setTimeout(function(){
                    $('div.km-footer div.km-widget.km-tabstrip a.km-state-active').removeClass("km-state-active");
                    $('div.km-footer div.km-widget.km-tabstrip a:nth-child(4)').addClass("km-state-active");
                },300);
            }
          } 
        if(needToBeAlerted==false) {
              if($('#headerTag').text()=="Types" || $('#headerTag').text()=="Areas"){
                runningPageChange(16);
                defaultMorePrevPageInPortrait = 16;
                $('#backToNotifications_Tab').show();
                $('#backToEP_Tab').hide();
                $('#headerTag').text('Emergency Procedures');
                $('#epAlertsTabView').show();
                $('#epTypesTabView').hide();
                $('#epAreasTabView').hide();
                var areaSelected = localStorage.getItem("AreaSelected");
                if(areaSelected == null || areaSelected == undefined || areaSelected == 'region'){
                       $('#areaSelectedTextLandTab').text("By Region/Zone");
                }else if(areaSelected == "state"){
                       $('#areaSelectedTextLandTab').text("By State");
                }
                populateEPTypeSelectedStatus();
            }
        }
}
var editThresholdValueTab = true;
function LMPCancelClicked(e) {
    runningPageChange(12);
    editThresholdValueTab = true;
    defaultMorePrevPageInPortrait = 12;
    try{
     	window.screen.unlockOrientation();
    }catch(error){}
    $("#textBox1").text('');
    $(e).closest("[data-role=window]").kendoWindow("close");
}
function LMPDoneClicked(e) {
    runningPageChange(12);
    defaultMorePrevPageInPortrait = 12;
    try{
        window.screen.unlockOrientation();
    }catch(error){}
    var setValue = $('#textBox1').text();
    var thresholdValue = parseInt(setValue);
    if (setValue == '') {
        alert('You must set the LMP for zones', null, "PJM Now", "OK");
    } else {
        $("#textBox1").text('');
        var deviceuuid = localStorage.getItem("deviceuuId");
        if($('#thresholdSetTabTitle').text() == "Set Upper Limit"){
                updateUser_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceZoneThresholdValue';
                data = { "zoneName": myTitle, 
                        "thresholdValue": thresholdValue,
                        "deviceData": {
                            "udid": deviceuuid
                        }
                }
                $(e).closest("[data-role=window]").kendoWindow("close");
            }else if($('#thresholdSetTabTitle').text() == "Set Lower Limit"){
                updateUser_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceZoneLowerThresholdValue';
                data = { "zoneName": myTitle, 
                        "lowerThresholdValue": thresholdValue,
                        "deviceData": {
                        "udid": deviceuuid
                        }
                }
                $(e).closest("[data-role=window]").kendoWindow("close");
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
                        if(upperLimitTabScreenHasToBeDisplayed == true){
                            $.each(notificationsObj, function () {
                                if (this.zoneName === myTitle) {
                                    this.LMPValue = thresholdValue;
                                }
                            });
                            if (thresholdValue >= 0) {
                                document.getElementById("individualLMPUpperValueTab").innerHTML="$"+thresholdValue+".00";
                            } else {
                                document.getElementById("individualLMPUpperValueTab").innerHTML="None";
                            }
                        }else if(lowerLimitTabScreenHasToBeDisplayed == true){
                            $.each(notificationsObj, function () {
                                if (this.zoneName === myTitle) {
                                    this.lowerThresholdValue = thresholdValue;
                                }
                            });
                            if (thresholdValue >= 0) {
                                    document.getElementById("individualLMPLowerValueTab").innerHTML="$"+thresholdValue+".00";
                            } else {
                                    document.getElementById("individualLMPLowerValueTab").innerHTML="None";
                            }
                        }
                        upperLimitTabScreenHasToBeDisplayed = false;
                        lowerLimitTabScreenHasToBeDisplayed = false;
                        localStorage.setItem("notificationDetails", JSON.stringify(notificationsObj));
                        try{
                            setnotificationValues();
                            setZoneLMPValues();
                        }catch(e){}
                        try{
                            setTabnotificationValues();
                            setTabZoneLMPValues();
                            editThresholdValueTab = true;
                        }catch(e){}
                    }else{
                        alert(networkProblemMessage, null, "PJM Now", "OK");
                    }
                    try{
                        window.plugins.spinnerDialog.hide();
                    }catch(e){
                    }
                },
                error: function (r, s, e) {
                    if (!isOnline()) {
                        alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
                    } else if (s === 'timeout') {
                        alert(networkTimeoutMessage, null, "PJM Now", "OK");
                    } else {
                        alert(networkProblemMessage, null, "PJM Now", "OK");
                    }
                    try{
                        window.plugins.spinnerDialog.hide();
                    }catch(e){
                    }
                },
                beforeSend: function () {},
                complete: function (data) {}
            });
    }
}
function addCodeLand(number) {
    var length = $('#textBox1').text().length;
    if (number == '#') {
        $('#textBox1').text($('#textBox1').text().slice(0, -1));
    } 
    else {
        if (length < 4) {
            $('#textBox1').text($('#textBox1').text() + number);
        }
    }
}
var lowerThresholdValueTabGlobal;
var upperThresholdValueTabGlobal;
function setTabnotificationValues() {
    setTimeout(function () {
        var switchInstance = $("#individualTabswitch").data("kendoMobileSwitch");
        var notificationsAllowed;
        $.each(notificationsObj, function () {
            if (this.zoneName === myTitle) {
                notificationsAllowed = this.allowNotifications;
                upperThresholdValueTabGlobal = this.LMPValue;
                lowerThresholdValueTabGlobal = this.lowerThresholdValue;
            }
        });
        if (upperThresholdValueTabGlobal >= 0) {
                document.getElementById("individualLMPUpperValueTab").innerHTML="$"+upperThresholdValueTabGlobal+".00";
        } else {
                document.getElementById("individualLMPUpperValueTab").innerHTML="None";
        }
        if (lowerThresholdValueTabGlobal >= 0) {
                document.getElementById("individualLMPLowerValueTab").innerHTML="$"+lowerThresholdValueTabGlobal+".00";
        } else {
                document.getElementById("individualLMPLowerValueTab").innerHTML="None";
        }
        if (notificationsAllowed == 'Off') {
            $('#frequncyTabDiv').hide();
            switchInstance.check(false);
        } else if (notificationsAllowed == 'On') {
            $('#frequncyTabDiv').show();
            switchInstance.check(true);
        }
    }, 100);
}
function onIndividualTabChange(e) {
    var landscape = false;
        if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
                                var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
                                if (screenOrientation == 90) {
                                    landscape = true;
                                }
        }else{
                landscape = false;
        }
    window.plugins.spinnerDialog.show();
    var notificationsenabled = false;
    if (e.checked) {
        notificationsenabled = true;
    } else {
        notificationsenabled = false;
    }
    var deviceuuid = localStorage.getItem("deviceuuId");
    var notificationStatus_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceZoneNotificationFlag';
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
            "zoneName": myTitle,
            "notificationEnabledFlag": notificationsenabled,
            "deviceData": {
                "udid": deviceuuid
            }
        }),
        success: function (data) {
            if(data.success){
                var zoneLMPActiveAlertsSetCount = localStorage.getItem("zoneLMPActiveAlertsSetCount");
                var lowerThresholdValue;
                var upperThresholdValue;
                if (notificationsenabled) {
                    zoneLMPActiveAlertsSetCount++;
                    $.each(notificationsObj, function () {
                        if (this.zoneName === myTitle) {
                            lowerThresholdValue = this.lowerThresholdValue;
                            upperThresholdValue = this.LMPValue;
                            this.allowNotifications = "On";
                        }
                    });
                    localStorage.setItem("notificationDetails", JSON.stringify(notificationsObj));
                    notificationsObj = JSON.parse(localStorage.getItem("notificationDetails"));
                    if(landscape==true){
                        $('#frequncyTabDiv').show();
                        if (upperThresholdValue >= 0) {
                            document.getElementById("individualLMPUpperValueTab").innerHTML="$"+upperThresholdValue+".00";
                        } else {
                            document.getElementById("individualLMPUpperValueTab").innerHTML="None";
                        }
                        if (lowerThresholdValue >= 0) {
                            document.getElementById("individualLMPLowerValueTab").innerHTML="$"+lowerThresholdValue+".00";
                        } else {
                            document.getElementById("individualLMPLowerValueTab").innerHTML="None";
                        }
                    }else{
                        $('#frequncyDiv').show();
                    }
                } else {
                    zoneLMPActiveAlertsSetCount--;
                    $.each(notificationsObj, function () {
                        if (this.zoneName === myTitle) {
                            this.allowNotifications = "Off";
                        }
                    });
                    localStorage.setItem("notificationDetails", JSON.stringify(notificationsObj));
                    notificationsObj = JSON.parse(localStorage.getItem("notificationDetails"));
                    if(landscape==true){
                        $('#frequncyTabDiv').hide();
                    }else{
                        $('#frequncyDiv').hide();
                    }
                }
                if(landscape==true){
                    setTabZoneLMPValues();
                }
                localStorage.setItem("zoneLMPActiveAlertsSetCount",zoneLMPActiveAlertsSetCount);
                if(zoneLMPActiveAlertsSetCount>0){
                    localStorage.setItem("ZoneLMPNotificationStatus","On");
                }else{
                    localStorage.setItem("ZoneLMPNotificationStatus","Off");
                }
            }else{
                navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
               if(landscape==false){
                    var switchInstance = $("#individualSwitch").data("kendoMobileSwitch");
                    switchInstance.check(!notificationsenabled);
                }else{
                    var switchInstance = $("#individualTabswitch").data("kendoMobileSwitch");
                        switchInstance.check(!notificationsenabled);
                }
            }
            try{
                window.plugins.spinnerDialog.hide();
            }catch(e){}
        },
        error: function (r, t, e) {
            if(landscape==false){
                var switchInstance = $("#individualSwitch").data("kendoMobileSwitch");
                    switchInstance.check(!notificationsenabled);
            }else{
                var switchInstance = $("#individualTabswitch").data("kendoMobileSwitch");
                    switchInstance.check(!notificationsenabled);
            }
             if (!isOnline()) {
                 navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
             } else if(t === 'timeout') {
                 navigator.notification.alert(networkTimeoutMessage, null, "PJM Now", "OK");
             } else {
                   navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
             }
             try{
                window.plugins.spinnerDialog.hide();
            }catch(e){}
        },
        beforeSend: function () {},
        complete: function (data) {}
    });
}
setTabnotificationValues();
/*Send Alerts Tab View*/
function setnumOfZones_Tab() {
    var allSelected = localStorage.getItem('allZonesSelected');
    if (typeof allSelected === 'undefined' || allSelected === null) {
        $('#numofZones_Tab').text('All');
    } else {
        $('#numofZones_Tab').text(allSelected);
    }
}
setnumOfZones_Tab();
function selectZones_Tab() {
   // $('#zonesListTabView').show();
    $('#backSendAlerts_Tab').show();
    $('#backToNotifications_Tab ').hide();
    $('#headerTag').text('Zones');
    $('#sendAlertTabView').hide();
}
/*Zones List Tab View*/
function backToSendAlerts_Tab() {
    setnumOfZones_Tab();
    //$('#zonesListTabView').hide();
    $('#backSendAlerts_Tab').hide();
    $('#backToNotifications_Tab').show();
    $('#headerTag').text('Send Alerts');
    $('#sendAlertTabView').show();
}
/* ViewLAtestAlertsTabView */
function loadLatestAlertsView_Tab() {
    getLatestAlertsData_Tab();
    $('#alertTabView').hide();
    $('#backwardImage_Tab ').show();
    $('#backToNotifications_Tab').show();
    $('#headerTag').text('Latest Alerts and Messages');
    $('#latestAlertsTabView').show();
}
function getLatestAlertsData_Tab() {
    var deviceuuid = localStorage.getItem("deviceuuId");
    $.ajax({
        type: "POST",
        async: false,
        url: serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/viewLatestAlerts',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: {
            'Origin': 'file:///'
        },
        data: JSON.stringify({
            "udid": deviceuuid
        }),
        success: function (data) {
            loadViewLatestAlertsTab(data);
        },
        error: function (r, s, e) {
            navigator.notification.alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
        },
        beforeSend: function (xhr, settings) {},
        complete: function (data) {}
    });
}
$(document).ready(function () {
    $('#Okbtn_AlertsTab').click(function () {
        var alertsScreenName = "Alerts";
        if(device.platform == 'Android' || device.platform == 'android'){
                Base64.fileCreationInAndroidAndSendMail(alertsScreenName); 
        } else if(device.platform == "iOS"){
                var  encodedDeviceData = Base64.get_encoded_device_data();
                var filePath = 'base64:device_info.txt//'+ encodedDeviceData +'/...';
                Base64.sendAMail(filePath,alertsScreenName);
        }
        $(this).closest("[data-role=window]").kendoWindow("close");
    });
    $('#Laterbtn_AlertsTab').click(function () {
        $(this).closest("[data-role=window]").kendoWindow("close");
        localStorage.setItem('alertsEnabledClicks', 0);
    });
    /*individualNotificationTabView*/
    $('#editTabVal').click(function () {
        runningPageChange(13);
        defaultMorePrevPageInPortrait = 13;
        $(window).bind('touchmove', function (e) {
            e.preventDefault();
        });
        $("#valueforZoneCal").hide();
        setTimeout(function () {
            var graphPopupdiv = $("#LMPValueScreen");
            if (!graphPopupdiv.data("kendoWindow")) {
                if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
                    graphPopupdiv.kendoWindow({
                        width: "320px",
                        height: "503px",
                        title: false,
                        draggable: false,
                        resizable: false,
                        modal: true,
                        position: {
                            left: "50%",
                            top: "16%"
                        }
                    });
                } else {
                    graphPopupdiv.kendoWindow({
                        width: "320px",
                        height: "503px",
                        display: 'fixed',
                        title: false,
                        scrollable: false,
                        draggable: false,
                        resizable: false,
                        modal: true,
                        position: {
                            left: "50%",
                            top: "16%"
                        }
                    });
                }
                var win1 = graphPopupdiv.data("kendoWindow");
                try{
                 window.screen.lockOrientation("landscape");
                }catch(error){}
                win1.open();
            } else {
                 try{
                 window.screen.lockOrientation("landscape");
                }catch(error){}
                var win1 = graphPopupdiv.data("kendoWindow");
                win1.open();
            }
        }, 100);
    });
    /* Send Alerts Tab View*/
    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    };
    $('#txtarea_Tab').css('height', (size.height / 4));
    $('#subjectTxtBoxDiv_Tab').click(function () {
        $('#subTxt_Tab').focus();
    });
    /*Zones List Tab View*/
    $('#allTab').click(function () {
        var allSelected = localStorage.getItem('allZonesSelected');
        if (typeof allSelected === 'undefined' || allSelected === null) {
            localStorage.setItem('allZonesSelected', 'All');
        } else {
            if (allSelected == 'All') {
                localStorage.setItem('allZonesSelected', 'None');
                $.each(notificationsObj, function () {
                    this.zoneSelected = 'No';
                });
                $('.freqImgsTab').hide();
            } else {
                localStorage.setItem('allZonesSelected', 'All');
                $.each(notificationsObj, function () {
                    this.zoneSelected = 'Yes';
                });
                $('.freqImgsTab').show();
            }
        }
    });
    $(".zoneListliTab").click(function () {
        var selectedimage = $(this).children().find('img').first();
        var selectedZone = $(this).children().find('span').text();
        var isSelected = 'Yes';
        var allZonesSelected = 'Yes';
        $.each(notificationsObj, function () {
            if (this.zoneName === selectedZone) {
                if (this.zoneSelected == 'Yes') {
                    this.zoneSelected = 'No';
                    $('#allImgTab').hide();
                    selectedimage.hide();
                } else {
                    this.zoneSelected = 'Yes';
                    selectedimage.show();
                }
            }
            if (this.zoneSelected == 'No') {
                allZonesSelected = 'No';
            }
        });
        if (allZonesSelected == 'Yes') {
            $('#allImgTab').show();
            localStorage.setItem('allZonesSelected', 'All');
        } else {
            localStorage.setItem('allZonesSelected', 'Multiple');
        }
    });
    var notificationlastY;
    var notificationcurrentY;
    var notificationtoscroll = true;
    $('#notificationTabView').bind('touchstart', function (e) {
        if (notificationtoscroll) {
            var currentY = e.originalEvent.touches[0].clientY;
            notificationlastY = currentY;
        }
    });
    $('#notificationTabView').bind('touchmove', function (e) {
        if (notificationtoscroll) {
            var currentY = e.originalEvent.touches[0].clientY;
            delta = currentY - notificationlastY;
            this.scrollTop += delta * -1;
            notificationlastY = currentY;
        }
    });
    /** ep areas scroll functionality start ***/
    var epAreaslastY;
    var epAreascurrentY;
    var epAreastoscroll = true;
    $('#epAreasTabView').bind('touchstart', function (e) {
        if (epAreastoscroll) {
            var currentY = e.originalEvent.touches[0].clientY;
            epAreaslastY = currentY;
        }
    });
    $('#epAreasTabView').bind('touchmove', function (e) {
        if (epAreastoscroll) {
            var currentY = e.originalEvent.touches[0].clientY;
            delta = currentY - epAreaslastY;
            this.scrollTop += delta * -1;
            epAreaslastY = currentY;
        }
    });
    /** ep areas scroll functionality end ***/
    /** ep types scroll functionality start ***/
    var epTypeslastY;
    var epTypescurrentY;
    var epTypestoscroll = true;
    $('#epTypesTabView').bind('touchstart', function (e) {
        if (epTypestoscroll) {
            var currentY = e.originalEvent.touches[0].clientY;
            epTypeslastY = currentY;
        }
    });
    $('#epTypesTabView').bind('touchmove', function (e) {
        if (epTypestoscroll) {
            var currentY = e.originalEvent.touches[0].clientY;
            delta = currentY - epTypeslastY;
            this.scrollTop += delta * -1;
            epTypeslastY = currentY;
        }
    });
    /** ep types scroll functionality end ***/
     /** latest alerts scroll functionality start ***/
    var latestAlertslastY;
    var latestAlertstoscroll = true;
    $('#latestAlertsTabView').bind('touchstart', function (e) {
        if (latestAlertstoscroll) {
            var currentY = e.originalEvent.touches[0].clientY;
            latestAlertslastY = currentY;
        }
    });
   $('#latestAlertsTabView').bind('touchmove', function (e) {
        if (latestAlertstoscroll) {
            var currentY = e.originalEvent.touches[0].clientY;
            delta = currentY - latestAlertslastY;
            this.scrollTop += delta * -1;
            latestAlertslastY = currentY;
        }
    });
    if(moreScreenLoaded==false){
            $("#tabkey1").kendoTouch({
                touchstart: function (e) {
                    if(editThresholdValueTab){ 
                        $("#textBox1").text('');
                        editThresholdValueTab = false;
                    }
                    addCodeLand('1');
                }
            });
            $("#tabkey2").kendoTouch({
                touchstart: function (e) {
                    if(editThresholdValueTab){ 
                        $("#textBox1").text('');
                        editThresholdValueTab = false;
                    }
                    addCodeLand('2');
                }
            });
            $("#tabkey3").kendoTouch({
                touchstart: function (e) {
                    if(editThresholdValueTab){ 
                        $("#textBox1").text('');
                        editThresholdValueTab = false;
                    }
                    addCodeLand('3');
                }
            });
            $("#tabkey4").kendoTouch({
                touchstart: function (e) {
                    if(editThresholdValueTab){ 
                        $("#textBox1").text('');
                        editThresholdValueTab = false;
                    }
                    addCodeLand('4');
                }
            });
            $("#tabkey5").kendoTouch({
                touchstart: function (e) {
                    if(editThresholdValueTab){ 
                        $("#textBox1").text('');
                        editThresholdValueTab = false;
                    }
                    addCodeLand('5');
                }
            });
            $("#tabkey6").kendoTouch({
                touchstart: function (e) {
                    if(editThresholdValueTab){ 
                        $("#textBox1").text('');
                        editThresholdValueTab = false;
                    }
                    addCodeLand('6');
                }
            });
            $("#tabkey7").kendoTouch({
                touchstart: function (e) {
                    if(editThresholdValueTab){ 
                        $("#textBox1").text('');
                        editThresholdValueTab = false;
                    }
                    addCodeLand('7');
                }
            });
            $("#tabkey8").kendoTouch({
                touchstart: function (e) {
                    if(editThresholdValueTab){ 
                        $("#textBox1").text('');
                        editThresholdValueTab = false;
                    }
                    addCodeLand('8');
                }
            });
            $("#tabkey9").kendoTouch({
                touchstart: function (e) {
                    if(editThresholdValueTab){ 
                        $("#textBox1").text('');
                        editThresholdValueTab = false;
                    }
                    addCodeLand('9');
                }
            });
            $("#tabkey0").kendoTouch({
                touchstart: function (e) {
                    if(editThresholdValueTab){ 
                        $("#textBox1").text('');
                        editThresholdValueTab = false;
                    }
                    addCodeLand('0');
                }
            });
            $("#tabkeyMinus").kendoTouch({
                touchstart: function (e) {
                    //addCodeLand('clear');
                    //$("#LMPValueScreen").data("kendoWindow").close();
                    $('#textBox1').text($('#textBox1').text().slice(0, -(length)));
                    
                    clearCodeLand();       
                
                }
            });
            $("#tabkeyDelete").kendoTouch({
                touchstart: function (e) {
                    editThresholdValueTab = false;
                    addCodeLand('#');
                }
            });
    }
});
function reservesClick() {
    runningPageChange(19);
    //lockToPortraitMode();
}
function legalDisclaimerCount() {
    runningPageChange(7);
    lockToPortraitMode();
}
function aboutPJMCount() {
    runningPageChange(8);
    lockToPortraitMode();
}
function notificationCount() {
    try {
        setAlertsAllowedValue();
    } catch (ex) {}
    runningPageChange(9);
    lockToPortraitMode();
}
function feedbackCount() {
    runningPageChange(14);
    lockToPortraitMode();
}
function lockToPortraitMode() {
    try {
        window.screen.lockOrientation('portrait');
    } catch (error) {}
}
function clearCodeLand() {
    runningPageChange(12);
    defaultMorePrevPageInPortrait = 12;
    try{
     	window.screen.unlockOrientation();
    }catch(error){}
    $("#textBox1").text('');
    var thresholdValue = 'None';
        var deviceuuid = localStorage.getItem("deviceuuId");
        if($('#thresholdSetTabTitle').text() == "Set Upper Limit"){
                updateUser_URL = serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/updateDeviceZoneThresholdValue';
                data = { "zoneName": myTitle, 
                        "thresholdValue": thresholdValue,
                        "deviceData": {
                            "udid": deviceuuid
                        }
                }
            }else if($('#thresholdSetTabTitle').text() == "Set Lower Limit"){
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
                        if(upperLimitTabScreenHasToBeDisplayed == true){
                            $.each(notificationsObj, function () {
                                if (this.zoneName === myTitle) {
                                    this.LMPValue = thresholdValue;
                                }
                            });
                            document.getElementById("individualLMPUpperValueTab").innerHTML="None";
                        }else{
                            $.each(notificationsObj, function () {
                                if (this.zoneName === myTitle) {
                                    this.lowerThresholdValue = thresholdValue;
                                }
                            });
                            document.getElementById("individualLMPLowerValueTab").innerHTML="None";
                
                        }
                        if(!jQuery.isEmptyObject(openedWindow)){
                                    openedWindow.close();
                        }
                        upperLimitTabScreenHasToBeDisplayed = false;
                        lowerLimitTabScreenHasToBeDisplayed = false;
                        localStorage.setItem("notificationDetails", JSON.stringify(notificationsObj));
                        try{
                            setnotificationValues();
                            setZoneLMPValues();
                        }catch(e){}
                        try{
                            setTabnotificationValues();
                            setTabZoneLMPValues();
                        }catch(e){}
                    }else{
                        alert(networkProblemMessage, null, "PJM Now", "OK");
                    }
                    try{
                        window.plugins.spinnerDialog.hide();
                    }catch(e){
                    }
                },
                error: function (r, s, e) {
                    if (!isOnline()) {
                       alert("The Internet connection appears to be offline", null, "PJM Now", "OK");
                    } else if (s === 'timeout') {
                        alert(networkTimeoutMessage, null, "PJM Now", "OK");
                    } else {
                        alert(networkProblemMessage, null, "PJM Now", "OK");
                    }
                    try{
                        window.plugins.spinnerDialog.hide();
                    }catch(e){
                    }
                },
                beforeSend: function () {},
                complete: function (data) {}
            });
}