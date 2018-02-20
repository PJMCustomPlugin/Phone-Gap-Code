var maxDataValue=0;

function dispatchedReservesInit_land(){
    $('.km-leftitem').css('margin-left', '0%');
    $('#dispatchedReservesView_land > div.km-content.km-widget.km-scroll-wrapper > div.km-scroll-container').css('transform', 'none');
    showDispatchedReserves_landscape();
}
function showDispatchedReserves_landscape() {
    getDispatchedReservesLandscapeChartSeries();
    dispatchedReservesLandscapeChartDisplay("#dispatched_RTO_OR_chart","RTO");
    dispatchedReservesLandscapeChartDisplay("#dispatched_Mid_Atlantic_OR_chart","Mid-Atlantic");
}
function getDispatchedReservesLandscapeChartSeries(){
    try{
        if(!jQuery.isEmptyObject(dbapp.dispatchedReservesData)){
            maxDataValue=0;
            getDRChartSeriesForRegion(dbapp.dispatchedReservesData.dispatchedReservesRTO,"RTO");
            getDRChartSeriesForRegion(dbapp.dispatchedReservesData.dispatchedReservesMAD,"Mid-Atlantic");
            var newestUpdatedDate = dbapp.dispatchedReservesData.updatedTimestamp;
            $("#lastDispatchedReservesUpdatedDate_landscape").html("As of " + newestUpdatedDate.replace("EDT", "EPT").replace("AM", "a.m.").replace("EST", "EPT").replace("PM", "p.m."));
        }
    }catch(e){}
}
function getDRChartSeriesForRegion(dispatchedReservesGraphData,titleName){
    var actualDataArr = [];
    var reliabilityDataArr = [];
    var requirementDataArr = [];
    dispatchedReservesGraphData.forEach(function (object) {
        if(maxDataValue < object.value){
            maxDataValue=object.value;
        }
        if (object.reserveType == "Primary Reserves"){
            actualDataArr[0]=object.value;
        }else if(object.reserveType == "Primary Reserves Requirement"){
            requirementDataArr[0]=object.value;
        }else if(object.reserveType == "Primary Reserves Reliability Requirement"){
            reliabilityDataArr[0]=object.value;
        } else if(object.reserveType == "Synchronized Reserves") {
            actualDataArr[1]=object.value;
        } else if (object.reserveType == "Synchronized Reserves Requirement"){
            requirementDataArr[1]=object.value;
        }else if(object.reserveType == "Synchronized Reserves Reliability Requirement") {
            reliabilityDataArr[1]=object.value;
        }else if(object.reserveType == "Extended Requirement") {
            requirementDataArr[2]=object.value;
        }  
    });
    var actualObj = {
        "name": "Actual",
        "data": actualDataArr,
        dataLabels: {
                enabled: true,
                color: '#2D272B',// not getting applied
        },
        "color": "#689D41",
    };
    var reliabilityObj = {
        "name": "Reliablity Requirement",
        "data": reliabilityDataArr,
        dataLabels: {
                enabled: true,
                color: '#2D272B',// not getting applied
        },
        "color": "#EBECEE",
    };
    var requirementObj = {
        "name": "Requirement",
        "data": requirementDataArr,
        dataLabels: {
                enabled: true,
                color: '#2D272B',// not getting applied
        },
        "color": "#BCBCBC",
    };
    if (titleName == "RTO") {
        seriesRTO = [];
        seriesRTO.push(actualObj);
        seriesRTO.push(reliabilityObj);
        seriesRTO.push(requirementObj);  
    } else if (titleName == "Mid-Atlantic") {
        seriesMAD = [];
        seriesMAD.push(actualObj);
        seriesMAD.push(reliabilityObj);
        seriesMAD.push(requirementObj);  
    }
}
function dispatchedReservesLandscapeChartDisplay(chartID,titleName){
    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
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
    var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
    $(chartID).css("width", size.width/2);
    if (screenOrientation == 90) {
        $(chartID).css("height", size.height - 150);
        $("#lastupdatedGraph").css("text-align", "right");
        $("#lastupdatedGraph").css("padding-right", "8px");
        constructDispatchedReserversChartLandscape(chartID,45,titleName);
        landscapeDispatchedReserversChartUpdate(chartID,45);
        var leftSpace = $(window).width()/4;
        if(chartID == "#dispatched_RTO_OR_chart"){
            var x = $("div#dispatched_RTO_OR_chart").find(".highcharts-legend").attr("transform").split(",")[0].split("(")[1];
            var y = $("div#dispatched_RTO_OR_chart").find(".highcharts-legend").attr("transform").split(",")[1].split(")")[0];
            $("div#dispatched_RTO_OR_chart").find(".highcharts-legend").attr("transform","translate("+(Number(x)+(275))+","+Number(y)+")");
        }else if(chartID == "#dispatched_Mid_Atlantic_OR_chart"){
            var x1 = $("div#dispatched_Mid_Atlantic_OR_chart").find(".highcharts-legend").attr("transform").split(",")[0].split("(")[1];
            var y1 = $("div#dispatched_Mid_Atlantic_OR_chart").find(".highcharts-legend").attr("transform").split(",")[1].split(")")[0];
            $("div#dispatched_Mid_Atlantic_OR_chart").find(".highcharts-legend").attr("transform","translate("+(Number(x1)-(235))+","+Number(y1)+")");
        }
    }
}

function landscapeDispatchedReserversChartUpdate(chartID,pointWidth){
    // axis line
    $("div"+chartID).find("path.highcharts-axis-line").attr('stroke', '#689D41');
    var dashArraySecWidth = (3*pointWidth)+1;
    $("div"+chartID).find("g.highcharts-series.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker ")
                    .find("rect.highcharts-point").each(function(i, obj) {
                        if(i==2){
                            $(obj).attr("x",340);
                            }
                    });
    $("div"+chartID).find("g.highcharts-data-labels.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                    .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                        var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                        var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                        if(i==2){
                            $(obj).attr("transform","translate("+(Number(x)-93)+","+Number(y)+")");
                        }else{
                            $(obj).attr("transform","translate("+(Number(x)-3)+","+Number(y)+")");
                        }
                    });
    $("div"+chartID).find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                        var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                        var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                        $(obj).attr("transform","translate("+(Number(x)-3)+","+Number(y)+")");
        }); 
    $("div"+chartID).find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                        var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                        var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                        $(obj).attr("transform","translate("+(Number(x)-3)+","+Number(y)+")");
    });

    $("div"+chartID).find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                $(obj).css('font-size', "14px");
    }); 
    $("div"+chartID).find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                $(obj).css('font-size', "14px");
    }); 
    $("div"+chartID).find("g.highcharts-data-labels.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                 $(obj).css('font-size', "14px");
    }); 
    //XAxis labels
    $("div"+chartID).find("g.highcharts-axis-labels.highcharts-xaxis-labels")
                    .find("text").each(function(i, obj) {
                        if(i==2){
                            var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                            var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                            $(obj).attr("transform","translate("+(Number(x)-44)+","+Number(y)+")");
                        }
                    });
    $("div"+chartID).find("path.highcharts-axis-line").attr('stroke-dasharray',"0 15.2 "+dashArraySecWidth+" 10.8 0 15.2 "+dashArraySecWidth+" 10.8 0 15.6 "+(dashArraySecWidth/3)+" "+(dashArraySecWidth));
}

function constructDispatchedReserversChartLandscape(chartID,pointWidth,titleName){
    Highcharts.setOptions({
        lang: {
          thousandsSep: ','
        }
    });
    $(chartID).highcharts({
        chart: {
            events: {
                click: function(event){
                }, 
                redraw: function(){
                }, 
               load: function () {
                    $("path.highcharts-tick").attr('stroke-width', 0);
                    //legend rectangle
                    $("div"+chartID).find("rect.highcharts-point").attr('stroke', '#689D41');
                    $("div"+chartID).find("rect.highcharts-point").attr('stroke-width', '1');
                    
                    var legendText = $("g.highcharts-legend-item text").attr('y');
                    var legendRect = $("g.highcharts-legend-item rect").attr('y');
                   
                    $("div"+chartID).find("g.highcharts-legend-item text").attr('y', legendText-10);
                    $("div"+chartID).find("g.highcharts-legend-item rect").attr('y', legendRect-10);
                   //$("div"+chartID).find("g.highcharts-data-labels").first().find("g.highcharts-label text").css({ 'color':'#000','fill':'#000'});
                    $("div"+chartID).find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker ")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                         $(obj).find("text").css({ 'color':'#8B9499','fill':'#8B9499'});
                    });

                    $("div"+chartID).find("g.highcharts-data-labels.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                         $(obj).find("text").css({ 'color':'#7F8082','fill':'#7F8082'});
                    });
                },
            },
            type: 'column',
            marginLeft: "RTO"==titleName?60:40,
            marginRight: "RTO"==titleName?-40:-20,
            marginBottom:130,
        }, 
        legend: {
            //align:"RTO"==titleName?'right':'left',
            paddingBottom: 2,
            margin: 30,
            symbolHeight: 10,
            symbolWidth: 10,
            symbolRadius: 2,
            //width: 210,
            //itemWidth:70,
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        title: {
            text: titleName,
            useHTML: false,
            style: {
                padding:0,
                margin:0,
                color: '#000000',
                fontSize: '18px',
                fontWeight: 'bold',
            },
        },
        xAxis: {
            categories: ['<span>Primary</span><br><span>Reserves</span>', '<span>Synchronized</span><br><span>Reserves</span>', '<span>Extended</span><br><span>Requirement</span>'],
            lineColor: 'transparent',
            y: 55,
        },
        subtitle: {
        },
        series: "RTO"==titleName?seriesRTO:seriesMAD,
        drilldown: {
            activeAxisLabelStyle: {
                textDecoration: 'none',
                color:'#000',
                fontFamily: 'HelveticaNeue,sans-serif,Roboto regular',
                fontSize: '14px',
                fontWeight:'20'
            },
            activeDataLabelStyle: {
                textDecoration: 'none',
                color: "#7D8087", 
                fontFamily: 'HelveticaNeue,sans-serif,Roboto regular',
                fontSize: '14px',
                fontWeight: "bold"
            },
        },
        yAxis:{
            visible:false,
            max: maxDataValue
        },
        tooltip: { enabled: false },
        plotOptions: {
          column: { 
                pointWidth:pointWidth,
                dataLabels: {
                    enabled: true,
                    crop: false,
                    overflow: 'none',
                    inside: false
                }
          },
           series: {
                animation: false,
                borderColor: '#689D41',
                pointPadding: 0,
                groupPadding: 0.076,
                events: {
                        legendItemClick: function () {
                                return false;
                        }
                }
          }
        },
     },
    );
}
function backToOperationalFromDispatchedReserves_Tab(){
    if(!isMoreClicked){
         isMoreReserves = true;
     }else{
         isMoreReserves = false;
     }
     isMoreClicked = true;
     isAlertsClicked = false;
     runningPageChange(19);
     defaultMorePrevPageInPortrait=19;
    //  if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
    //         window.screen.lockOrientation();
    //  }
}