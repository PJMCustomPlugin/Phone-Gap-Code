window.addEventListener("resize", loadOperationalReservesScreen, false);
function loadOperationalReservesScreen(){
    var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
    try{
        if((isiPadPro(device.model) || kendo.support.mobileOS.tablet) && getPageName(runningPage) =='OperationalReservesScreen'){
            if (screenOrientation == 90) {
                app.navigate("components/more/reserves/operationalReserves/operationalReserves_landscape.html");
            }else{
                app.navigate("components/more/reserves/operationalReserves/operationalReserves.html");
            }
        }
    }catch(e){
    }
    
    $('.relative').css('height',$(window).height()-130);
}
function backToMoreFromOperationalReserves(){
     if(!isMoreClicked){
         isMoreReserves = true;
     }else{
         isMoreReserves = false;
     }
     isMoreClicked = true;
     isAlertsClicked = false;
     runningPageChange(6);
     defaultMorePrevPageInPortrait=6;
}

function dispatchedReservesArrowClick(){
    runningPageChange(20);
}