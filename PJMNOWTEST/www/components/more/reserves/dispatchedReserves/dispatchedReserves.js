var dispatchedReserves_type = "RTO";
var dataValues ={};
var isTablet =false;

function dispatchedReservesInit(){
    $('.km-leftitem').css('margin-left', '0%');
    showDispatchedReserves();
}

function operationalReservesArrowClick(){
}
function pullToRefreshForDispatchedReserves(){
    if (isOnline()) {
        dispatchedData();
    } else {
        networkConnectionCheckingWhileUpdating();
    }
}

function initPullToRefreshScrollerForDispatchedReserves(e) {
    var scroller = e.view.scroller;
    scroller.setOptions({
        pullToRefresh: true,
        messages: {
            pullTemplate: "",
            releaseTemplate: function () {
                $(".km-scroller-pull").remove();
                $("#updateDispatchedReserves").css("display", "block");
                $("#rotatingImgDispatchedReserves").addClass("imgSpan");
            },
            refreshTemplate: function () {
                $(".km-scroller-pull").remove();
                $("#updateDispatchedReserves").css("display", "block");
                $("#rotatingImgDispatchedReserves").addClass("imgSpan");
            }
        },
        pull: function () {
            if (isiPadPro(device.model) || kendo.support.mobileOS.tablet && ($(window).width() > $(window).height()) ? 90 : 0 == 90) {
                e.preventDefault();
            } else {
                pullToRefreshForDispatchedReserves();
                $(".km-scroller-pull").remove();
                setTimeout(function () {
                    scroller.pullHandled();
                    $("#updateDispatchedReserves").css("display", "none");
                }, 800);
            }
        },
    })
    scroller.bind("scroll", function (e) {
        if (e.scrollTop < 0) {
            if (isiPadPro(device.model) || kendo.support.mobileOS.tablet && ($(window).width() > $(window).height()) ? 90 : 0 == 90) {
                scroller.reset();
                e.preventDefault();
            } else {
                $(".km-scroller-pull").remove();
            }
        } else if (e.scrollTop == 0) {
            $("#updateDispatchedReserves").css("display", "none");
        } else if (e.scrollTop > 0) {
            scroller.reset();
        }
    });
}

function dispatchedReservesChartDispaly(titleName){
    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    }
    dispatchedReserves_type = titleName;
     try{
        if(!jQuery.isEmptyObject(dbapp.dispatchedReservesData)){
            var dispatchedReservesGraphData;
            if (titleName == "RTO") {
                dispatchedReservesGraphData = dbapp.dispatchedReservesData.dispatchedReservesRTO;
            } else if (titleName == "Mid-Atlantic") {
                dispatchedReservesGraphData = dbapp.dispatchedReservesData.dispatchedReservesMAD;
            }
            var newestUpdatedDate = dbapp.dispatchedReservesData.updatedTimestamp;
            $("#lastDispatchedReservesUpdatedDate").html("As of " + newestUpdatedDate.replace("EDT", "EPT").replace("AM", "a.m.").replace("EST", "EPT").replace("PM", "p.m."));
            seriesArr = [];
            var actualDataArr = [];
            var reliabilityDataArr = [];
            var requirementDataArr = [];
            dispatchedReservesGraphData.forEach(function (object) {
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
            seriesArr.push(actualObj);
            seriesArr.push(reliabilityObj);
            seriesArr.push(requirementObj);  
        }
    }catch(e){}
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
    $("#dispatchedReservesChart").css("width", size.width - 10);
    var pointWidth = size.width/11;
    var groupPadding = 0;
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        if($(window).width()>1000){
            groupPadding = 0.105;
        }else if($(window).width()>700){
            groupPadding =  0.077;
        }else{
            groupPadding = 0.095;
        }
        isTablet =true;
    }else {
        pointWidth = pointWidth+6;
        if($(window).width()>400){
            groupPadding =0.055;
        }else if($(window).width()>340){
            groupPadding = 0.052;
        }else{
            groupPadding = 0.047;
        } 
    }
    if (screenOrientation == 90) {
        showDispatchedReserves_landscape();
    } else {
        $("#dispatchedReservesChart").css("height", size.height - 140);
        constructDispatchedReserversChart(pointWidth,groupPadding);
        portraitDispatchedReserversChartUpdate(pointWidth);
    }
    if(titleName == 'Mid-Atlantic'){
        $('tspan#dispatched_RTO').css('background-color', "#f8f8f8");
        $('tspan#dispatched_RTO').css('color', "#000");
        $('tspan#dispatched_MAD').css('background-color', "#418CC0");
        $('tspan#dispatched_MAD').css('color', "#FFF");
    }else{
        $('tspan#dispatched_MAD').css('background-color', "#f8f8f8");
        $('tspan#dispatched_MAD').css('color', "#000");
        $('tspan#dispatched_RTO').css('background-color', "#418CC0");
        $('tspan#dispatched_RTO').css('color', "#FFF");
    }
}
function portraitDispatchedReserversChartUpdate(pointWidth){
    $("div#dispatchedReservesChart").find("path.highcharts-axis-line").attr('stroke', '#689D41');
    var dashArraySecWidth = (3*(pointWidth))+0.6;
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        var leftSpace = $(window).width()*2/100;
        $("div#dispatchedReservesChart").find("g.highcharts-series.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker ")
                            .find("rect.highcharts-point").each(function(i, obj) {
                                        if(i==2){
                                            $(obj).attr("x",522);
                                        }
        });
        $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                        var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                        var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                        if(i==2){
                                            $(obj).attr("transform","translate("+(Number(x)-148)+","+Number(y)+")");
                                        }else{
                                            $(obj).attr("transform","translate("+(Number(x)-9)+","+Number(y)+")");
                                        }
        }); 
         $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                        var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                        var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                        $(obj).attr("transform","translate("+(Number(x)-9)+","+Number(y)+")");
        }); 
         $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                        var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                        var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                        $(obj).attr("transform","translate("+(Number(x)-9)+","+Number(y)+")");
        }); 
        $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                                        $(obj).css('font-size', "18px");
        }); 
        $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                                        $(obj).css('font-size', "18px");
        }); 
        $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                                        $(obj).css('font-size', "18px");
        }); 
        //XAxis labels
        $("div#dispatchedReservesChart").find("g.highcharts-axis-labels.highcharts-xaxis-labels")
                            .find("text").each(function(i, obj) {
                                        if(i==2){
                                            var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                            var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                            $(obj).attr("transform","translate("+(Number(x)-69)+","+Number(y)+")");
                                        }
        });
        $("div#dispatchedReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 24.2 "+dashArraySecWidth+" 14.8 0 24.2 "+dashArraySecWidth+" 14.8 0 24.2 "+(dashArraySecWidth/3)+" "+(dashArraySecWidth/2));
        var x = $("div#dispatchedReservesChart").find(".highcharts-legend").attr("transform").split(",")[0].split("(")[1];
        var y = $("div#dispatchedReservesChart").find(".highcharts-legend").attr("transform").split(",")[1].split(")")[0];
        $("div#dispatchedReservesChart").find(".highcharts-legend").attr("transform","translate("+(Number(x)+Number(leftSpace)*2)+","+(Number(y)-10)+")");
    }else{
        var leftSpace = $(window).width()*2/100;
        if($(window).width()>400){
            $("div#dispatchedReservesChart").find("g.highcharts-series.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker ")
                            .find("rect.highcharts-point").each(function(i, obj) {
                                        if(i==2){
                                            $(obj).attr("x",306);
                                        }
            });
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                        var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                        var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                        if(i==2){
                                            $(obj).attr("transform","translate("+(Number(x)-89)+","+Number(y)+")");
                                        }else{
                                            $(obj).attr("transform","translate("+(Number(x)-4)+","+Number(y)+")");
                                        }
            });
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                        var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                        var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                        $(obj).attr("transform","translate("+(Number(x)-4)+","+Number(y)+")");
            }); 
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                            var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                            var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                            $(obj).attr("transform","translate("+(Number(x)-4)+","+Number(y)+")");
            }); 
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                                            $(obj).css('font-size', "14px");
            }); 
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                                            $(obj).css('font-size', "14px");
            }); 
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                                            $(obj).css('font-size', "14px");
            });  
            //XAxis labels
            $("div#dispatchedReservesChart").find("g.highcharts-axis-labels.highcharts-xaxis-labels")
                            .find("text").each(function(i, obj) {
                                        if(i==2){
                                            var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                            var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                            $(obj).attr("transform","translate("+(Number(x)-43)+","+Number(y)+")");
                                        }
            });
            dashArraySecWidth = (3*(pointWidth))+2.1;
            $("div#dispatchedReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 10 "+(dashArraySecWidth-1)+" 1.6 0 15 "
            +(dashArraySecWidth-2)+" 1.6 0 15"+" "+(dashArraySecWidth/3)+" "+(4+(dashArraySecWidth)));
        }else if($(window).width()>370){
            $("div#dispatchedReservesChart").find("g.highcharts-series.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker ")
                            .find("rect.highcharts-point").each(function(i, obj) {
                                        if(i==2){
                                            $(obj).attr("x",280);
                                        }
            });
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                    var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                    var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                    if(i==2){
                                        $(obj).attr("transform","translate("+(Number(x)-81)+","+Number(y)+")");
                                    }else{
                                        $(obj).attr("transform","translate("+(Number(x)-3)+","+Number(y)+")");
                                    }
            });
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                        var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                        var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                        $(obj).attr("transform","translate("+(Number(x)-3)+","+Number(y)+")");
            }); 
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                            var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                            var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                            $(obj).attr("transform","translate("+(Number(x)-3)+","+Number(y)+")");
            }); 
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                                            $(obj).css('font-size', "13px");
            }); 
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                                            $(obj).css('font-size', "13px");
            }); 
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                                            $(obj).css('font-size', "13px");
            }); 
            //XAxis labels
            $("div#dispatchedReservesChart").find("g.highcharts-axis-labels.highcharts-xaxis-labels")
                            .find("text").each(function(i, obj) {
                                        if(i==2){
                                            var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                            var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                            $(obj).attr("transform","translate("+(Number(x)-39)+","+Number(y)+")");
                                        }
            }); 
            dashArraySecWidth = (3*(pointWidth))+2;
            $("div#dispatchedReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 9 "+(dashArraySecWidth-1)+" 1.6 0 12 "+(dashArraySecWidth-1)+" 1.6 0 13"+" "+(dashArraySecWidth/3)+" "+(4+(dashArraySecWidth)));
        }else if($(window).width()>340){
            $("div#dispatchedReservesChart").find("g.highcharts-series.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker ")
                            .find("rect.highcharts-point").each(function(i, obj) {
                                        if(i==2){
                                            $(obj).attr("x",269);
                                        }
            });
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                        var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                        var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                        if(i==2){
                                            $(obj).attr("transform","translate("+(Number(x)-80)+","+Number(y)+")");
                                        }else{
                                            $(obj).attr("transform","translate("+(Number(x)-3)+","+Number(y)+")");
                                        }
            });
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                        var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                        var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                        $(obj).attr("transform","translate("+(Number(x)-3)+","+Number(y)+")");
            }); 
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                            var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                            var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                            $(obj).attr("transform","translate("+(Number(x)-3)+","+Number(y)+")");
            }); 
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                                            $(obj).css('font-size', "13px");
            }); 
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                                            $(obj).css('font-size', "13px");
            }); 
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").find("text").each(function(i, obj) {
                                            $(obj).css('font-size', "13px");
            }); 
            //XAxis labels
            $("div#dispatchedReservesChart").find("g.highcharts-axis-labels.highcharts-xaxis-labels")
                            .find("text").each(function(i, obj) {
                                        if(i==2){
                                            var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                            var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                            $(obj).attr("transform","translate("+(Number(x)-39)+","+Number(y)+")");
                                        }
            }); 
            dashArraySecWidth = (3*(pointWidth))+2;
            $("div#dispatchedReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 8 "+(dashArraySecWidth)+" 1.6 0 10 "+(dashArraySecWidth)+" 1.6 0 11"+" "+(dashArraySecWidth/3)+" "+(4+(dashArraySecWidth)));
        }else{
            $("div#dispatchedReservesChart").find("g.highcharts-series.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker ")
                            .find("rect.highcharts-point").each(function(i, obj) {
                                        if(i==2){
                                            $(obj).attr("x",241);
                                        }
            });
            $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined ").each(function(i, obj) {
                                        if(i==2){
                                            var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                            var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                            $(obj).attr("transform","translate("+(Number(x)-72)+","+Number(y)+")");
                                        }
            });
            //XAxis labels
            $("div#dispatchedReservesChart").find("g.highcharts-axis-labels.highcharts-xaxis-labels")
                            .find("text").each(function(i, obj) {
                                        if(i==2){
                                            var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                            var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                            $(obj).attr("transform","translate("+(Number(x)-34)+","+Number(y)+")");
                                        }
            }); 
            dashArraySecWidth = (3*(pointWidth))+2;
            $("div#dispatchedReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 7 "+(dashArraySecWidth-1)+" 1.6 0 9 "+(dashArraySecWidth-1)+" 1.6 0 9 "+(dashArraySecWidth/3-1)+" "+(4+(dashArraySecWidth)));
            $("div.km-view-title").find("span:nth-child(1)").css("font-size","14px");
        }
        var x = $("div#dispatchedReservesChart").find(".highcharts-legend").attr("transform").split(",")[0].split("(")[1];
        var y = $("div#dispatchedReservesChart").find(".highcharts-legend").attr("transform").split(",")[1].split(")")[0];
        $("div#dispatchedReservesChart").find(".highcharts-legend").attr("transform","translate("+(Number(leftSpace)*3)+","+(Number(y)-10)+")");
    }
}
function constructDispatchedReserversChart(pointWidth,groupPadding){
    Highcharts.setOptions({
        lang: {
          thousandsSep: ','
        }
    });
    
    $('#dispatchedReservesChart').highcharts({
        chart: {
            events: {
                click: function(event){
                }, 
                load: function () {
                    $("path.highcharts-tick").attr('stroke-width', 0);
                    //legend rectangle
                    $("div#dispatchedReservesChart").find("rect.highcharts-point").attr('stroke', '#689D41');
                    $("div#dispatchedReservesChart").find("rect.highcharts-point").attr('stroke-width', '1');
                    
                    var legendText = $("g.highcharts-legend-item text").attr('y');
                    var legendRect = $("g.highcharts-legend-item rect").attr('y');

                    $("div#dispatchedReservesChart").find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined.highcharts-drilldown-data-label")
                            .find("text tspan:nth-child(2)").each(function(i, obj) {
                                         $(obj).attr("x",3);
                                    });
                    $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker ")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                         $(obj).find("text").css({ 'color':'#8B9499','fill':'#8B9499'});
                    });
                    $("div#dispatchedReservesChart").find("g.highcharts-data-labels.highcharts-series-2.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                            .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                         $(obj).find("text").css({ 'color':'#7F8082','fill':'#7F8082'});
                    });
                },
            },
            type: 'column',
            marginLeft:(isTablet == true)?70:15,
            marginRight: (isTablet == true)?-70:-60,
        }, 
        legend: {
            width:$(window).width()>500?($(window).width()-20)/2:$(window).width()-20,
            align:'center',
            paddingBottom: 2,
            margin:30,
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
            text: '<div id="container">'+
                        '<tspan id="dispatched_RTO" onclick="clickDispatchedReservesRegionId(this.id);" style="margin-right:5px;border:1px solid #BCC1C6;background-color:#418CC0;color: black;padding: 3px 10px 3px 10px;' +
                            'border-radius:3px 3px 3px 3px;cursor: pointer;width: 75px;background-clip: padding-box;text-align:center;color:#FFF;">'+
                            '<span style="padding: 16px;">RTO</span>' +
                        '</tspan>'+
                        '<tspan id="dispatched_MAD" onclick="clickDispatchedReservesRegionId(this.id);" style="margin-right:5px;border:1px solid #BCC1C6;background-color: #f8f8f8;color: black;padding: 3px 10px 3px 10px;' +
                            'border-radius:3px 3px 3px 3px;cursor: pointer;width: 72px;background-clip: padding-box;text-align:center;color:#000;">'+
                            '<span style="padding: 16px;">MAD</span>' +
                        '</tspan>'+
                '</div>'
                ,
            useHTML: true,
            style: {
                padding:0,
                margin:0,
                color: '#000000',
                fontFamily: 'HelveticaNeue,sans-serif,Roboto regular',
                fontSize: '16px',
            },
        },
        xAxis: {
            categories: ['<span>Primary</span><br><span>Reserves</span>', '<span>Synchronized</span><br><span>Reserves</span>', '<span>Extended</span><br><span>Requirement</span>'],
            lineColor: 'transparent',
            y: 55,
        },
        subtitle: {
        },
        series:seriesArr ,
        drilldown: {
            activeAxisLabelStyle: {
                textDecoration: 'none',
                color:'#000',
                fontFamily: 'HelveticaNeue,sans-serif,Roboto regular',
                fontSize: '14px',
                fontWeight:'20',
            },
            activeDataLabelStyle: {
                textDecoration: 'none',
                color: "#7D8087", 
                fontFamily: 'HelveticaNeue,sans-serif,Roboto regular',
                fontSize: '12px',
                fontWeight: "bold"
            },
        },
        yAxis:{
            visible:false,
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
                groupPadding: groupPadding,
                events: {
                    legendItemClick: function () {
                            return false;
                    }
            },
            dataLabels:{
                align:'center',
                paddingLeft:0
            }
          }
        }
    });  
}
var dispatchedChartRegionid = 'dispatched_RTO';
function clickDispatchedReservesRegionId(id) {
    try{
         if(dispatchedChartRegionid != id){
            dispatchedChartRegionid = id;   
            if(id == 'dispatched_MAD'){
                dispatchedReserves_type="Mid-Atlantic";
                showDispatchedReserves();
            }else{
                 dispatchedReserves_type="RTO";
                 showDispatchedReserves();
            }
         }
    }catch(e){
    }
    
}
function showDispatchedReserves() {
    try{
        dispatchedReservesChartDispaly(dispatchedReserves_type);
    }catch(e){
    }
}