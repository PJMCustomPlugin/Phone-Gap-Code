var maxDataValue=0;

function operationalReservesInit_land(){
    $('.km-leftitem').css('margin-left', '0%');
    showOperationalReserves_landscape();
}
function showOperationalReserves_landscape() {
    getOperationalReservesLandscapeChartSeries();
    operationalReservesLandscapeChartDisplay("#RTO_OR_chart","RTO");
    operationalReservesLandscapeChartDisplay("#Mid_Atlantic_OR_chart","Mid-Atlantic");
    operationalReservesLandscapeChartDisplay("#Dominion_OR_chart","Dominion");
}
function getOperationalReservesLandscapeChartSeries(){
    try{
        if(!jQuery.isEmptyObject(dbapp.operationalReservesData)){          
            maxDataValue=0;
            getORChartSeriesForRegion(dbapp.operationalReservesData.opeartionalReservesRTO,"RTO");
            getORChartSeriesForRegion(dbapp.operationalReservesData.opeartionalReservesMAD,"Mid-Atlantic");
            getORChartSeriesForRegion(dbapp.operationalReservesData.opeartionalReservesDOM,"Dominion");

            var newestUpdatedDate = dbapp.operationalReservesData.updatedTimestamp;
            $("#lastOperationalReservesUpdatedDate_landscape").html("As of " + newestUpdatedDate.replace("EDT", "EPT").replace("AM", "a.m.").replace("EST", "EPT").replace("PM", "p.m."));        
        }
    }catch(e){
    }
}
function getORChartSeriesForRegion(operationalReservesGraphData,titleName){
    var actualDataArr = [];
    var reliabilityDataArr = [];
    reliabilityDataArr[0]=null;
    operationalReservesGraphData.forEach(function (object) {
        if(maxDataValue < object.value){
            maxDataValue=object.value;
        }
        if (object.reserveType == "Operating Reserves"){
            actualDataArr[0]=object.value;
        }else if(object.reserveType == "Primary Reserves"){
            actualDataArr[1]=object.value;
        } else if(object.reserveType == "Synchronized Reserves") {
            actualDataArr[2]=object.value;
        } else if (object.reserveType == "Reliability Primary Reserves Requirement"){
            reliabilityDataArr[1]=object.value;
        }else if(object.reserveType == "Reliability Synchronized Reserves Requirement" && titleName !="Dominion") {
            reliabilityDataArr[2]=object.value;
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
    if (titleName == "RTO") {
        seriesRTO = [];
        seriesRTO.push(actualObj);
        seriesRTO.push(reliabilityObj);
    } else if (titleName == "Mid-Atlantic") {
        seriesMAD = [];
        seriesMAD.push(actualObj);
        seriesMAD.push(reliabilityObj);
    } else if (titleName == "Dominion") {
        seriesDOM = [];
        seriesDOM.push(actualObj);
        seriesDOM.push(reliabilityObj);
    }  
}
function operationalReservesLandscapeChartDisplay(chartID,titleName){
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
    $(chartID).css("width", size.width/3);
    if (screenOrientation == 90) {
        $(chartID).css("height", size.height - 150);
        $("#lastupdatedGraph").css("text-align", "right");
        $("#lastupdatedGraph").css("padding-right", "8px");
        constructOperationalReserversChartLandscape(chartID,45,titleName);
        landscapeOperationalReserversChartUpdate(chartID,45,titleName);
        $(".highcharts-tooltip text").attr('y', '20');
    }else{
        showOperationalReserves();
    }
}

function landscapeOperationalReserversChartUpdate(chartID,pointWidth,titleName){
    var dashArraySecWidth = (2*pointWidth)+1;
    $("div"+chartID).find("path.highcharts-axis-line").attr('stroke', '#689D41');
    $("div"+chartID).find("g.highcharts-series.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                    .find("rect.highcharts-point").each(function(i, obj) {
                            if(i==0){
                                $(obj).attr("x",54);
                            }
                            if(titleName == "Dominion" && i==2){
                                $(obj).attr("x",216);
                            }
    });
    $("div"+chartID).find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                    .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                            var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                            var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                            if(i==0){
                                $(obj).attr("transform","translate("+(Number(x)+42)+","+Number(y)+")");
                            }else{
                                $(obj).attr("transform","translate("+(Number(x)-4)+","+Number(y)+")");
                            }
                            if(titleName == "Dominion" && i==2){
                                var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                $(obj).attr("transform","translate("+(Number(x)+4)+","+Number(y)+")");
                            }
    });
    $("div"+chartID).find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                $(obj).attr("transform","translate("+(Number(x)-4)+","+Number(y)+")");

    });
     $("div"+chartID).find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").find("text").each(function(i, obj) {
                                $(obj).css('font-size', "14px");
            });
    $("div"+chartID).find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").find("text").each(function(i, obj) {
                                $(obj).css('font-size', "14px");
            });
    //xaxis labels
    $("div"+chartID).find("g.highcharts-axis-labels.highcharts-xaxis-labels")
                    .find("text").each(function(i, obj) {
                            if(i==0){
                                var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                $(obj).attr("transform","translate("+(Number(x)+22)+","+Number(y)+")");
                            }
                            if(titleName == "Dominion" && i==2){
                                var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                $(obj).attr("transform","translate("+(Number(x)-20)+","+Number(y)+")");
                            }
    });
    if(titleName == "Dominion"){
        $("div"+chartID).find("path.highcharts-axis-line").attr('stroke-dasharray',"0 "+(32+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2-1)+" 3 0 10 "+(dashArraySecWidth)+" 3 0 "+((dashArraySecWidth/4)-13)+" "+(dashArraySecWidth/2)+" 5.5");
    }else{
        $("div"+chartID).find("path.highcharts-axis-line").attr('stroke-dasharray',"0 "+(32+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2-1)+" 3 0 10 "+(dashArraySecWidth)+" 3 0 10 "+(dashArraySecWidth-1)+" 5.5");
    }
}

function constructOperationalReserversChartLandscape(chartID,pointWidth,titleName){
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
                    
                    var legendText = $("div"+chartID).find("g.highcharts-legend-item text").attr('y');
                    var legendRect = $("div"+chartID).find("g.highcharts-legend-item rect").attr('y');
                    $("div"+chartID).find("g.highcharts-legend-item text").attr('y', legendText-10);
                    $("div"+chartID).find("g.highcharts-legend-item rect").attr('y', legendRect-10);
                    //$("div"+chartID).find("g.highcharts-data-labels").first().find("g.highcharts-label text").css({ 'color':'#000','fill':'#000'});
                    $("div"+chartID).find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                        $(obj).find("text").css({ 'color':'#8B9499','fill':'#8B9499'});
                    });
                    if("Mid-Atlantic" != titleName){
                        $("div"+chartID).find("g.highcharts-legend-item.highcharts-column-series.highcharts-color-undefined.highcharts-series-0").css({ 'display':'none'});
                        $("div"+chartID).find("g.highcharts-legend-item.highcharts-column-series.highcharts-color-undefined.highcharts-series-1").css({ 'display':'none'});
                    }
                    $("div"+chartID).find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined.highcharts-drilldown-data-label")
                                    .find("text tspan:nth-child(2)").each(function(i, obj) {
                                            if($(obj).html().split(',').length >= 2){
                                                $(obj).attr("x",2);
                                            }
                    });
                },
            },
            type: 'column',
            marginLeft: 10,
            marginRight: 15,
            marginBottom:130
        }, 
        legend: {
            margin: 30,
            symbolHeight: 10,
            symbolWidth: 10,
            symbolRadius: 2
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
                //fontFamily: 'HelveticaNeue,sans-serif,Roboto regular',
                fontSize: '18px',
                fontWeight: 'bold',
            },
        },
        xAxis: {
            categories: ['<span>Operating</span><br><span>Reserves</span>', '<span>Primary</span><br><span>Reserves</span>', '<span>Synchronized</span><br><span>Reserves</span>'],
            lineColor: 'transparent',
            y: 55,
        },
        subtitle: {
        },
        series: "RTO"==titleName?seriesRTO:("Mid-Atlantic"==titleName?seriesMAD:seriesDOM),
        
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
            max:maxDataValue,
        },
        tooltip: { enabled: false },
        plotOptions: {
          column: { 
                //stacking: 'normal',
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
                groupPadding: 0.065,
                events: {
                    legendItemClick: function () {
                            return false;
                    }
                }
          }
        },
    });
}
function backToMoreFromOperationalReserves_Tab(){
     if(!isMoreClicked){
         isMoreReserves = true;
     }else{
         isMoreReserves = false;
     }
     isMoreClicked = true;
     isAlertsClicked = false;
     runningPageChange(9);
    defaultMorePrevPageInPortrait=9;
}