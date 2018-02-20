window.addEventListener("resize", loadDispatchedReservesScreen, false);
function loadDispatchedReservesScreen(){
    var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
    try{
        if((isiPadPro(device.model) || kendo.support.mobileOS.tablet) && getPageName(runningPage)=='DispatchedReservesScreen'){
            if (screenOrientation == 90) {
                app.navigate("components/more/reserves/dispatchedReserves/dispatchedReserves_landscape.html");
            }else{
                app.navigate("components/more/reserves/dispatchedReserves/dispatchedReserves.html");
            }
        }
    }catch(e){
    }
    $('.relative').css('height',$(window).height()-130);
}
function backToOperationalFromDispatchedReserves(){
     if(!isMoreClicked){
         isMoreReserves = true;
     }else{
         isMoreReserves = false;
     }
     isMoreClicked = true;
     isAlertsClicked = false;
     runningPageChange(19);
     defaultMorePrevPageInPortrait=19;
}