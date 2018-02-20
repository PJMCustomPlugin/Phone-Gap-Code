var threeDimTouchService = {
    updateQuickActions : function (){
                    try {
                        ThreeDeeTouch.configureQuickActions([
                        {
                                type: 'alerts',
                                title: 'View Alerts',
                                iconTemplate: '3dtouch_alerts'
                            }
                        ]);
                    } catch (e) { }
    }
}

var openedThrough3dTouch = false;



(function () {
     document.addEventListener('deviceready', function () {
          ThreeDeeTouch.onHomeIconPressed = function (payload) {
                if (payload.type == 'alerts') {
                    try{
                         openedThrough3dTouch = true;
                         isAlertsClicked = true;
                         isMoreClicked = false;
                             setTimeout(function () {
                                 if(isResumeMode == true){
                                    alertsService.showLatestAlertsPage();
                                    $('div.km-footer div.km-widget.km-tabstrip a.km-state-active').removeClass("km-state-active");
                                    appService.enabledLatestAlertsIcon();
                                    runningPageChange(10);
                                    cordova.plugins.notification.badge.get(function (count) {
                                        var epBadge1 = localStorage.getItem("EPBadge");
                                        if(count != epBadge1){
                                            servicesModel.getUpdateDataFiveMinutesInterval("ep");
                                        }
                                    });
                                }
                          }, 100);
                         
                          
                        
                    }catch(e){
                    }
                        
                } else if (payload.type == 'visit') {
                        var ref = window.open(encodeURI('http://pjm.com'), '_blank', 'location=yes');
                }
            }
     });
}());



