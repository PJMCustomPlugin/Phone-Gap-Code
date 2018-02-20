
var badgeService = {
    updateBadgeOnAppIcon : function (badge){
                    try {
                        if(device.platform == 'Android' || device.platform == 'android'){
                                    cordova.plugins.notification.badge.set(Number(badge), successHandler);
                        } else if(device.platform == "iOS"){
                                    var pushNotification = window.plugins.pushNotification;
                                    pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, Number(badge));
                        }
                    } catch (e) { }
    },
    updateBadgeOnAlertsIcon : function (epBadge){
        if((epBadge > 0)){
                    if(device.platform == "iOS"){
                        if(epBadge < 10){
                            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-readAlerts')
                                                        .removeClass("km-readAlerts")
                                                        .addClass("km-unreadAlerts");
                            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-unreadAlertsTwoDigitCount')
                                                        .removeClass("km-unreadAlertsTwoDigitCount")
                                                        .addClass("km-unreadAlerts");
                            document.styleSheets[0].addRule('span.km-icon.km-unreadAlerts::after','content: "'+epBadge+'";');
                             $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-unreadAlerts').css("margin-right","5px");
                        }else{
                            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-readAlerts')
                                                        .removeClass("km-readAlerts")
                                                        .addClass("km-unreadAlertsTwoDigitCount");
                            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-unreadAlerts')
                                                        .removeClass("km-unreadAlerts")
                                                        .addClass("km-unreadAlertsTwoDigitCount");
                            document.styleSheets[0].addRule('span.km-icon.km-unreadAlertsTwoDigitCount::after','content: "'+epBadge+'";');
                            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-unreadAlertsTwoDigitCount').css("margin-right","7.5px");
                        }
                    }else if(device.platform == "android"||device.platform == "Android"){
                        if(epBadge < 10){
                            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-readAlerts')
                                                        .removeClass("km-readAlerts")
                                                        .addClass("km-unreadAlertsAndroid");
                            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-unreadAlertsTwoDigitCountAndroid')
                                                        .removeClass("km-unreadAlertsTwoDigitCountAndroid")
                                                        .addClass("km-unreadAlertsAndroid");
                            document.styleSheets[0].addRule('span.km-icon.km-unreadAlertsAndroid::after','content: "'+epBadge+'";');
                            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-unreadAlertsAndroid').css("margin-right","5px"); 
                        }else{
                            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-readAlerts')
                                                        .removeClass("km-readAlerts")
                                                        .addClass("km-unreadAlertsTwoDigitCountAndroid");
                            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-unreadAlertsAndroid')
                                                        .removeClass("km-unreadAlertsAndroid")
                                                        .addClass("km-unreadAlertsTwoDigitCountAndroid");
                            document.styleSheets[0].addRule('span.km-icon.km-unreadAlertsTwoDigitCountAndroid::after','content: "'+epBadge+'";');
                            $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-unreadAlertsTwoDigitCountAndroid').css("margin-right","5px");
                        }
                    }
                    setTimeout(function () {
                                $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1).km-state-active').removeClass("km-state-active");
                                //$('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-text').css("color","#7A848D"); 
                    }, 50);
        }else{
                     if(device.platform == "iOS"){
                                    $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-unreadAlerts')
                                                    .removeClass("km-unreadAlerts")
                                                    .addClass("km-readAlerts");
                                    $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-unreadAlertsTwoDigitCount')
                                                    .removeClass("km-unreadAlertsTwoDigitCount")
                                                    .addClass("km-readAlerts");
                                    if(isAlertsClicked==true){
                                        $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1)').addClass("km-state-active");
                                    }
                                    $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-readAlerts').css("margin-right","0px");
                     }else{
                                    $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-unreadAlertsAndroid')
                                                    .removeClass("km-unreadAlertsAndroid")
                                                    .addClass("km-readAlerts");
                                    $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-unreadAlertsTwoDigitCountAndroid')
                                                    .removeClass("km-unreadAlertsTwoDigitCountAndroid")
                                                    .addClass("km-readAlerts");
                                    if(isAlertsClicked==true){
                                        $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1)').addClass("km-state-active");
                                    }
                                    $('div.km-footer div.km-widget.km-tabstrip a:nth-child(1) span.km-icon.km-readAlerts').css("margin-right","0px");
                    }
        }
    }

}