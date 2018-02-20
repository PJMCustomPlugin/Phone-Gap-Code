
var isZooming = false;

$(document).ready(function () {
  $(document).click(function (evt) {
        if (evt.target.toString() != "[object SVGPathElement]" && evt.target.id !="laterForfeedBackclick" 
                && evt.target.id !="okayforfeedbackClick" ) {
            ZoneMapModule.closeZoneTrendWindow();
        }
  });
  $(window).bind('touchmove', function (e) {
        e.preventDefault();
  });
});

function showEachZoneLMPLegendNormal(legendItem,i,value){
       legendItem = legendItem +  "<div class='ColorContent'>"+
                                    "<div class='childLeft square col"+(i)+" '></div>"+
                                    "<div class='childRight sPd'>"+value+"</div>"+
                                "</div>";
       return legendItem;
}

function showEachZoneLMPLegendPhoneLandscape(legendItem,i,value){
       legendItem = legendItem +  "<div class='ColorContentforland'>"+
                                    "<div class='childLeft square col"+i+"'></div>"+
                                    "<div class='landspd'>"+value+"</div>"+
                                "</div>";
       return legendItem;
}

function showLegendsData(){
    var tempZoneLMPLegendsDataForPhoneLand = "";
    var tempZoneLMPLegendsDataNormalLeft = "";
    var tempZoneLMPLegendsDataNormalRight = "";
    var data = ["&#60; $10","$10 - 20","$20 - 40","$40 - 70","$70 - 100","$100 - 200","$200 - 500"," &#62; $500"];
     
     for (var i = 1; i <= data.length/2; i++) {
          tempZoneLMPLegendsDataNormalLeft = showEachZoneLMPLegendNormal(tempZoneLMPLegendsDataNormalLeft,i,data[i-1]); 
          tempZoneLMPLegendsDataForPhoneLand = showEachZoneLMPLegendPhoneLandscape(tempZoneLMPLegendsDataForPhoneLand,i,data[i-1]);
     }
     for (var i = 5; i <= data.length; i++) {
          tempZoneLMPLegendsDataNormalRight = showEachZoneLMPLegendNormal(tempZoneLMPLegendsDataNormalRight,i,data[i-1]);
          tempZoneLMPLegendsDataForPhoneLand = showEachZoneLMPLegendPhoneLandscape(tempZoneLMPLegendsDataForPhoneLand,i,data[i-1]); 
     }
    var zoneLMPLegendsNormalViewLeft = document.getElementById("mapLegendsNormalViewLeft");
    zoneLMPLegendsNormalViewLeft.innerHTML = "";
    zoneLMPLegendsNormalViewLeft.innerHTML = zoneLMPLegendsNormalViewLeft.innerHTML + tempZoneLMPLegendsDataNormalLeft;
    var zoneLMPLegendsNormalViewRight = document.getElementById("mapLegendsNormalViewRight");
    zoneLMPLegendsNormalViewRight.innerHTML = "";
    zoneLMPLegendsNormalViewRight.innerHTML = zoneLMPLegendsNormalViewRight.innerHTML + tempZoneLMPLegendsDataNormalRight;
    var zoneLMPLegendsDataForPhoneLand = document.getElementById("mapLegendsPhoneLandscape");
    zoneLMPLegendsDataForPhoneLand.innerHTML = "";
    zoneLMPLegendsDataForPhoneLand.innerHTML = zoneLMPLegendsDataForPhoneLand.innerHTML + tempZoneLMPLegendsDataForPhoneLand;
}

function zoneLMPMapInit(){
     isMoreClicked = false;
     showLegendsData();
}

function zoneTrendPopupGeneration(zoneName, colorName) {
    var zonesDetailsData = dbapp.zoneTrendData;
    var zoneDetailsData = filterZoneDataByZoneName(zoneName, zonesDetailsData);
    $("#eachZoneLastUpdatedDate").html(" ");
    $("#eachZoneLastUpdatedDate").html("As of " + zonesDetailsData.aggregate_LMP_last_updated_date.replace("EDT", "EPT").replace("AM", "a.m.").replace("EST", "EPT"));
    zoneLMPGraphConstruction(zoneDetailsData, colorName);
    var zoneLMPTrendPopupDiv = $("#zoneLMPTrendPopup");
   
    if (!zoneLMPTrendPopupDiv.data("kendoWindow")) {
        zoneLMPTrendPopupDiv.kendoWindow({
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
    } 
    var zoneLMPTrendWindow = zoneLMPTrendPopupDiv.data("kendoWindow");
    graphPopupDivGlobal = zoneLMPTrendWindow;
    zoneLMPTrendWindow.setOptions({
            width: '88%',
            height: 'auto'
    });
    zoneLMPTrendWindow.center().open();
    try {
        var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
        if (screenOrientation == 0 && screen.orientation == "portrait-primary") {
            window.screen.lockOrientation('portrait');
        } else if (screenOrientation == 90) {
            window.screen.lockOrientation("landscape");
        } else {
            window.screen.lockOrientation('portrait');
        }
    } catch (error) {}
    $(".close-button").click(function () {
        $(this).closest("[data-role=window]").kendoWindow("close");
        window.screen.unlockOrientation();
    });
}


function filterZoneDataByZoneName(zoneName, zonesDetailsData) {
    var zoneDetailsData = [];
    var zoneWiseAggregateLMPs = zonesDetailsData.zone_wise_aggregate_LMPs;
    
    for (var zoneIndex = 0; zoneIndex < zoneWiseAggregateLMPs.length; zoneIndex++) {
        var particularZoneDetailsData = zoneWiseAggregateLMPs[zoneIndex];
        if (particularZoneDetailsData.abbreviated_zone_name.trim() == zoneName.trim()) {
            zoneDetailsData = particularZoneDetailsData;
            break;
        }
    }
    return zoneDetailsData;
}

function zoneLMPGraphConstruction(zoneDetailsData, colorName) {
    var zoneLMPs = zoneDetailsData.zone_aggregate_LMPs;
    var titleName = zoneDetailsData.abbreviated_zone_name;
    var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
    var xaxisArray = [];
    var xaxisForTooltip = [];
    if (screenOrientation == 90) {
        if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
            $("#zoneLMPGraph").css("height", '55%');
        }
    } else {
        if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
            $("#zoneLMPGraph").css("height", 'auto');
        }
    }
    $("#zoneLMPGraph").css("width", '88%');

    var seriesArr = [];
    var pointsArr = [];
    var currentLMPValue;
    var thickIntervalPosition;
    var maxInterval;
    for (var i = 0; i < zoneLMPs.length; i++) {
        var splitingTime = zoneLMPs[i].aggregate_LMP_hour.split(" ");
        xaxisArray.push(splitingTime[0] + "<br>" + splitingTime[1]);
        xaxisForTooltip.push(zoneLMPs[i].aggregate_LMP_hour);
        if (zoneLMPs[i].aggregate_LMP_value == null) {
            pointsArr.push(null);
        } else {
            currentLMPValue = parseFloat(zoneLMPs[i].aggregate_LMP_value).toFixed(2);
                if(currentLMPValue<0){
                    currentLMPValue="($"+(-(currentLMPValue))+")";
                }else{
                    currentLMPValue = "$"+currentLMPValue;
                }
            pointsArr.push(Number(zoneLMPs[i].aggregate_LMP_value));
        }
    }
    maxInterval=24*12;
    thickIntervalPosition = 4*12;
    var obj = {
        "name": zoneLMPs.abbreviated_zone_name,
        "data": pointsArr,
        "color": colorName,
        "showInLegend": false
    };
    seriesArr.push(obj);
   
    Highcharts.Axis.prototype.init = (function (func) {
        return function (chart, userOptions) {
            func.apply(this, arguments);
            if (this.categories) {
                this.userCategories = this.categories;
                this.categories = undefined;
                this.labelFormatter = function () {
                    this.axis.options.labels.align = (this.value == this.axis.min) ? "center" : ((this.value == this.axis.max) ? "center" : "center");
                    return this.axis.userCategories[this.value];
                }
            }
        };
    }(Highcharts.Axis.prototype.init));
    $('#zoneLMPGraph').highcharts({
        chart: {
            spacingBottom: 1,
            spacingLeft: 1,
            spacingRight: 1,
            spacingTop: 1,
            marginRight: 20,
            type: 'spline',
            zoomType: 'x'
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        title: {
            text: titleName,
            style: {
                color: '#000000',
                fontFamily: 'HelveticaNeue,sans-serif,roboto ',
                fontSize: '18px',
            },
        },
        subtitle: {
            text: '<span style="width:100%;font-family:HelveticaNeue,sans-serif,roboto  !important;font-size:13px;text-align:right;color:#000000">Current LMP: ' + currentLMPValue + '</span>',
            align: 'right',
            x: -17,
        },
        xAxis: {
            categories: xaxisArray,
            title: {
                text: 'Hour',
                style: {
                    color: '#000000',
                    fontFamily: 'HelveticaNeue,sans-serif,Roboto regular',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    marginTop: '20px'
                },
            },
            allowDecimals: true,
            min: 0,
            max: maxInterval,
            gridLineWidth: 1,
            tickInterval: thickIntervalPosition,
            linewidth: 1,
            tickColor: 'transparent',
            lineColor: '#000000',
            plotLines: [{
                color: '#000000',
                width: 1,
                value: '0',
                zIndex: 1,
                 }],
            labels: {
                rotation: 0,
                style: {
                    width: '4px',
                    color: '#000000',
                    fontFamily: 'HelveticaNeue,sans-serif,Roboto regular',
                    fontSize: '12px',
                },
                step: 1
            }
        },
        yAxis: {
            title: {
                text: '$/MW',
                align: 'high',
                offset: 1,
                x: 3,
                y: -15,
                rotation: 0,
                style: {
                    color: '#000000',
                    fontFamily: 'HelveticaNeue,sans-serif,Roboto regular !important',
                    fontSize: '13px !important',
                },
            },
            gridLineWidth: 1,
            lineColor: '#000000',
            linewidth: 1,
            offset: -12,
            labels: {
                style: {
                    color: '#000000',
                    fontFamily: 'HelveticaNeue,sans-serif,Roboto regular',
                    fontSize: '12px',
                },
            },
            allowDecimals: false,
            showFirstLabel: false,
            tickInterval: 5,
        },
        tooltip: {
            crosshairs: [true, false],
            crosshairs: {
                color: '#BCC1C6',
                dashStyle: 'LongDash',
                width: 1,
            },
            borderColor: '#BCC1C6',
            borderWidth: 1,
            borderRadius: 12,
            formatter: function () {
                var symbol = '■';
                var splitTimeToDisplay;
                var finalHeader;
                console.log(" -------------------- zone LMP formatter==========="+xaxisForTooltip[this.x]);
                if(this.x%12 == 0){
                    splitTimeToDisplay = xaxisForTooltip[this.x].split(" ");
                    finalHeader = splitTimeToDisplay[0] + ":00 " + splitTimeToDisplay[1];
                }else{
                    splitTimeToDisplay = xaxisForTooltip[this.x];
                    finalHeader = splitTimeToDisplay;
                }
                var trendTooltipValue = parseFloat(this.y.toFixed(2)).toFixed(2);
                if(trendTooltipValue<0){
                    trendTooltipValue = "($"+(-(trendTooltipValue))+")";
                }else{
                    trendTooltipValue = "$"+trendTooltipValue;
                }

                var s = '<span style="font-size:12px;font-family:HelveticaNeue,sans-serif,Roboto regular !important;text-align:center;display:block;line-height:2.0;">At ' + finalHeader + "</span>";
                s += '<span style="font-size:18px;font-family:HelveticaNeue,sans-serif,Roboto regular !important;text-align:center;display:block;line-height:1.2;">'
                        +'<span style="color:' + this.series.color + ';padding-right:5px;">' + symbol + '</span>' + trendTooltipValue 
                    + '</span>';
                return s;
            },
            useHTML: true,
            hideDelay: 0,
            shadow: true
        },
        rangeSelector: {
            selected: 1
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: false
                }
            },
            series: {
                enableMouseTracking: true,
                connectNulls: true,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }
        },
        series: seriesArr
    });
    $('.highcharts-tooltip').on({
        'touchstart': function(evt){
            evt.preventDefault();
        }
    });
}
function showViewZoneTrendPopup(xCoordinate, yCoordinate) {
    var xCor = xCoordinate;
    var yCor = yCoordinate;
    var leftArranging = xCor - 75;
    if (leftArranging < 0) {
        xCor = 85
    }
    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    };
    if (xCor + 75 > $("#zoneLMPMapScroller").width()) {
        xCor = $("#zoneLMPMapScroller").width() - 85
    }

    var viewTrendPopupDiv = $("#viewTrendPopup");

    $("#viewTrendPopup").css("overflow-y", "hidden");
    $("#viewTrendPopup").css("overflow-x", "hidden");

    viewTrendPopupDiv.kendoWindow({
        width: "150px",
        height: "95px",
        title: false,
        draggable: false,
        resizable: false,
        open: function (e) {
            this.wrapper.css({
                top: yCor - 47.5,
                left: xCor - 75
            });

        },
    });
    var viewTrendPopup = viewTrendPopupDiv.data("kendoWindow");

    viewTrendPopup.open();

}

var ZoneMapModule = {
    zonePointsFactory: [],
    zoneData: {},
    idItemBind: [],
    oldAttrArr: [],
    popup: "",
    zoneColor: ["#663398", "#32CCFE", "#C2E088", "#669801", "#F6C32C", "#E7B9BB", "#FF679A", "#993365"],
    zoneLmpRangeLeft: [0.00, 10, 20, 40, 70, 100, 200, 500],
    zoneLmpRangeRight: [10, 20, 40, 70, 100, 200, 500, 'Infinity'],
    zones: "",
    attr: {
        "fill": "#E8DDBD"
    },
    init: function () {
        var size = {
            width: window.innerWidth || document.body.clientWidth,
            height: window.innerHeight || document.body.clientHeight
        };

        $("#zoneLMPMap").css("width", size.width);
        $("#zoneLMPMap").css("height", size.height / 2 - 65);
        $("#zoneLMPViewContainer_mobile").addClass("mapdivclr");
        ZoneMapModule.zones = Raphael("zoneLMPMap", size.width - 10, size.height / 2);
        ZoneMapModule.zones.setViewBox(0, 0, 750, 550, false);
    },
    createZones: function () {
        ZoneMapModule.zonePointsFactory = ZoneMapPointsFactory.getAllZonePointsToDrawMap();
        ZoneMapModule.zoneData = dbapp.zoneData;
        if (jQuery.isEmptyObject(ZoneMapModule.zoneData)) {
            var deviceuuid = localStorage.getItem("deviceuuId");
            try {
                window.plugins.spinnerDialog.show();
            } catch (error) {}
            $.ajax({
                type: "POST",
                async: false,
                url: serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllZoneLMPs',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Origin': 'file:///'
                },
                data: JSON.stringify({
                    "udid": deviceuuid
                }),
                success: function (data) {
                    dbapp.zoneData = data;
                    ZoneMapModule.zoneData = dbapp.zoneData
                    dbapp.dropTable();
                    dbapp.createTable(dbapp.zoneData);
                    setTimeout(function () {
                        zoneTrendUpdate();
                        tieflowsAndDemandUpdate();
                    }, 800);
                    try {
                        window.plugins.spinnerDialog.hide();
                    } catch (error) {}

                },
                error: function (r, t, e) {
                    if (t === "timeout") {
                        window.plugins.spinnerDialog.hide();
                        navigator.notification.alert(networkTimeoutMessage, null, "PJM Now", "OK");
                    } else {
                        window.plugins.spinnerDialog.hide();
                        navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                    }
                }
            });
        }
        var presentDateAndTime = ZoneMapModule.zoneData.Zone_LMP_Last_Updated_Date.replace("EST", "EPT").replace("EDT", "EPT").replace("AM", "a.m.").replace("PM", "p.m.");
        $("#zoneLMPLastUpdatedDate").html("As of " + presentDateAndTime);
        for (var _seperatedZonePolygonNumber in ZoneMapModule.zonePointsFactory) {
            if (ZoneMapModule.zonePointsFactory.hasOwnProperty(_seperatedZonePolygonNumber)) {
                var zoneObj, colorAttr;

                if (_seperatedZonePolygonNumber !== "WHI") {
                    var zoneNamePolygonArray = _seperatedZonePolygonNumber.split("_");
                    zoneObj = ZoneMapModule.searchZoneData(zoneNamePolygonArray[0]);
                    colorAttr = ZoneMapModule.getZoneLmpColor(zoneObj.Zone_LMP_Value);
                    var zonePathObj = ZoneMapModule.zones.path(ZoneMapModule.zonePointsFactory[_seperatedZonePolygonNumber]).attr(colorAttr).attr("stroke", "#383838");
                    ZoneMapModule.idItemBind[zonePathObj.id] = zoneObj;

                    zonePathObj.click(function (event) {
                        ZoneMapModule.selectZone(this);
                        showViewZoneTrendPopup(event.clientX, event.clientY);
                        var prevClicks = localStorage.getItem('LMPMapClicks');
        	            localStorage.setItem("LMPMapClicks", parseInt(prevClicks) + 1);
                    });
                } else {
                    zoneObj = "";
                    colorAttr = {
                        fill: "white"
                    };
                    var zonePathObj = ZoneMapModule.zones.path(ZoneMapModule.zonePointsFactory[_seperatedZonePolygonNumber]).attr(colorAttr).attr("stroke", "#383838");
                }
            }
        }
        zoneMapOrientationCSSChanges();
    },
    selectZone: function (clickedZone) {
        ZoneMapModule.tooltipInfo(clickedZone.id);
    },
    unselectAllZones: function () {
        ZoneMapModule.zones.forEach(function (eachZoneObj) {
            eachZoneObj.attr("fill", ZoneMapModule.oldAttrArr[eachZoneObj.id]);
        });
    },
    selectGroupZones: function (zoneArray) {
        var zonesSet = ZoneMapModule.zones.set();
        for (var i = 0; i < zoneArray.length; i++) {
            zonesSet.push(
                ZoneMapModule.zones.getById(zoneArray[i])
            );
        }
    },
    getZoneLmpColor: function (LMPValue) {
        var colorAttr = {};
                        // 0    1   2    3    4     5     6     7
        var LMPValues = [0.00 , 10 , 20 , 40 , 70 , 100 , 200 , 500];

        for(var index=0; index<LMPValues.length; index++){
            if((index==0 && (LMPValue == LMPValues[index] || LMPValue < LMPValues[index+1]))
                ||(LMPValue >= LMPValues[index] && LMPValue < LMPValues[index+1])
                ||(index==LMPValues.length-1 && LMPValue > LMPValues[index])){
                colorAttr = {
                    "fill": ZoneMapModule.zoneColor[index]
                };
                return colorAttr;
            }
        }
    },
    searchZoneData: function (zoneNameToSearch) {
        var zoneToShowOnMap;
        try {
            // ZoneMapModule.zoneData.zoneLMPList holds the current zone LMP values list
            ZoneMapModule.zoneData.zoneLMPList.forEach(function (item) {
                if (item.Zone_LMP == zoneNameToSearch) {
                    zoneToShowOnMap = item;
                    throw StopIteration;
                }
            });
        } catch (error) {}
        return zoneToShowOnMap;
    },
    tooltipInfo: function (id) {
        var text = ZoneMapModule.idItemBind[id].Zone_LMP + "\n" + ZoneMapModule.idItemBind[id].Zone_LMP_Value;
        var colorName = ZoneMapModule.getZoneLmpColor(ZoneMapModule.idItemBind[id].Zone_LMP_Value);
        var currentZoneLMPValue = ZoneMapModule.idItemBind[id].Zone_LMP_Value;
        if(currentZoneLMPValue<0){
            //alert("============old currentZoneLMPValue -->"+currentZoneLMPValue);
            currentZoneLMPValue="($"+(-(currentZoneLMPValue))+")";
            console.log("============new currentZoneLMPValue -->"+currentZoneLMPValue);
        }else{
            currentZoneLMPValue = "$"+currentZoneLMPValue;
        }
        var symbolforPopupZoneMap = '■';
        $("#viewTrendPopup").html("");
        $("#viewTrendPopup").html("<span style='padding:3px;font-size:15px;color:black;'>" + ZoneMapModule.idItemBind[id].Zone_LMP + "</span>"
                                +"<span style='display:block;padding:3px;font-size:25px;color:black;'>"
                                        +"<span style='color:" + colorName.fill + "'>" + symbolforPopupZoneMap + "</span> " + currentZoneLMPValue
                                +"</span>"
                                +"<div style='border-top: 1px solid #DCDFE1;padding-top:2PX;'></div>"
                                +"<div style='padding-top:5px;padding-bottom:5px;'>"
                                        +"<a id='viewTrend' onclick=zoneTrendPopupGeneration('"+ ZoneMapModule.idItemBind[id].Zone_LMP + "','" + colorName.fill + "') style='color:#2984B3 !important;'>View Trend</a>"
                                +"</div>");
    },
    getAndDisplayZoneTrend : function(){
        navigationService.navigateToPageInDirection("zoneLMPMap","left");
        appService.enableZoneLMPIconByDefault();
        servicesModel.getUpdateDataFiveMinutesInterval("zoneWiseAggregateLMPs");
    },
   
    closeZoneTrendWindow : function(){
        try {
            var viewTrendPopupDiv = $("#viewTrendPopup");
            viewTrendPopupDiv.data("kendoWindow").close();
            // call 'close' method on nearest kendoWindow
            $(this).closest("[data-role=window]").kendoWindow("close");
        } catch (exception) {}
    },
    /** Filter the color name for a zone  by using it's LMP and display zone trend */
    displayZoneTrend: function(zoneName){
                    var lastLMPValue;
                    for (var i = 0; i < dbapp.zoneTrendData.zone_wise_aggregate_LMPs.length; i++) {
                            var particularzoneData = dbapp.zoneTrendData.zone_wise_aggregate_LMPs[i];
                            if (particularzoneData.abbreviated_zone_name == zoneName) {
                                for (var j = 0; j < particularzoneData.zone_aggregate_LMPs.length; j++) {
                                    if(particularzoneData.zone_aggregate_LMPs[j].aggregate_LMP_value != null){
                                        lastLMPValue = particularzoneData.zone_aggregate_LMPs[j].aggregate_LMP_value;
                                    }
                                }
                                var colorName = ZoneMapModule.getZoneLmpColor(lastLMPValue);
                                zoneTrendPopupGeneration(zoneName,colorName.fill); 
                            }
                        }
    }

}

$(document).ready(function () {
        var size = {
            width: window.innerWidth || document.body.clientWidth,
            height: window.innerHeight || document.body.clientWidth,
        };
        ZoneMapModule.init();
        ZoneMapModule.createZones();
});


var lockZoneLMPListView = function () {
    ZoneMapModule.closeZoneTrendWindow();
    runningPageChange(2);
    try{
         window.screen.lockOrientation('portrait');
    }catch(e){}
   
}

function initPullToRefreshScroller(e) {
  
    $("#zoneLMPMapScroller").data("kendoMobileScroller").bind("scroll", function (event) {
    });
    var scroller = e.view.scroller;
    scroller.setOptions({
        pullToRefresh: true,
        endlessScroll: true,
        messages: {
            pullTemplate: function () {},
            releaseTemplate: function () {
                $(".km-scroller-pull").remove();
                $("#updateZoneLMPMapImg").addClass("imgSpan");
                $("#zoneLMPMapState").css("display", "block");
            },
            refreshTemplate: function () {
                $(".km-scroller-pull").remove();
                $("#updateZoneLMPMapImg").addClass("imgSpan");
                $("#zoneLMPMapState").css("display", "block");
            }
        },
        pull: function () {
            if ((isiPadPro(device.model) || kendo.support.mobileOS.tablet) && ($(window).width() > $(window).height()) ? 90 : 0 == 90) {
                e.preventDefault();
            } else {
                refreshZoneLMPMapDbPull();
                $(".km-scroller-pull").remove();
                setTimeout(function () {
                    scroller.pullHandled();
                    $("#zoneLMPMapState").css("display", "none");
                }, 800);
            }
        }
    })
    scroller.bind("scroll", function (e) {
        if (e.scrollTop > 0) {
            scroller.reset();
        } else if (e.scrollTop < 0) {
            $(".km-scroller-pull").remove();
            if ((isiPadPro(device.model) || kendo.support.mobileOS.tablet) && ($(window).width() > $(window).height()) ? 90 : 0 == 90) {
                scroller.reset();
                e.preventDefault();
            } else {
                $(".km-scroller-pull").remove();
            }
        } else if (e.scrollTop == 0) {
            $("#zoneLMPMapState").css("display", "none");
        }
    });
}

function zoneLMPLandscapeViewRefresh() {
    dbapp.openDb();
    if (isOnline()) {
        zoneLMPData();
    } else {
        networkConnectionCheckingWhileUpdating();
    }
}

setInterval(function () {
    try {
        if (Number($("#zoneLMPMapScroller div:nth-child(2)").css('transform').split(",")[3]) > 1) {
            isZooming = true;
        }
        if (Number($("#zoneLMPMapScroller div:nth-child(2)").css('transform').split(",")[3]) < 1) {
            $("#zoneLMPMapScroller div:nth-child(2)").css('transform', 'translate3d(0px, 0px, 0px) scale(1)');
            isZooming = true;
        }

        if (Number($("#zoneLMPMapScroller div:nth-child(2)").css('transform').split(",")[3]) == 1) {
            isZooming = false;
        }
    } catch (error) {}
}, 1000);


$(document).ready(function () {
    $('#Okbtn_Map').click(function () {
        try {
            window.screen.unlockOrientation();
        } catch (error) {}
        
         var zoneLMPScreenName = "Zone_LMP";
        if(device.platform == 'Android' || device.platform == 'android'){
              Base64.fileCreationInAndroidAndSendMail(zoneLMPScreenName); 
        } else if(device.platform == "iOS"){
            var  encodedDeviceData = Base64.get_encoded_device_data();
            var filePath = 'base64:device_info.txt//'+ encodedDeviceData +'/...';
            Base64.sendAMail(filePath,zoneLMPScreenName);
        }
        $(this).closest("[data-role=window]").kendoWindow("close");
    });
    $('#Laterbtn_Map').click(function () {
        try {
            window.screen.unlockOrientation();
        } catch (error) {}
        localStorage.setItem("LMPMapClicks", 0);
        $(this).closest("[data-role=window]").kendoWindow("close");
    });
});

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
var countDecimals = function(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}
function networkConnectionCheckingWhileUpdating() {
    var networkConnectionPopup = $("#netWorkConnectionCheck");
    networkConnectionPopup.kendoWindow({
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
    var win1 = networkConnectionPopup.data("kendoWindow");
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        win1.setOptions({
            width: 'auto',
            height: 'auto'
        });

    } else {
        win1.setOptions({
            width: '88%',
            height: 'auto'
        });
    }
    win1.center().open();
    setTimeout(function () {
        win1.close();
    }, 1000);
}
