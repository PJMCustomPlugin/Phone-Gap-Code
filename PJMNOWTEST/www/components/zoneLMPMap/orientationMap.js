window.addEventListener("resize",function() {
       if (device.platform == 'android' || device.platform == 'Android') {
            $("#zoneLMPMapView").css("display","none");
            setTimeout(function(){
                 zoneMapOrientationCSSChanges(); 
                 $("#zoneLMPMapView").show();
                 $("#zoneLMPMapView").show('slide', {direction: 'right'}, 100);
            },1);
       } else {
           zoneMapOrientationCSSChanges();
       }
}, false);

console.log("orientationMap.js");

var splashScreenStatus=0;

function refreshZoneLMPMapDbPull() {
    dbapp.openDb();
    if (isOnline()) {
        zoneLMPData();
    } else {
        networkConnectionCheckingWhileUpdating();
    }
}

function saveSortableZoneLMPArray(idsInOrder,currentZoneLMPArray,sortableZones){
        var num = 0;
        for (var ids in idsInOrder) {
            var sortableZoneInfo = {};
            var id = parseInt(idsInOrder[ids]);
            sortableZoneInfo.Zone_LMP = currentZoneLMPArray[id].Zone_LMP;
            sortableZoneInfo.Zone_LMP_Value = currentZoneLMPArray[id].Zone_LMP_Value;
            sortableZones.push(sortableZoneInfo);
            num++;
        }
        localStorage.setItem("sortableZoneArray", JSON.stringify(sortableZones));
}

function doZoneLMPListSort(containerRef,ui){

            var container = $(containerRef),
                placeholder = container.children('.ui-sortable-placeholder:first');

            var helpHeight = ui.helper.outerHeight(),
                helpTop = ui.position.top,
                helpBottom = helpTop + helpHeight;
           console.log("------------------sort--------------------");
           container.children().each(function () {
                    var item = $(containerRef);

                    if (!item.hasClass('ui-sortable-helper') && !item.hasClass('ui-sortable-placeholder')) {
                        var itemHeight = item.outerHeight(),
                            itemTop = item.position().top,
                            itemBottom = itemTop + itemHeight;

                        if ((helpTop > itemTop) && (helpTop < itemBottom)) {
                            var tolerance = Math.min(helpHeight, itemHeight) / 2,
                                distance = helpTop - itemTop;

                            if (distance < tolerance) {
                                placeholder.insertBefore(item);
                                container.sortable('refreshPositions');
                                return false;
                            }

                        } else if ((helpBottom < itemBottom) && (helpBottom > itemTop)) {
                            var tolerance = Math.min(helpHeight, itemHeight) / 2,
                                distance = itemBottom - helpBottom;

                            if (distance < tolerance) {
                                placeholder.insertAfter(item);
                                container.sortable('refreshPositions');
                                return false;
                            }
                        }
                    }
                });
}

function zoneMapOrientationCSSChanges() {    
       var size = {
           width: window.innerWidth || document.body.clientWidth,
           height: window.innerHeight || document.body.clientHeight
       }
       ZoneMapModule.closeZoneTrendWindow();
       
       if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
           $("#tablateUpdatedDateForZoneLMP").hide();
           $("#tableRefresh").hide();
           var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
           if (screenOrientation == 90) {
               showZoneLMPMapPhoneLandscape();
           } else {
               showZoneLMPMapPhonePortrait();
           }
       } 
       else if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
           var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
           if (screenOrientation == 90) {
               showZoneLMPMapTablateLandscape();
           } 
           else {
               showZoneLMPMapTablatePortrait();
           }
       }
       var reqHeight = size.height; 
       $('#zoneLMPMapView').css('height', reqHeight);
         if(splashScreenStatus==0){
           setTimeout(function(){
               if (device.platform == 'android' || device.platform == 'Android') {
                   ActivityIndicator.hide();
               }
               try{
                navigator.splashscreen.hide();
               }catch(error){}
               try{
                    statusBarChanges();
               }catch(error){}
            },5);
           splashScreenStatus=1;
       }
}

function showZoneLMPMapTablateLandscape(){
               $(".km-widget.km-navbar").css("height", '55px');
               $("#tableViewGenerating").show();
               $("#tableViewGenerating").load("components/zoneLMPMap/zoneLMPMap_landscape.html");
               $("#zoneLMPMap").css("padding-top", "1px");
               $("#zoneLMPMapLegendsShowDownDiv").css("position", "relative");
               $("#zoneLMPMapLegendsShowDownDiv").css("padding-top", "0%");
               try {
                   var curdate = $("#zoneLMPLastUpdatedDate").text();
               } catch (error) {}
               $("#zoneLMPLastUpdatedDate").show();
               $("#forwardImage").hide();
               $("#zoneLMPListTableId").css("display","none");
               $("#tableRefresh").show();
               $("#zoneLMPViewContainer_mobile").css("float", "left");
               $("#zoneLMPViewContainer_mobile").css("width", "69%");

               $("#zonelmplidfsdds").css("width", "31% !important");
               $(".km-ios7 .km-tabstrip .km-button").css("display", "inline-block");
               		$(".km-ios7 .km-tabstrip .km-button").css("padding-left", "75px");
               		$(".km-ios7 .km-view-title").css("line-height", "55px");
               var size = {
                   width: window.innerWidth || document.body.clientWidth,
                   height: window.innerHeight || document.body.clientHeight
               };
               $("#zoneLMPViewContainer_mobile").css("height", size.height / 2);
               var widthForLandScapeLeft = (size.width * 69) / 100;
               var widthForLandScapeRight = (size.width * 31) / 100;
               var containerHeight = (size.height * 8.5) / 10;

               $("#zoneLMPMap").css("height", size.height / 2 + 50);
               $("#zoneLMPMap").css("width", widthForLandScapeLeft);
               $('#zoneLMPMap > svg').css("height", size.height / 2 + 60);
               $("#zoneLMPMap > svg").css("width", widthForLandScapeLeft);
               $("#zoneLMPMap > svg").removeAttr("viewBox");
               var svg = document.getElementsByTagName("svg")[0];
               if (device.platform == 'android' || device.platform == 'Android') {
                    if(size.height <=700){
                         svg.setAttribute("viewBox", "-150 0 800 510");
                    }else{
                        svg.setAttribute("viewBox", "-50 0 800 510");
                    }
               }
               else{
                    svg.setAttribute("viewBox", "0 0 825 350");
               }
               $(".right").css("padding-left", "25%");
               $(".right").css("float", "left");
               $(".left").css("margin-left", "6%");
               $(".mainHeading").css("padding-top", "2%");
               $(".mainHeading").css("text-align", "center");
               $(".aftermainHeading").css("padding-left",'25%');
               if (device.platform == 'android' || device.platform == 'Android') {
                    if(size.height <= 700){
                       $("#zoneLMPMap").css("height", size.height / 2);
                      $('#zoneLMPMap > svg').css("height", size.height / 2);
                         $(".mainHeading").css("padding-top", "0%");
                   }
               }
               $("#zoneLMPMapLegendsShowDownDiv").show();
               $("#zoneLMPMapLegendsShowDownDiv").css("top", 0);
               setTimeout(function(){
                    $(".km-ios7 .km-tabstrip .km-button").css("display", "inline-block");
               		$(".km-ios7 .km-tabstrip .km-button").css("padding-left", "75px");
               		$(".km-ios7 .km-view-title").css("line-height", "55px");
               },10);

}

function showZoneLMPMapTablatePortrait(){
               $(".km-widget.km-navbar").css("height", 'auto');
               $("#zoneLMPMapLegendsShowDownDiv").css("position", "absolute");
               $("#zoneLMPLastUpdatedDate").show();
               
               $(".km-ios7 .km-tabstrip .km-button").css("display", "table-cell");
               $(".km-ios7 .km-tabstrip .km-button").css("padding-left", "0px");
               $(".km-ios7 .km-view-title").css("line-height", "2.5em");
               $("#maprefresh").show();
               $("#tableViewGenerating").hide();
               showZoneLMPMapPhonePortrait();
               $("#zoneLMPListTableId").show();
               $("#tableRefresh").hide();
               $("#forwardImage").show();
               $(".right").css("padding-left", "0");
               $(".right").css("float", "right");
               $(".left").css("margin-left", "21%");
               $(".mainHeading").css("text-align", "center");
               $(".mainHeading").css("padding-left", "0");
               $(".aftermainHeading").css("padding-left",'0%');
}

function showZoneLMPMapPhoneLandscape(){
               $("#zoneLMPMap").css("padding-top", "10px");
               var zoneLMPMapDiv = document.getElementById("zoneLMPMapDiv");
               var zoneLMPMapLegendsShowRightSideDiv = document.getElementById("zoneLMPMapLegendsShowRightSideDiv");
               var zoneLMPViewContainer_mobile = document.getElementById("zoneLMPViewContainer_mobile");
               var size = {
                   width: window.innerWidth || document.body.clientWidth,
                   height: window.innerHeight || document.body.clientHeight
               };

               var widthForLandScapeLeft = (size.width / 10) * 6.5;
               var widthForLandScapeRight = (size.width / 10) * 3.5;
               zoneLMPViewContainer_mobile.style.width = "100%";
               zoneLMPMapDiv.style.width = widthForLandScapeLeft;
               zoneLMPMapDiv.style.float = "left";
               zoneLMPMapDiv.style.padding = "0px";
               zoneLMPMapLegendsShowRightSideDiv.style.width = widthForLandScapeRight;
               zoneLMPMapLegendsShowRightSideDiv.style.float = "left";
               $("#zoneLMPMapLegendsShowRightSideDiv").css("height", "100%");
               $("#zoneLMPMapLegendsShowDownDiv").hide();
               $("#zoneLMPMapLegendsShowRightSideDiv").show();
               $("#zoneLMPViewContainer_mobile").css("height", size.height);
               $("#zoneLMPMap").css("width", widthForLandScapeLeft);
               $("#zoneLMPMap").css("display", "block");
               $("#zoneLMPMap").css("height", size.height - 130);
               $('#zoneLMPMap > svg').css("height", "100%");
               $("#zoneLMPMap > svg").css("width", "100%");
               $("#zoneLMPMap > svg").removeAttr("viewBox");

               var svg = document.getElementsByTagName("svg")[0];
               svg.setAttribute("viewBox", "0 0 880 500");
               svg.setAttribute("preserveAspectRatio", "none");
               var curdate = $("#zoneLMPLastUpdatedDate").text();
               $("#zoneLMPLastUpdatedDate").hide();
               $("#lastupdatedMapLandscape").html(curdate);

               $("#lastupdatedMapLandscape").show();
}

function showZoneLMPMapPhonePortrait() {
       var heightofContent = $(".km-content").css("height");
       var zoneLMPMapLegendsShowRightSideDiv = document.getElementById("zoneLMPMapLegendsShowRightSideDiv");
       var zoneLMPMapDiv = document.getElementById("zoneLMPMapDiv");
       var zoneLMPViewContainer_mobile = document.getElementById("zoneLMPViewContainer_mobile");
       try {
           zoneLMPMapLegendsShowRightSideDiv.removeAttribute("style");
           zoneLMPMapDiv.removeAttribute("style");
           zoneLMPViewContainer_mobile.removeAttribute("style");
           $("#zoneLMPMapLegendsShowDownDiv").show();
           $("#zoneLMPMapLegendsShowDownDiv").css("padding-top", "10px");
           $("#zoneLMPMapLegendsShowRightSideDiv").hide();

           $("#zoneLMPLastUpdatedDate").show();
           $("#lastupdatedMapLandscape").hide();
       } catch (error) {}
       var size = {
           width: window.innerWidth || document.body.clientWidth,
           height: window.innerHeight || document.body.clientHeight
       };

       var containerHeight = (size.height * 8.5) / 10;
       $("#zoneLMPMap").css("width", size.width);
       $("#zoneLMPMap").css("height", containerHeight / 2 + containerHeight / 10);

       $('#zoneLMPMap > svg').css("height", containerHeight / 2 + containerHeight / 10);
       $("#zoneLMPMap > svg").css("width", size.width - 10);
       if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
           $("#zoneLMPMap").css("padding-top", "6%");
       } else {
           $("#zoneLMPMap").css("padding-top", "11%");
       }
       $("#zoneLMPMapLegendsShowDownDiv").css("width", (size.width));
       $("#zoneLMPMap > svg").removeAttr("viewBox");
       var svg = document.getElementsByTagName("svg")[0];
       svg.setAttribute("viewBox", "0, 0,750, 550");
       svg.setAttribute("preserveAspectRatio", "xMinYMin");
       $("#zoneLMPMapLegendsShowDownDiv").css("top", size.height / 2 + containerHeight / 10 - 30);
       if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
           $("#zoneLMPMapLegendsShowDownDiv").css("padding-top", "11%");
           $(".right").css("margin-right", "20%");
           $(".left").css("margin-left", "20%");
       }
}