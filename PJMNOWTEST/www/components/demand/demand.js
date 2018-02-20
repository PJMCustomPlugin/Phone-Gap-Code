if (window.DeviceOrientationEvent) {
    window.addEventListener("resize", function () {
        if (device.platform == 'android' || device.platform == 'Android') {
            $("#demandWhite").css("display", "none");
            setTimeout(function () {
                refreshDemandGraphData();
                $("#demandWhite").show();
                $("#demandWhite").show('slide', {
                    direction: 'right'
                }, 100);
            }, 1);
        } else {
            if (runningPage == 3) {
                refreshDemandGraphData();
            }
        }
    }, false);
}
var tooltip_status = 0;
var regionIDs = [];
var regionId;
var yAxisGWSpacePotrait;
var yAxisGWSpaceLandscape;
var toolTipCategeries = [];
var seriesArr = [];
var isDropDownClicked = false;
var setGWSpacingOnMove = false;

function clickRegionId(id) {
    try{
    var text = id;
    if ("PJM RTO Total" == id) {
        text = "PJM-RTO";
    }
    setGWSpacingOnMove = false;
    if(isDropDownClicked){
        isDropDownClicked = false;
        isTooltipEnabled = false;
    }
    crosshairsDisable();
    regionId = text;
    $('#dropDownButton span:first').text(text);
    $('#myDropdown a').each(function (index) {
        if ($(this).text() == $('#dropDownButton span:first').text()) {
            $(this).css('background-color', "#428DC1");
            $(this).css('background-clip', "border-box");
            $(this).css('color', "#FFFFFF");
        } else {
            $(this).css('color', "black");
            $(".dropdown-content a").css('background-color', "#F8F8F8");
        }
    });
    $("#myDropdown").css("display", "none");
    $("#dropDownButton").css("border-radius", "5px 5px 5px 5px");
    seriesArr = [];
    var graphData = dbapp.allRegionsDemand;
    var returnValues;
    for (index = 0; index < graphData.regionWiseDemandGraphsList.length; index++) {
        var regionOrZoneName = graphData.regionWiseDemandGraphsList[index].regionOrZoneName;
        var demandGraphList = graphData.regionWiseDemandGraphsList[index].demandGraphList.demandGraphList;
        if (regionOrZoneName == id) {
            var newestUpdatedDate = graphData.regionWiseDemandGraphsList[index].demandGraphLastUpdatedDate;
            $("#lastupdatedGraph").html("As of " + newestUpdatedDate.replace("EDT", "EPT").replace("AM", "a.m.").replace("EST", "EPT").replace("PM", "p.m."));
            var latestTimestamp = newestUpdatedDate.replace("AM", "a.m.").replace("PM", "p.m.").split(" ");
            var hourMinutes = latestTimestamp[3].split(":");
            if (hourMinutes[1] == '00') {
                latestTimestamp[3] = hourMinutes[0];
            }
            returnValues = getDemandGraphList(demandGraphList);
        }
    }
    updateChartSeries();
    $('#chart1').highcharts().setTitle(null, { text: 'Current Load: ' + '<span style="color:#3598DB;fontFamily:HelveticaNeue-Medium,sans-serif-medium,Roboto-Medium;font-size:15px;">' + returnValues.currentLoad + '</span></div>' }); 
    $('#chart1').highcharts().redraw();
    setTimeout(function () {
        setGWSpacing();
    },50);
    formatterMethodUpdate();
    $('#chart1').highcharts().update({
                xAxis: {
                    categories: returnValues.categeries,
                },
     });
    }catch(e){
    }
    
}
function formatterMethodUpdate(){
    var chart1 = $("#chart1").highcharts();
    chart1.series[0].update({
        tooltip: {
            formatter: function () {
                return false;
            }
        }
    });
}
var initialChart = '';
var xCross = '';
var yCross = '';
function crosshairsDisable(){
    if (!isTooltipEnabled) {
        initialChart.xAxis[0].crosshair = yCross; 
    }else{
        initialChart.xAxis[0].crosshair = xCross;        
    } 
}
function dropDownClick() {
    
    if ($("#myDropdown").css("display") == "none") {
        dropDownOpen = 1;
        isDropDownClicked = true;
        isTooltipEnabled = false; 
        crosshairsDisable();
        $("#dropDownButton").css("border-radius", "5px 5px 0px 0px");
        $("#myDropdown").css("display", "block");
        $("#myDropdown").css("z-index", "10");
        $("#myDropdown .km-vertical-scrollbar").css("display", "block");
        $("#myDropdown .km-vertical-scrollbar").css("height", "221px");
        $("#myDropdown .km-horizontal-scrollbar").css("display", "None");
        if (device.platform == 'Android' || device.platform == 'android'){
            $("#myDropdown .km-vertical-scrollbar").css("height", "200px");
        }
        var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
        if (screenOrientation == 90) {
            if (device.platform == 'Android' || device.platform == 'android' || device.platform == 'iOS') {
                $("#myDropdown .km-vertical-scrollbar").css("height", "35px");
            }
        }
        $('#myDropdown a').each(function (index) {
            if ($(this).text() == $('#dropDownButton span:first').text()) {
                $(this).css('background-color', "#428DC1");
                $(this).css('background-clip', "border-box");
                $(this).css('color', "#FFFFFF");
                $('#dropDownButton span:first').text($(this).text());
            }
        });
        $("#myDropdown a").on("touchstart", function (event) {
            if ($(this).text() != $('#dropDownButton span:first').text()){
                $(this).css('color', "#FFFFFF");
                $(this).css("background-color", "#428DC1");
                $(this).css("background-clip", "border-box");
            }
        });
        $("#myDropdown a").on("click touchend", function (event) {
            if ($(this).text() != $('#dropDownButton span:first').text()){
                $(this).css('color', "#000");
                $(this).css("background-color", "#F8F8F8");
                $(this).css("background-clip", "border-box");
            }
        });
    } else {
        dropDownOpen = 0;
        isTooltipEnabled = true; 
        crosshairsDisable();
        $("#myDropdown").css("display", "none");
        $("#dropDownButton").css("border-radius", "5px 5px 5px 5px");
    }
    setGWSpacing();
}
var dropDownOverStatus = 0;
var dropDownTouchStatus = 0;
var dropDownOpen = 0;
var isTooltipEnabled = true;
function dropDownOver() {
    isTooltipEnabled = false;
}
function regionsDemandGraphOrientationDeviceCSschanges(inputRegionOrZoneName) {
    demandPageLoaded = 1;
    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    }
    var graphData = dbapp.allRegionsDemand;
    getDemandGraphPointsForAllRegions(graphData);
    var chartInnerObj = $('#chart1').highcharts();
    var returnValues;
    $("#chart1").css("width", size.width - 10);
    if (chartInnerObj == undefined) {
        seriesArr = [];
        for (index = 0; index < graphData.regionWiseDemandGraphsList.length; index++) {
            var regionOrZoneName = graphData.regionWiseDemandGraphsList[index].regionOrZoneName;
            var demandGraphList = graphData.regionWiseDemandGraphsList[index].demandGraphList.demandGraphList;
            if (regionOrZoneName == inputRegionOrZoneName) {
                var newestUpdatedDate = graphData.regionWiseDemandGraphsList[index].demandGraphLastUpdatedDate;
                $("#lastupdatedGraph").html("As of " + newestUpdatedDate.replace("EDT", "EPT").replace("AM", "a.m.").replace("EST", "EPT").replace("PM", "p.m."));
                var latestTimestamp = newestUpdatedDate.replace("AM", "a.m.").replace("PM", "p.m.").split(" ");
                var hourMinutes = latestTimestamp[3].split(":");
                if (hourMinutes[1] == '00') {
                    latestTimestamp[3] = hourMinutes[0];
                }
                returnValues = getDemandGraphList(demandGraphList);
            }
        }
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
        } (Highcharts.Axis.prototype.init));
        var dropDownText = '<div id="dropDownButton" onclick="dropDownClick()" style="border:1px solid #BCC1C6;background-color: #f8f8f8;color: black;padding: 2px 0px 2px 1px;' +
            'border-radius:5px 5px 5px 5px;cursor: pointer;width: 149px;background-clip: padding-box;">' +
            '<span style="text-align: left;padding-left: 4px;">' + regionId + '</span>' +
            '<span style="text-align: right;float: right;padding: 0px 3px 0px 0px;">&#9660;</span>' +
            '</div>' +
            '<div id="myDropdown" onmouseover="dropDownOver()" data-role="scroller" data-visible-scroll-hints="true" class="dropdown-content" style="border:1px solid #BCC1C6;  overflow-y: scroll;">'
            '</div>';

        for(index = 0; index < graphData.demandDropdownZonesAndRegions.length; index++){
            var title = graphData.demandDropdownZonesAndRegions[index];
             if ("PJM RTO Total" == title) {
                title = "PJM-RTO";
            }
            dropDownText= dropDownText +
            '<a id="'+graphData.demandDropdownZonesAndRegions[index]+'" href="javascript:;" onclick="clickRegionId(this.id);">'+title+'</a>';
        }
        dropDownText=dropDownText+'</div>';
        var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
        $("#chart1").css("width", size.width - 10);
        if (screenOrientation == 90) {
            $("#chart1").css("height", size.height - 110);
            $("#lastupdatedGraph").css("text-align", "right");
            $("#lastupdatedGraph").css("padding-right", "8px");
            chartDisplay(returnValues,dropDownText);
            landscapeChartUpdate(size);
            $(".highcharts-tooltip text").attr('y', '20');
            checkDevicePlatformForLandscape();
            onChart();
            yAxisGWSpaceLandscape = Number($(".highcharts-yaxis text").attr('y'))+1;
            setGWSpacing();
        } else {
            $("#chart1").css("height", size.height - 130);
            $(".highcharts-tooltip text").attr('y', '20');
            chartDisplay(returnValues,dropDownText);
            portraitChartUpdate(size);
            checkDevicePlatformForportrait();
            onChart();
            yAxisGWSpacePotrait = Number($(".highcharts-yaxis text").attr('y'))+1;
            setGWSpacing();
        }
    }
    else {
        var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
        if (screenOrientation == 90) {
            $("#chart1").css("height", size.height - 125);
            $("#lastupdatedGraph").css("text-align", "right");
            $("#lastupdatedGraph").css("padding-right", "8px");
            checkDevicePlatformForLandscape();
            landscapeChartUpdate(size);
            setTimeout(function(){
                yAxisGWSpaceLandscape = Number($(".highcharts-yaxis text").attr('y'))+1;
                setGWSpacing();
            },500);
        } else {
            checkDevicePlatformForportrait();
            portraitChartUpdate(size);
            $(".highcharts-tooltip text").attr('y', '20');
            yAxisGWSpacePotrait = Number($(".highcharts-yaxis text").attr('y'))+1;
            setTimeout(function () {
               setGWSpacing();
            },50);
        }
    }
    $(".highcharts-title").css("margin-top", "3px");
    $("#chart1").find("span.highcharts-title").attr('left', '2% !important');
    var reqHeight = size.height;
    $('#demandWhite').css('height', reqHeight);
}
function getDemandGraphPointsForAllRegions(graphData){
    if (jQuery.isEmptyObject(graphData)) {
        var deviceuuid = localStorage.getItem("deviceuuId");
        try {
            window.plugins.spinnerDialog.show();
        } catch (error) { }
        $.ajax({
            type: "POST",
            async: false,
            url: serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllRegionsDemandGraphPointsWithFiveMinuteInterval',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            headers: {
                'Origin': 'file:///'
            },
            data: JSON.stringify({
                "udid": deviceuuid
            }),
            success: function (data) {
                dbapp.allRegionsDemand = data;
                graphData = dbapp.allRegionsDemand;
                dbapp.updateTableRegionsDemand(data);
                try {
                    window.plugins.spinnerDialog.hide();
                } catch (error) { }
            },
            error: function (r, t, e) {
                if (t === "timeout") {
                    window.plugins.spinnerDialog.hide();
                    navigator.notification.alert(networkTimeoutMessage, null, "PJM Now", "OK");
                } else {
                    window.plugins.spinnerDialog.hide();
                    navigator.notification.alert(networkProblemMessage, null, "PJM Now", "OK");
                }
                app.navigate("components/zoneLMPMap/zoneLMPMap.html", "slide:right");
                return;
            }
        });
    }
}
$(document).ready(function () {
    regionId = "PJM-RTO";
    regionsDemandGraphOrientationDeviceCSschanges("PJM RTO Total");
});
function pullToRefreshDemand() {
    if (isOnline()) {
        demandData();
    } else {
        networkConnectionCheckingWhileUpdating();
    }
}
$(document).ready(function () {
    $('#Okbtn_demand').click(function () {
        try {
            window.screen.unlockOrientation();
        } catch (error) { }
        var demandScreenName = "Demand";
        if (device.platform == 'Android' || device.platform == 'android') {
            Base64.fileCreationInAndroidAndSendMail(demandScreenName);
        } else if (device.platform == "iOS") {
            var encodedDeviceData = Base64.get_encoded_device_data();
            var filePath = 'base64:device_info.txt//' + encodedDeviceData + '/...';
            Base64.sendAMail(filePath, demandScreenName);
        }
        $(this).closest("[data-role=window]").kendoWindow("close");
    });
    $('#Laterbtn_demand').click(function () {
        try {
            window.screen.unlockOrientation();
        } catch (error) { }
        localStorage.setItem("DemandClicks", 0);
        $(this).closest("[data-role=window]").kendoWindow("close");
    });
})

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

function initPullToRefreshScrollerForDemand(e) {
    try {
        var scroller1 = $("#myDropdown").data("kendoMobileScroller");
        scroller1.bind("scroll", function (event) {
            if (event.scrollTop > 0) {
                if (event.scrollTop > 170) {
                }
            } else if (event.scrollTop <= 0) {
                this.reset();
                e.preventDefault();
            }
        });
        scroller1.bind("scrollstart", function (event) {
        });
        $("#myDropdown").on("touchend", function (event) {
            dropDownTouchStatus = 1;
        });
        $("#dropDownButton").on("touchend", function (event) {
            dropDownTouchStatus = 1;
        });
    } catch (e) { }

    initialChart = $("#chart1").highcharts();
    xCross = initialChart.xAxis[0].crosshair,
    yCross = initialChart.yAxis[0].crosshair;
    var scroller = e.view.scroller;
    scroller.bind("scroll", function (e) {
        if (e.scrollTop > 0) {
            scroller.reset();
        } else if (e.scrollTop < 0) {
            if ((isiPadPro(device.model) || kendo.support.mobileOS.tablet) && ($(window).width() > $(window).height()) ? 90 : 0 == 90) {
                scroller.reset();
                e.preventDefault();
            } else {
                $(".km-scroller-pull").remove();
            }
        } else if (e.scrollTop == 0) {
            $("#updateDemand").css("display", "none");
        }
    });
    scroller.setOptions({
        pullToRefresh: true,
        messages: {
            pullTemplate: "",
            releaseTemplate: function () {
                $(".km-scroller-pull").remove();
                $("#rotatingImgDemand").addClass("imgSpan");
                $("#updateDemand").css("display", "block");
            },
            refreshTemplate: function () {
                $(".km-scroller-pull").remove();
                $("#rotatingImgDemand").addClass("imgSpan");
                $("#updateDemand").css("display", "block");
            }
        },
        pull: function () {
            if ((isiPadPro(device.model) || kendo.support.mobileOS.tablet) && ($(window).width() > $(window).height()) ? 90 : 0 == 90) {
                e.preventDefault();
            } else {
                pullToRefreshDemand();
                $(".km-scroller-pull").remove();
                setTimeout(function () {
                    scroller.pullHandled();
                    $("#updateDemand").css("display", "none");
                }, 800);
            }
        },
    })
}
function setGWSpacing(){
    var incrementGWSpacing = '';
    var chart1 = $('#chart1').highcharts();
    var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
    if (screenOrientation == 90) {
        incrementGWSpacing = yAxisGWSpaceLandscape+6;
    }else{
        incrementGWSpacing = yAxisGWSpacePotrait+6;
        if((chart1.yAxis[0].max + chart1.yAxis[0].min)/2> 99){
            incrementGWSpacing = incrementGWSpacing+2;
        }else if((chart1.yAxis[0].max + chart1.yAxis[0].min)/2 > 9){
            incrementGWSpacing = incrementGWSpacing+5;
        }
    }
    if(chart1.yAxis[0].max > 99){
        $('#chart1').highcharts().update({
            yAxis:{
                    y:10,
                  }
        });
        $(".highcharts-yaxis text").attr('y' , incrementGWSpacing);
    }else if(chart1.yAxis[0].max < 99 && chart1.yAxis[0].max > 10){
        $('#chart1').highcharts().update({
            yAxis:{
                    y:10,
                  }
        });
        $(".highcharts-yaxis text").attr('y' , incrementGWSpacing-4);
    } else if(chart1.yAxis[0].max <= 10){
        $('#chart1').highcharts().update({
            yAxis:{
                    y:10,
                  }
       });
       $(".highcharts-yaxis text").attr('y' , incrementGWSpacing);
    }       
}

function chartDisplay(returnValues,dropDownText){
    $('#chart1').highcharts({
        chart: {
            events: {
                load: function () {
                    $(".highcharts-legend-item path").attr('stroke-width', 16);
                    $(".highcharts-legend-item path").attr('stroke-height', 16);
                },
                redraw: function () {
                    $(".highcharts-legend-item path").attr('stroke-width', 16);
                    $(".highcharts-legend-item path").attr('stroke-height', 16);
                },
                click: function(event){
                },  
            },
            type: 'spline',
            marginLeft: 41,
            zoomType: 'x'
        }, 
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        title: {
            text: dropDownText,
            align: 'left',
            x: 8,
            useHTML: true,
            margin: -5,
            padding: 0,
            style: {
                color: '#000000',
                fontFamily: 'HelveticaNeue,sans-serif,Roboto regular',
                fontSize: '14px',
            },
        },
        xAxis: {
            categories: returnValues.categeries,
            title: {
                text: 'Hour beginning',
                style: {
                    color: '#000000',
                    fontFamily: 'HelveticaNeue-Medium,sans-serif-medium,Roboto-Medium',
                    fontSize: '13px'
                },
            },
            gridLineWidth: 1,
            tickInterval: 12 * 4,
            min: 0,
            max: 12 * 24,
            lineColor: '#000000',
            tickColor: 'transparent',
            lineWidth: 1,
            labels: {
                rotation: 0,
                step: 1,
                style: {
                    width: '2px',
                    color: '#000000',
                    paddingLeft: '12px',
                    fontFamily: 'HelveticaNeue-Medium,sans-serif-medium,Roboto-Medium',
                    fontSize: '12px',
                },
            },
            plotLines: [{
                color: '#000000',
                width: 1,
                value: 0,
                zIndex: 1
            }],
            minPadding: 0,
            maxPadding: 0,
        },
        subtitle: {
            text: 'Current Load: ' + '<span style="color:#3598DB;fontFamily:HelveticaNeue-Medium,sans-serif-medium,Roboto-Medium;font-size:15px;">' + returnValues.currentLoad + '</span></div>',
            y: 13,
            align: 'right',
            margin: -15,
            padding: 0,
            style: {
                color: '#000000',
                fontFamily: 'HelveticaNeue-Medium,sans-serif-medium,Roboto-Medium',
                fontSize: '15px',
            },
        },
        yAxis: {
            title: {
                text: 'GW',
                style: {
                    color: '#000000',
                    fontFamily: 'HelveticaNeue-Medium,sans-serif-medium,Roboto-Medium',
                    fontSize: '13px'
                },
            },
            gridLineWidth: 1,
            labels: {
                style: {
                    color: '#000000',
                    fontFamily: 'HelveticaNeue-Medium,sans-serif-medium,Roboto-Medium',
                    fontSize: '12px'
                },
            },
            offset: -10,
            allowDecimals: false,
            showFirstLabel: false,
            tickInterval: 5,
        },
        tooltip: {
            shape: "callout",
            crosshairs: [true, false],
            shared: true,
            crosshairs: {
                color: '#BCC1C6',
                dashStyle: 'LongDash',
                width: 1,
            },
            followPointer: false,
            borderColor: '#BCC1C6',
            borderWidth: 1,
            borderRadius: 12,
            useHTML: true,
            backgroundColor: '#F7F7F7',
            shadow: false,
            hideDelay: 0,
               formatter: function () {
                        if(!isTooltipEnabled) {
                            return false;
                        }else{
                            tooltip_status = 1;
                            var symbol = '■';
                            var timetoGraph;
                            var finalHeader;
                            var temp = toolTipCategeries[this.x];
                            if (this.x % 12 == 0) {
                                timetoGraph = temp.split(" ");
                                finalHeader = timetoGraph[0] + ":00 " + timetoGraph[1];
                            } else {
                                timetoGraph = temp;
                                finalHeader = timetoGraph;
                            }
                            var s = '<span style="font-size:12px !important;display:block;font-family:HelveticaNeue,sans-serif,Roboto regular !important;text-align:center;">At '
                                + finalHeader + "</span>";
                            for (var i = 0; i < seriesArr.length; i++) {
                                if (seriesArr[i].data[this.x] != null) {
                                    s += '<span style="display:block;line-height:1;font-family:HelveticaNeue !important;font-size:18px !important;"><span style="color:'
                                        + seriesArr[i].color
                                        + ';padding-right:5px;">' + symbol + '</span>' + seriesArr[i].data[this.x].toFixed(1) + '</span>';
                                }
                            }
                            return '<div style="border-radius:12px;background-color:#F7F7F7;" class="tooltip"> ' + s +
                                '</div>';
                        }
            },
            style: {
                fontFamily: 'HelveticaNeue',
                fontSize: '18px'
            },
        },
        rangeSelector: {
            selected: 1
        },
        plotOptions: {
            spline: {
                lineWidth: 2,
                marker: {
                    enabled: false
                },
                events: {
                    legendItemClick: function () {
                        return false;
                    },
                }
            },
            series: {
                enableMouseTracking: true,
                connectNulls: true,
                states: {
                    hover: {
                        enabled: false
                    }
                },
                events: {      
                }
            },
            lineWidth: 1,
        },
        series: seriesArr
    }); 
}

function onChart() {
    $('#chart1').on({ 
        'touchend': function(evt){
            if(dropDownOpen == 1 && dropDownTouchStatus == 0){
                dropDownOpen = 0;
                isTooltipEnabled = true;
                crosshairsDisable();
                $("#myDropdown").css("display","none");
                $("#dropDownButton").css("border-radius","5px 5px 5px 5px");
            }
            setTimeout(function(){
                if(tooltip_status==1 && dropDownOverStatus == 0 && dropDownTouchStatus == 0) {
                    tooltip_status=0;
                    var prevClicks = localStorage.getItem('DemandClicks');
                    localStorage.setItem("DemandClicks", parseInt(prevClicks) + 1);
                }else if(dropDownOverStatus ==1 || dropDownTouchStatus == 1){
                    dropDownOverStatus = 0;
                    dropDownTouchStatus = 0;
                }
            },25)
        },
        'touchmove':function (evt){
            if(dropDownOpen == 1 && dropDownTouchStatus == 0 && !isDropDownClicked){
                dropDownOpen = 0;
                isTooltipEnabled = true;
                crosshairsDisable();
                $("#myDropdown").css("display","none");
                $("#dropDownButton").css("border-radius","5px 5px 5px 5px");
            }
            if(setGWSpacingOnMove == false){
                setGWSpacingOnMove = true;
                setGWSpacing();
            }
        }
    });
}
function landscapeChartUpdate(size){
    $('#chart1').highcharts().update({
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0,
            itemMarginTop: 6,
            padding: 15,
            itemStyle: {
                font: 'HelveticaNeue,sans-serif,Roboto regular',
                fontSize: '13px'
            },
        },
        subtitle: {
            y: 15,
            x: -132,
            margin: -15,
        },
        chart: {
            marginLeft: 45,
            spacingBottom: 30,
            height: size.height - 110,
            width: size.width - 10,
        },
    });
}
function portraitChartUpdate(size){
    $('#chart1').highcharts().update({
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            itemMarginTop: 12,
            padding: 1,
        },
        subtitle: {
            y: 13,
            x: 0,
            margin: 0,
        },
        chart: {
            marginLeft: 41,
            spacingBottom: 20,
            height: size.height - 130,
            width: size.width - 10,
        },
        yAxis:{
            y:10,
        }
    });
}
function getDemandGraphList(demandGraphList){
    var currentLoad;
    var tempCurrentLoad;
    var categeries = [];
    var tempToolTipCategeries = [];
    var returnedObject = {};
    demandGraphList.forEach(function (graphItem) {
        var pointsArr = [];
        for (var i = 0; i < graphItem.Points.length; i++) {
            if (graphItem.Graph_Name == "Actual") {
                var xaxisItemLabel = graphItem.Points[i][0].split(" ");
                categeries.push(xaxisItemLabel[0] + "<br>" + xaxisItemLabel[1]);
                tempToolTipCategeries.push(graphItem.Points[i][0]);
                if (graphItem.Points[i][1] != null) {
                    tempCurrentLoad = graphItem.Points[i][1].toFixed(1);
                }
            }
            pointsArr.push(graphItem.Points[i][1]);
        }
        toolTipCategeries = tempToolTipCategeries ;
        currentLoad = tempCurrentLoad;
        var colr;
        var enableMouseTrackingfortooltip;
        var graph_Name = "";
        if (graphItem.Graph_Name == "Actual") {
            colr = "#448ABE";
            graph_Name = graphItem.Graph_Name;
            enableMouseTrackingfortooltip = true;
        } else if (graphItem.Graph_Name == "ForeCast") {
            colr = "#F8C037";
            graph_Name = "Forecast";
            enableMouseTrackingfortooltip = true;
        } else if (graphItem.Graph_Name == "Day Ahead") {
            colr = "#000";
            graph_Name ="Day-Ahead";
            enableMouseTrackingfortooltip = false;
        } else {
            colr = "#FA6A2D";
            graph_Name = graphItem.Graph_Name;
            enableMouseTrackingfortooltip = true;
        }
        var obj = {
            "name": graph_Name,
            "data": pointsArr,
            "color": colr,
            "enableMouseTracking": enableMouseTrackingfortooltip
        };
        seriesArr.push(obj);
    });
    returnedObject["currentLoad"] = currentLoad;
    returnedObject["categeries"] = categeries;
    return returnedObject;
}
function updateChartSeries(){
    var chart = $('#chart1').highcharts();
    if (seriesArr.length == 3) {
        if (chart.series.length == 1) {
            for (var i = 0, len = seriesArr.length; i < len; i++) {
                if (i == 0 && chart.series[i].name == "Actual") {
                    chart.series[i].setData(seriesArr[i].data, false);
                } else {
                    chart.addSeries(seriesArr[i], false);
                }
            }
        } else if (chart.series.length == 3) {
            for (var i = 0, len = seriesArr.length; i < len; i++) {
                chart.series[i].setData(seriesArr[i].data, false);
                chart.series[i].name = seriesArr[i].name;
                chart.series[i].color = seriesArr[i].color;
                chart.series[i].enableMouseTrackingfortooltip = seriesArr[i].enableMouseTrackingfortooltip;
            }
        }
    } else {
        for (var i = 0, len = chart.series.length; i < len; i++) {
            if (chart.series[i].name == "Actual") {
                chart.series[i].setData(seriesArr[i].data, false);
            } else {
                try{
                    chart.series[i].remove();
                }catch(e){} 
                len--; i--;
            }
        }
    }
}
function checkDevicePlatformForLandscape(){
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        $("#lastupdatedGraph").css("text-align", "left");
        $("#tableRefreshForDemand").show();
        $("#lastupdatedGraph").show();
        $(".km-widget.km-navbar").css("height", '55px');
        if(device.platform == "iOS"){
            $("#myDropdown").css("height","348px");
        }else if (device.platform == 'android' || device.platform == 'Android') {
            $("#myDropdown").css("height","318px");
        }
    }else if(device.platform == "iOS"){
        $("#myDropdown").css("height","139px");
    }else if (device.platform == 'android' || device.platform == 'Android') {
        $("#myDropdown").css("height","129px");
    }
}
function checkDevicePlatformForportrait(){
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        $("#tableRefreshForDemand").hide();
        $("#lastupdatedGraph").show();
        $("#tablateUpdatedDateForDemand").hide();
        setTimeout(function () {
            $(".km-ios7 .km-tabstrip .km-button").css("display", "table-cell");
            $(".km-ios7 .km-tabstrip .km-button").css("padding-left", "0px");
            $(".km-ios7 .km-view-title").css("line-height", "2.5em");
            $(".km-widget.km-navbar").css("height", 'auto');
        }, 100);
    }
    $("#lastupdatedGraph").css("text-align", "left");
    $("#lastupdatedGraph").css("padding-right", "0px");
    if(device.platform == "iOS"){
        $("#myDropdown").css("height","348px");
    }else if (device.platform == 'android' || device.platform == 'Android') {
        $("#myDropdown").css("height","318px");
    }
}
function closeDropDown(){
    isTooltipEnabled = true;		
    crosshairsDisable();
    formatterMethodUpdate();
    $("#myDropdown").css("display", "none");
    $("#dropDownButton").css("border-radius", "5px 5px 5px 5px");
    setGWSpacing();
}
document.addEventListener("pause", closeDropDown, false);

function refreshDemandGraphData(){
        try{
	        closeDropDown();
            var response = (function() {
                var regionId = $('#dropDownButton span:first').text();
                if("PJM-RTO" == regionId){
                    regionId = "PJM RTO Total";
                    return regionId;
                }else{
                    return regionId;
                }
            })();  
            regionsDemandGraphOrientationDeviceCSschanges(response);
        }catch(e){  }
}