var operationalReserves_type = "RTO";
var dataValues ={};

function operationalReservesInit(){
    $('.km-leftitem').css('margin-left', '0%');
    showOperationalReserves();
}


function pullToRefreshForOperationalReserves(){
    if (isOnline()) {
        operationalData();
    } else {
        networkConnectionCheckingWhileUpdating();
    }
}

function initPullToRefreshScrollerForOperationalReserves(e) {
    var scroller = e.view.scroller;
    scroller.setOptions({
        pullToRefresh: true,
        messages: {
            pullTemplate: "",
            releaseTemplate: function () {
                $(".km-scroller-pull").remove();
                $("#updateOperationalReserves").css("display", "block");
                $("#rotatingImgOperationalReserves").addClass("imgSpan");
            },
            refreshTemplate: function () {
                $(".km-scroller-pull").remove();
                $("#updateOperationalReserves").css("display", "block");
                $("#rotatingImgOperationalReserves").addClass("imgSpan");
            }
        },
        pull: function () {
            if (isiPadPro(device.model) || kendo.support.mobileOS.tablet && ($(window).width() > $(window).height()) ? 90 : 0 == 90) {
                e.preventDefault();
            } else {
                pullToRefreshForOperationalReserves();
                $(".km-scroller-pull").remove();
                setTimeout(function () {
                    scroller.pullHandled();
                    $("#updateOperationalReserves").css("display", "none");
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
            $("#updateOperationalReserves").css("display", "none");
        } else if (e.scrollTop > 0) {
            scroller.reset();
        }
    });
}

function operationalReservesChartDisplay(titleName){
    operationalReserves_type = titleName;
    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    }
    seriesArr = [];
        try{
            if(!jQuery.isEmptyObject(dbapp.operationalReservesData)){
                var operationalReservesGraphData;
                if (titleName == "RTO") {
                    operationalReservesGraphData = dbapp.operationalReservesData.opeartionalReservesRTO;
                } else if (titleName == "Mid-Atlantic") {
                    operationalReservesGraphData = dbapp.operationalReservesData.opeartionalReservesMAD;
                } else if (titleName == "Dominion") {
                    operationalReservesGraphData = dbapp.operationalReservesData.opeartionalReservesDOM;
                } 
                var newestUpdatedDate = dbapp.operationalReservesData.updatedTimestamp;
                $("#lastOperationalReservesUpdatedDate").html("As of " + newestUpdatedDate.replace("EDT", "EPT").replace("AM", "a.m.").replace("EST", "EPT").replace("PM", "p.m."));
                var actualDataArr = [];
                var reliabilityDataArr = [];
                reliabilityDataArr[0]=null;
                operationalReservesGraphData.forEach(function (object) {
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
                seriesArr.push(actualObj);
                seriesArr.push(reliabilityObj);  
            }
        }catch(e){}
        Highcharts.Axis.prototype.init = (function (func) {
            return function (chart, userOptions) {
                func.apply(this, arguments);
                if (this.categories) {
                    this.userCategories = this.categories;
                    this.categories = undefined;
                    this.labelFormatter = function () {
                        this.axis.options.labels.align = (this.value == 0) ? "left" : ((this.value == this.axis.max) ? "center" : "center");
                        return this.axis.userCategories[this.value];
                    }
                }
            };
        } (Highcharts.Axis.prototype.init));
        var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
        $("#operationalReservesChart").css("width", size.width - 10);
        var pointWidth = size.width/10;
        var groupPadding = 0;
        if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
            if($(window).width()>1000){
                groupPadding = 0.182;
            }else if($(window).width()>700){
                groupPadding = 0.175;
            }else{
                groupPadding = 0.205;
            }
            pointWidth = pointWidth-1.025;
        }else {
            if($(window).width()>400){
                groupPadding = 0.1335;
            }else if($(window).width()>340){
                groupPadding = 0.1225;
            }else{
                groupPadding = 0.112;
            }    
            pointWidth = pointWidth+1.5;
        }
        if (screenOrientation == 90) {
            showOperationalReserves_landscape();
        } else {
            $("#operationalReservesChart").css("height", size.height - 140);
            constructOperationalReserversChart(pointWidth,groupPadding,titleName);
            portraitOperationalReserversChartUpdate(pointWidth,titleName);
        }
        if(titleName == 'Mid-Atlantic'){
            $('tspan#operational_RTO').css('background-color', "#f8f8f8");
            $('tspan#operational_RTO').css('color', "#000");
            $('tspan#operational_DOM').css('background-color', "#f8f8f8");
            $('tspan#operational_DOM').css('color', "#000");
            $('tspan#operational_MAD').css('background-color', "#418CC0");
            $('tspan#operational_MAD').css('color', "#FFF");
        }else if(titleName == 'Dominion'){
            $('tspan#operational_RTO').css('background-color', "#f8f8f8");
            $('tspan#operational_RTO').css('color', "#000");
            $('tspan#operational_MAD').css('background-color', "#f8f8f8");
            $('tspan#operational_MAD').css('color', "#000");
            $('tspan#operational_DOM').css('background-color', "#418CC0");
            $('tspan#operational_DOM').css('color', "#FFF");
        }else{
            $('tspan#operational_MAD').css('background-color', "#f8f8f8");
            $('tspan#operational_MAD').css('color', "#000");
            $('tspan#operational_DOM').css('background-color', "#f8f8f8");
            $('tspan#operational_DOM').css('color', "#000");
            $('tspan#operational_RTO').css('background-color', "#418CC0");
            $('tspan#operational_RTO').css('color', "#FFF");
        }
}

function portraitOperationalReserversChartUpdate(pointWidth,titleName){
    $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke', '#689D41');
    if (isiPadPro(device.model) ||  kendo.support.mobileOS.tablet) {
            var dashArraySecWidth = (2*pointWidth)+1;
            $("div#operationalReservesChart").find("g.highcharts-series.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("rect.highcharts-point").each(function(i, obj) {
                               if(i==0){
                                    $(obj).attr("x",115);
                                }
                                if(titleName == "Dominion" && i==2){
                                    $(obj).attr("x",528);
                                }
            });
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").find("text").each(function(i, obj) {
                                $(obj).css('font-size', "18px");
            });
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").find("text").each(function(i, obj) {
                                $(obj).css('font-size', "18px");
            });
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                if(i==0){
                                    $(obj).attr("transform","translate("+(Number(x)+59)+","+Number(y)+")");
                                }else{
                                    $(obj).attr("transform","translate("+(Number(x)-9)+","+Number(y)+")");
                                }
                                if(titleName == "Dominion" && i==2){
                                    $(obj).attr("transform","translate("+(Number(x)+5)+","+Number(y)+")");
                                }
            });
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                $(obj).attr("transform","translate("+(Number(x)-9)+","+Number(y)+")");

            });
            //xaxis labels
            $("div#operationalReservesChart").find("g.highcharts-axis-labels.highcharts-xaxis-labels")
                        .find("text").each(function(i, obj) {
                                if(i==0){
                                    var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                    var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                    $(obj).attr("transform","translate("+(Number(x)+30)+","+Number(y)+")");
                                }
                                if(titleName == "Dominion" && i==2){
                                    var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                    var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                    $(obj).attr("transform","translate("+(Number(x)-30)+","+Number(y)+")");
                                }
            });
            if(titleName == "Dominion"){
                $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 "+(38.5+(dashArraySecWidth/2))+" "+(dashArraySecWidth/2)+" 15 0 "+(dashArraySecWidth/2)+" "+dashArraySecWidth+" 17 0 "+((dashArraySecWidth/2))+" "+(dashArraySecWidth/2)+" 44");
            }else{
                $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 "+(38.5+(dashArraySecWidth/2))+" "+(dashArraySecWidth/2)+" 10 0 "+(dashArraySecWidth/2)+" "+dashArraySecWidth+" 8 0 72 "+dashArraySecWidth+" 44");
            }
    }else{
        var dashArraySecWidth = (2*pointWidth)+1;
        if($(window).width()>400){
            dashArraySecWidth = (2*pointWidth)+1.5;
            //bars
            $("div#operationalReservesChart").find("g.highcharts-series.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("rect.highcharts-point").each(function(i, obj) {
                                if(i==0){
                                        $(obj).attr("x",57);
                                }
                                if(titleName == "Dominion" && i==2){
                                    $(obj).attr("x",258);
                                }
            });
            //label  font size
             $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").find("text").each(function(i, obj) {
                                $(obj).css('font-size', "14px");
            });
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").find("text").each(function(i, obj) {
                                $(obj).css('font-size', "14px");
            });
             //label numbers 
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                if(i==0){
                                    $(obj).attr("transform","translate("+(Number(x)+35)+","+Number(y)+")");
                                }else{
                                    $(obj).attr("transform","translate("+(Number(x)-3)+","+Number(y)+")");
                                }
                                if(titleName == "Dominion" && i==2){
                                    $(obj).attr("transform","translate("+(Number(x))+","+Number(y)+")");
                                }
            }); 
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                $(obj).attr("transform","translate("+(Number(x)-3)+","+Number(y)+")");

            });
            //xaxis labels
            $("div#operationalReservesChart").find("g.highcharts-axis-labels.highcharts-xaxis-labels")
                        .find("text").each(function(i, obj) {
                                if(i==0){
                                    var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                    var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                    $(obj).attr("transform","translate("+(Number(x)+19)+","+Number(y)+")");
                                }
                                if(titleName == "Dominion" && i==2){
                                    var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                    var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                    $(obj).attr("transform","translate("+(Number(x)-19)+","+Number(y)+")");
                                }
            });
            if(titleName == "Dominion"){
                $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 "+(35+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2-1)+" "+((dashArraySecWidth/4))+" 0 16.6 "+(dashArraySecWidth)+" 6 0 "+(5+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2)+" "+(6+                       (dashArraySecWidth/4)));
            }else{
                $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 "+(35+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2-1)+" "+((dashArraySecWidth/4))+" 0 11.6 "+(dashArraySecWidth)+" 6 0 23 "+(dashArraySecWidth-1)+" 5.5");
            }
        }else if($(window).width()>370){
            $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 9 "+dashArraySecWidth+" 6");
             //bars
            $("div#operationalReservesChart").find("g.highcharts-series.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("rect.highcharts-point").each(function(i, obj) {
                                if(i==0){
                                        $(obj).attr("x",54);
                                }
                                if(titleName == "Dominion" && i==2){
                                    $(obj).attr("x",230);
                                }
            });
            //label font 
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").find("text").each(function(i, obj) {
                                $(obj).css('font-size', "13px");
            });
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").find("text").each(function(i, obj) {
                                $(obj).css('font-size', "13px");
            });
            //label numbers 
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                            var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                            var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                if(i==0){
                                    $(obj).attr("transform","translate("+(Number(x)+36)+","+Number(y)+")");
                                }else{
                                    $(obj).attr("transform","translate("+(Number(x)-2)+","+Number(y)+")");
                                }
                                if(titleName == "Dominion" && i==2){
                                    $(obj).attr("transform","translate("+(Number(x))+","+Number(y)+")");
                                }
            });
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                $(obj).attr("transform","translate("+(Number(x)-2)+","+Number(y)+")");

            });
            //xaxis labels
            $("div#operationalReservesChart").find("g.highcharts-axis-labels.highcharts-xaxis-labels")
                        .find("text").each(function(i, obj) {
                                if(i==0){
                                    var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                    var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                    $(obj).attr("transform","translate("+(Number(x)+19)+","+Number(y)+")");
                                }
                                if(titleName == "Dominion" && i==2){
                                    var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                    var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                    $(obj).attr("transform","translate("+(Number(x)-19)+","+Number(y)+")");
                                }
            }); 
            if(titleName == "Dominion"){
                $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 "+(34+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2)+" "+(4+(dashArraySecWidth/4))+" 0 5 "+(dashArraySecWidth+1)+" 6 0 "+(2+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2)+" "+(6+                       (dashArraySecWidth/4)));
            }else{
                $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 "+(34+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2)+" "+(4+(dashArraySecWidth/4))+" 0 0 "+(dashArraySecWidth+1)+" 6 0 18 "+(dashArraySecWidth)+" 5.5");
            }
        }else if($(window).width()>340){
            $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 9 "+dashArraySecWidth+" 6");
             //bars
            $("div#operationalReservesChart").find("g.highcharts-series.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("rect.highcharts-point").each(function(i, obj) {
                                if(i==0){
                                        $(obj).attr("x",54);
                                }
                                if(titleName == "Dominion" && i==2){
                                    $(obj).attr("x",220.5);
                                }
            });
            //label font 
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").find("text").each(function(i, obj) {
                                $(obj).css('font-size', "13px");
            });
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").find("text").each(function(i, obj) {
                                $(obj).css('font-size', "13px");
            });
            //label numbers 
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                if(i==0){
                                    $(obj).attr("transform","translate("+(Number(x)+36)+","+Number(y)+")");
                                }else{
                                    $(obj).attr("transform","translate("+(Number(x)-3)+","+Number(y)+")");
                                }
                                if(titleName == "Dominion" && i==2){
                                    $(obj).attr("transform","translate("+(Number(x))+","+Number(y)+")");
                                }
            });
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                $(obj).attr("transform","translate("+(Number(x)-2)+","+Number(y)+")");

            });
            //xaxis labels
            $("div#operationalReservesChart").find("g.highcharts-axis-labels.highcharts-xaxis-labels")
                        .find("text").each(function(i, obj) {
                                if(i==0){
                                    var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                    var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                    $(obj).attr("transform","translate("+(Number(x)+19)+","+Number(y)+")");
                                }
                                if(titleName == "Dominion" && i==2){
                                    var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                    var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                    $(obj).attr("transform","translate("+(Number(x)-19)+","+Number(y)+")");
                                }
            }); 
            if(titleName == "Dominion"){
                $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 "+(35+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2)+" "+((dashArraySecWidth/4))+" 0 5 "+(dashArraySecWidth+1)+" 6 0 "+(2+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2)+" "+(6+                       (dashArraySecWidth/4)));
            }else{
                $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 "+(34.5+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2)+" "+((dashArraySecWidth/4))+" 0 1.5 "+(dashArraySecWidth-1)+" 6 0 17 "+(dashArraySecWidth)+" 5.5");
            }
        }else{
            $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 9 "+dashArraySecWidth+" 6");
             //bars
            $("div#operationalReservesChart").find("g.highcharts-series.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("rect.highcharts-point").each(function(i, obj) {
                                if(i==0){
                                        $(obj).attr("x",42);
                                }
                                if(titleName == "Dominion" && i==2){
                                    $(obj).attr("x",194.5);
                                }
            });
            //label numbers 
            $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-0.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                        .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                if(i==0){
                                    var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                    var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                    $(obj).attr("transform","translate("+(Number(x)+31)+","+Number(y)+")");
                                }
                                 if(titleName == "Dominion" && i==2){
                                    var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                    var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                    $(obj).attr("transform","translate("+(Number(x))+","+Number(y)+")");
                                 }
            }); 
            //xaxis labels
            $("div#operationalReservesChart").find("g.highcharts-axis-labels.highcharts-xaxis-labels")
                        .find("text").each(function(i, obj) {
                                if(i==0){
                                    var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                    var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                    $(obj).attr("transform","translate("+(Number(x)+14)+","+Number(y)+")");
                                }
                                if(titleName == "Dominion" && i==2){
                                    var x = $(obj).attr("transform").split(",")[0].split("(")[1];
                                    var y = $(obj).attr("transform").split(",")[1].split(")")[0];
                                    $(obj).attr("transform","translate("+(Number(x)-10)+","+Number(y)+")");
                                }
            }); 
            if(titleName == "Dominion"){
                $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 "+(25+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2)+" "+((dashArraySecWidth/4))+" 0 7 "+(dashArraySecWidth+1)+" 6 0 "+(2+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2)+" "+(6+                       (dashArraySecWidth/4)));
            }else{
                $("div#operationalReservesChart").find("path.highcharts-axis-line").attr('stroke-dasharray',"0 "+(25+(dashArraySecWidth/4))+" "+(dashArraySecWidth/2)+" "+((dashArraySecWidth/4))+" 0 3.5 "+(dashArraySecWidth-2)+" 6 0 13 "+(dashArraySecWidth-1)+" 5.5");
            }
            $("div.km-view-title").find("span:nth-child(1)").css("font-size","14px");
        }
    }
    setTimeout(function(){
        var x = $("div#operationalReservesChart").find(".highcharts-legend").attr("transform").split(",")[0].split("(")[1];
        var y = $("div#operationalReservesChart").find(".highcharts-legend").attr("transform").split(",")[1].split(")")[0];
        $("div#operationalReservesChart").find(".highcharts-legend").attr("transform","translate("+Number(x)+","+(Number(y)-10)+")");
    },50);
}

function constructOperationalReserversChart(pointWidth,groupPadding,titleName){
    Highcharts.setOptions({
        lang: {
          thousandsSep: ','
        }
    });
    $('#operationalReservesChart').highcharts({
        chart: {
            events: {
                click: function(event){
                }, 
                
                load: function () {
                    $("path.highcharts-tick").attr('stroke-width', 0);
                    //legend rectangle
                    $("div#operationalReservesChart").find("rect.highcharts-point").attr('stroke', '#689D41');
                    $("div#operationalReservesChart").find("rect.highcharts-point").attr('stroke-width', '1');

                    //label colors
                    $("div#operationalReservesChart").find("g.highcharts-data-labels.highcharts-series-1.highcharts-column-series.highcharts-color-undefined.highcharts-tracker")
                                .find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").each(function(i, obj) {
                                        $(obj).find("text").css({ 'color':'#8B9499','fill':'#8B9499'});
                    });
                    var legendText = $("g.highcharts-legend-item text").attr('y');
                    var legendRect = $("g.highcharts-legend-item rect").attr('y');
                    $("div#operationalReservesChart").find("g.highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined.highcharts-drilldown-data-label")
                                .find("text tspan:nth-child(2)").each(function(i, obj) {
                                        $(obj).attr("x",3);
                    });
                },
            },
            type: 'column',
            marginLeft: (titleName == "Dominion")?20:5,
            marginRight: (titleName == "Dominion")?20:45,
        }, 
        legend: {
            paddingBottom: 2,
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
            text: '<div id="container">'+
                        '<tspan id="operational_RTO" onclick="clickOperationalReservesRegionId(this.id);" style="margin-right:5px;border:1px solid #BCC1C6;background-color:#418CC0;padding: 3px 10px 3px 10px;' +
                            'border-radius:3px 3px 3px 3px;cursor: pointer;width: 75px;background-clip: padding-box;text-align:center;color:white;">'+
                            '<span style="padding: 16px;">RTO</span>' +
                        '</tspan>'+
                        '<tspan id="operational_MAD" onclick="clickOperationalReservesRegionId(this.id);" style="margin-right:5px;border:1px solid #BCC1C6;padding: 3px 10px 3px 10px;' +
                            'border-radius:3px 3px 3px 3px;cursor: pointer;width: 72px;background-clip: padding-box;">'+
                            '<span style="padding: 16px;">MAD</span>' +
                        '</tspan>'+
                        '<tspan id="operational_DOM" onclick="clickOperationalReservesRegionId(this.id);" style="border:1px solid #BCC1C6;padding: 3px 10px 3px 10px;' +
                            'border-radius:3px 3px 3px 3px;cursor: pointer;width: 72px;background-clip: padding-box;">'+
                            '<span style="padding: 16px;">DOM</span>' +
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
            categories: ['<span>Operating</span><br><span>Reserves</span>', '<span>Primary</span><br><span>Reserves</span>', '<span>Synchronized</span><br><span>Reserves</span>'],
            lineColor: 'transparent',
            y: 55,
        },
        subtitle: {
        },
        series:seriesArr,
        drilldown: {
            activeAxisLabelStyle: {
                textDecoration: 'none',
                color:'#000',
                fontFamily: 'HelveticaNeue,sans-serif,Roboto regular',
                fontSize: '12px',
                fontWeight:'20'
            },
            activeDataLabelStyle: {
                textDecoration: 'none',
                color: "#7D8087", 
                fontFamily: 'HelveticaNeue,sans-serif,Roboto regular',
                fontSize: '12px',
                fontWeight: "bold",
            },
        },
        yAxis:{
            visible:false,
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
                    inside: false,
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

var operationalChartRegionid = 'operational_RTO';
function clickOperationalReservesRegionId(id) {
    try{
        if(operationalChartRegionid != id){
            operationalChartRegionid = id;
            if(id == 'operational_MAD'){
                operationalReserves_type="Mid-Atlantic";
                showOperationalReserves();
            }else if(id == 'operational_DOM'){
                operationalReserves_type="Dominion";
                showOperationalReserves();
            }else{
                operationalReserves_type="RTO";
                showOperationalReserves();
            }
        }
    }catch(e){
    }
}

function showOperationalReserves() {
    try{
        operationalReservesChartDisplay(operationalReserves_type);
    }catch(e){
    }
}