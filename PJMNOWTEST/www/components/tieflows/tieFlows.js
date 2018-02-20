window.addEventListener("resize", function () {
    if (device.platform == 'android' || device.platform == 'Android') {
        setTimeout(function () {
            loadTieFlowsData();
        }, 1);
    } else {
        loadTieFlowsData();
    }
}, false);
$(document).ready(function () {
    loadTieFlowsData();
    $('#tieFlowsView').addClass('mapdivclr');
});
function tieFlowInit(){
    isMoreClicked = false;
}
function initPullToRefreshScrollerForTie(e) {
    var scroller = e.view.scroller;
    scroller.setOptions({
        pullToRefresh: true,
        messages: {
            pullTemplate: "",
            releaseTemplate: function () {
                $(".km-scroller-pull").remove();
                $("#updatetieFlows").css("display", "block");
                $("#rotatingImgtieFlows").addClass("imgSpan");
            },
            refreshTemplate: function () {
                $(".km-scroller-pull").remove();
                $("#updatetieFlows").css("display", "block");
                $("#rotatingImgtieFlows").addClass("imgSpan");
            }
        },
        pull: function () {
            if ((isiPadPro(device.model) || kendo.support.mobileOS.tablet) && ($(window).width() > $(window).height()) ? 90 : 0 == 90) {
                e.preventDefault();
            } else {
                pullToRefreshForTieFlows();
                $(".km-scroller-pull").remove();
                setTimeout(function () {
                    scroller.pullHandled();
                    $("#updatetieFlows").css("display", "none");
                }, 800);
            }
        },
    })
    scroller.bind("scroll", function (e) {
        if (e.scrollTop < 0) {
            if ((isiPadPro(device.model) || kendo.support.mobileOS.tablet) && ($(window).width() > $(window).height()) ? 90 : 0 == 90) {
                scroller.reset();
                e.preventDefault();
            } else {
                $(".km-scroller-pull").remove();
            }
        } else if (e.scrollTop == 0) {
            $("#updatetieFlows").css("display", "none");
        } else if (e.scrollTop > 0) {
            scroller.reset();
        }
    });
}
function loadTieFlowsData() {
    if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
        showTieFlowsForMobilePortrait();
    } else if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        showTieFlowsForTablate();
    }
}
function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}
function getValue(sch, actl) {
    var result = 0;
    var sign = 1;
    if (sch < 0 && actl < 0) {
        if (!(Math.abs(sch) > Math.abs(actl))) {
            sign = -1;
        }
        result = Math.abs(sch) - Math.abs(actl);
    } else if (sch < 0 && actl >= 0) {
        result = Math.abs(sch) + Math.abs(actl);
        if (actl < 0) {
            sign = -1;
        }
    } else if (sch >= 0 && actl < 0) {
        result = Math.abs(sch) + Math.abs(actl);
        if (actl < 0) {
            sign = -1;
        }
    } else if (sch >= 0 && actl >= 0) {
        if (Math.abs(sch) > Math.abs(actl)) {
            sign = -1;
        }
        result = Math.abs(sch) - Math.abs(actl);
    }
    return sign * Math.abs(result);
}
function constructTieFlowPieChart() {
    (function () {
        function Piechart(paper, cx, cy, r, values, opts) {
            opts = opts || {};
            var chartinst = this,
                sectors = [],
                covers = paper.set(),
                chart = paper.set(),
                series = paper.set(),
                order = [],
                len = values.length,
                angle = opts.startFromFixedAngle || 0,
                total = 0,
                others = 0,
                cut = opts.maxSlices || 100,
                minPercent = parseFloat(opts.minPercent) || 1,
                defcut = Boolean(minPercent);

            function sector(cx, cy, r, startAngle, endAngle, fill) {
                var rad = Math.PI / 180,
                    x1 = cx + r * Math.cos(-startAngle * rad),
                    x2 = cx + r * Math.cos(-endAngle * rad),
                    xm = cx + r / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
                    y1 = cy + r * Math.sin(-startAngle * rad),
                    y2 = cy + r * Math.sin(-endAngle * rad),
                    ym = cy + r / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad),
                    res = [
                    "M", cx, cy,
                    "L", x1, y1,
                    "A", r, r, 0, +(Math.abs(endAngle - startAngle) > 180), 1, x2, y2,
                    "z"
                ];
                res.middle = {
                    x: xm,
                    y: ym
                };
                return res;
            }
            chart.covers = covers;
            if (len == 1) {
                series.push(paper.circle(cx, cy, r).attr({
                    fill: opts.colors && opts.colors[0] || chartinst.colors[0],
                    stroke: opts.stroke || "#fff",
                    "stroke-width": opts.strokewidth == null ? 1 : opts.strokewidth
                }));
                covers.push(paper.circle(cx, cy, r).attr(chartinst.shim));
                total = values[0];
                values[0] = {
                    value: values[0],
                    order: 0,
                    valueOf: function () {
                        return this.value;
                    }
                };
                opts.href && opts.href[0] && covers[0].attr({
                    href: opts.href[0]
                });
                series[0].middle = {
                    x: cx,
                    y: cy
                };
                series[0].mangle = 180;
            } else {
                for (var i = 0; i < len; i++) {
                    total += values[i];
                    values[i] = {
                        value: values[i],
                        order: i,
                        valueOf: function () {
                            return this.value;
                        }
                    };
                }
                //values are sorted numerically
                values.sort(function (a, b) {
                    return b.value - a.value;
                });
                for (i = 0; i < len; i++) {
                    if (defcut && values[i] * 100 / total < minPercent) {
                        cut = i;
                        defcut = false;
                    }
                    if (i > cut) {
                        defcut = false;
                        values[cut].value += values[i];
                        values[cut].others = true;
                        others = values[cut].value;
                    }
                }
                len = Math.min(cut + 1, values.length);
                others && values.splice(len) && (values[cut].others = true);

                for (i = 0; i < len; i++) {
                    var mangle;
                    if (opts.startFromFixedAngle)
                        mangle = angle + 360 * values[i] / total / 2;
                    else {
                        mangle = angle - 360 * values[i] / total / 2;
                        if (!i) {
                            angle = 90 - mangle;
                            mangle = angle - 360 * values[i] / total / 2;
                        }
                        angle = 90 - mangle;
                        mangle = angle - 360 * values[i] / total / 2;
                    }
                    if (opts.init) {
                        var ipath = sector(cx, cy, 1, angle, angle - 360 * values[i] / total).join(",");
                    }
                    var path = sector(cx, cy, r, angle, angle -= 360 * values[i] / total);
                    var j = (opts.matchColors && opts.matchColors == true) ? values[i].order : i;
                    var p = paper.path(opts.init ? ipath : path).attr({
                        fill: opts.colors && opts.colors[j] || chartinst.colors[j] || "#666",
                        stroke: opts.stroke || "#fff",
                        "stroke-width": (opts.strokewidth == null ? 1 : opts.strokewidth),
                        "stroke-linejoin": "round"
                    });
                    p.value = values[i];
                    p.middle = path.middle;
                    p.mangle = mangle;
                    sectors.push(p);
                    series.push(p);
                    opts.init && p.animate({
                        path: path.join(",")
                    }, (+opts.init - 1) || 1000, ">");
                }
                for (i = 0; i < len; i++) {
                    p = paper.path(sectors[i].attr("path")).attr(chartinst.shim);
                    opts.href && opts.href[i] && p.attr({
                        href: opts.href[i]
                    });
                    p.attr = function () {};
                    covers.push(p);
                    series.push(p);
                }
            }
            chart.hover = function (fin, fout) {
                fout = fout || function () {};
                var that = this;
                for (var i = 0; i < len; i++) {
                    (function (sector, cover, j) {
                        var o = {
                            sector: sector,
                            cover: cover,
                            cx: cx,
                            cy: cy,
                            mx: sector.middle.x,
                            my: sector.middle.y,
                            mangle: sector.mangle,
                            r: r,
                            value: values[j],
                            total: total,
                            label: that.labels && that.labels[j]
                        };
                        cover.mouseover(function () {
                            fin.call(o);
                        }).mouseout(function () {
                            fout.call(o);
                        });
                    })(series[i], covers[i], i);
                }
                return this;
            };
            chart.each = function (f) {
                var that = this;
                for (var i = 0; i < len; i++) {
                    (function (sector, cover, j) {
                        var o = {
                            sector: sector,
                            cover: cover,
                            cx: cx,
                            cy: cy,
                            x: sector.middle.x,
                            y: sector.middle.y,
                            mangle: sector.mangle,
                            r: r,
                            value: values[j],
                            total: total,
                            label: that.labels && that.labels[j]
                        };
                        f.call(o);
                    })(series[i], covers[i], i);
                }
                return this;
            };
            chart.click = function (f) {
                var that = this;
                for (var i = 0; i < len; i++) {
                    (function (sector, cover, j) {
                        var o = {
                            sector: sector,
                            cover: cover,
                            cx: cx,
                            cy: cy,
                            mx: sector.middle.x,
                            my: sector.middle.y,
                            mangle: sector.mangle,
                            r: r,
                            value: values[j],
                            total: total,
                            label: that.labels && that.labels[j]
                        };
                        cover.click(function () {
                            f.call(o);
                        });
                    })(series[i], covers[i], i);
                }
                return this;
            };
            chart.inject = function (element) {
                element.insertBefore(covers[0]);
            };
            var legend = function (labels, otherslabel, mark, dir) {
                var x = cx + r + r / 5,
                    y = cy,
                    h = y + 10;

                labels = labels || [];
                dir = (dir && dir.toLowerCase && dir.toLowerCase()) || "east";
                mark = paper[mark && mark.toLowerCase()] || "circle";
                chart.labels = paper.set();

                for (var i = 0; i < len; i++) {
                    var clr = series[i].attr("fill"),
                        j = values[i].order,
                        txt;

                    values[i].others && (labels[j] = otherslabel || "Others");
                    labels[j] = chartinst.labelise(labels[j], values[i], total);
                    chart.labels.push(paper.set());
                    chart.labels[i].push(paper[mark](x + 5, h, 5).attr({
                        fill: clr,
                        stroke: "none"
                    }));
                    chart.labels[i].push(txt = paper.text(x + 20, h, labels[j] || values[j]).attr(chartinst.txtattr).attr({
                        fill: opts.legendcolor || "#000",
                        "text-anchor": "start"
                    }));
                    covers[i].label = chart.labels[i];
                    h += txt.getBBox().height * 1.2;
                }

                var bb = chart.labels.getBBox(),
                    tr = {
                        east: [0, -bb.height / 2],
                        west: [-bb.width - 2 * r - 20, -bb.height / 2],
                        north: [-r - bb.width / 2, -r - bb.height - 10],
                        south: [-r - bb.width / 2, r + 10]
                    }[dir];

                chart.labels.translate.apply(chart.labels, tr);
                chart.push(chart.labels);
            };

            if (opts.legend) {
                legend(opts.legend, opts.legendothers, opts.legendmark, opts.legendpos);
            }

            chart.push(series, covers);
            chart.series = series;
            chart.covers = covers;

            return chart;
        };

        //inheritance
        var F = function () {};
        F.prototype = Raphael.g;
        Piechart.prototype = new F;

        //public
        Raphael.fn.piechart = function (cx, cy, r, values, opts) {
            return new Piechart(this, cx, cy, r, values, opts);
        }

    })();
}
function controlAreasCount() {
    try {
        if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
            window.screen.lockOrientation('portrait');
        }
    } catch (error) {}
    runningPageChange(5);
}
function pullToRefreshForTieFlows() {
    if (isOnline()) {
        tieFlowsData();
    } else {
        networkConnectionCheckingWhileUpdating();
    }
}
function showTieFlowsForMobilePortrait() {
    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    };
    var reqHeight = size.height;
    $('#tieFlowsWhite').css('height', reqHeight);
    $("#graph").html("");
    $("#graph").css("width", size.width);
    $("#graph").css("height", size.height - ((size.height * 6) / 100));
    $("#tableRefreshforAreas").hide();
    var returnValues = getDataForTieFlows();
    var $container = jQuery('#graph');
    highlightcolor = '#FFF68F';

    var pheight = parseInt($container.css('height')),
        pwidth = parseInt($container.css('width')),
        radius = pwidth < pheight ? pwidth / 2 - (pwidth * 5 / 100) : pheight / 2 - (pheight * 5 / 100);
        bgcolor = jQuery('body').css('background-color');

    var paper = Raphael($container[0], pwidth, pheight);
    paper.clear();
    var set = paper.set();
    var pie = set.push(paper.piechart(pwidth / 2, pheight / 2, radius, returnValues.data, {
        stroke: bgcolor,
        strokewidth: 1,
        colors: returnValues.barcolors,
        startFromFixedAngle: 90
    }));
    pie.attr({
        stroke: '#000704',
        "stroke-width": 2
    });
    var centercircle = set.push(paper.circle(pwidth / 2, pheight / 2, radius * 0.38)
        .attr({
            'fill': "#ffffff",
            stroke: '#000704',
            "stroke-width": 2
        }));
    var returnObj = addNetPJMColorForPhone(returnValues,pwidth,pheight,paper);
    $("#graph").css("margin-top", (-1 * size.height * 17 / 100));
    displayEachValueOnTieFlow(pie,returnValues,pwidth,pheight,radius,returnObj,"mobile_portrait");
}
function showTieFlowsForTablate() {
    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    };
    var reqHeight = size.height;
    $('#tieFlowsWhite').css('height', reqHeight);
    $("#pjmData").css("bottom", "initial");
    var screenOrientation = ($(window).width() > $(window).height()) ? 90 : 0;
    if (screenOrientation == 90) {
        showTieFlowsForTablateLandscape(size);
    } 
    else {
	    showTieFlowsForTablatePortrait(size);
    }
}
function getDataForTieFlows(){
    var requireLabel = [];
        requireLabel['NY'] = ['NYIS'];
        requireLabel['NEPT'] = ['SAYR'];
        requireLabel['HTP'] = ['HTP'];
        requireLabel['LIND'] = ['LINDEN'];
        requireLabel['CPLE'] = ['CPLE'];
        requireLabel['DUK'] = ['DUKE'];
        requireLabel['CPLW'] = ['CPLW'];
        requireLabel['TVA'] = ['TVA'];
        requireLabel['LGEE'] = ['LGEE'];
        // requireLabel['OVEC'] = ['OVEC'];
        requireLabel['MISO'] = ['PJM MISO'];
        var data = [];
        var labelValue = [];
        var barcolors = [];
        var origData = [];
        var label = [];
        var actualImports = 0;
        var actualExports = 0;
        var scheduledImports = 0;
        var scheduledExports = 0;
        var netPJMValue = 0;
        var tieData = dbapp.tieData;
        getAllTieFlows(tieData);
        var returnedObject = {};
        $("#lastupdatedTieFlows").html("As of  " + tieData.Tie_Flow_Last_Updated_Date.replace("EDT", "EPT").replace("AM", "a.m.").replace("PM", "p.m.").replace("EST", "EPT"));
        var i = 0;
        var k = 0;
        var t = 0;
        for (var labelIndex in requireLabel) {
            for (var j = 0; j < tieData.tieFlowList.length; j++) {
                var tname = tieData.tieFlowList[j].Name.split(',');
                if (tname[1].search(requireLabel[labelIndex]) > -1 && tname[1] != " MEC") {
                    if (tname[0] == "ACTUAL") {
                        k++;
                        if (tname[1] != " MECS") {
                            if (tieData.tieFlowList[j].Value >= 0) {
                                actualImports = actualImports + tieData.tieFlowList[j].Value
                            } else {
                                actualExports = actualExports + tieData.tieFlowList[j].Value
                            }
                            origData[i] = Math.abs(tieData.tieFlowList[j].Value);
                            label[i] = labelIndex;
                            if (tieData.tieFlowList[j].Value >= 0) {
                                barcolors[i] = '#CADBA5';
                            } else {
                                barcolors[i] = '#C5DCEC';
                            }
                        }
                    } else {
                        t++;
                        if (tname[1] != " MECS") {
                            if (tieData.tieFlowList[j].Value >= 0) {
                                scheduledImports = scheduledImports + tieData.tieFlowList[j].Value
                            } else {
                                scheduledExports = scheduledExports + tieData.tieFlowList[j].Value
                            }
                        }
                    }
                    if (typeof labelValue[labelIndex] === 'undefined') {
                        labelValue[labelIndex] = tieData.tieFlowList[j].Value;
                    } else {
                        labelValue[labelIndex] = getValue(tieData.tieFlowList[j].Value, labelValue[labelIndex]);
                        data[i] = 100;
                    }
                }
            }
            i++;
        }
        netPJMValue = actualImports+actualExports;
        $("#actualImports").html(commaSeparateNumber(actualImports));
        $("#actualExports").html(commaSeparateNumber(-1 * actualExports));
        $("#scheduledImports").html(commaSeparateNumber(scheduledImports));
        $("#scheduledExports").html(commaSeparateNumber(-1 * scheduledExports));
        returnedObject["data"] = data;
        returnedObject["barcolors"] = barcolors;
        returnedObject["netPJMValue"] = netPJMValue;
        returnedObject["origData"] = origData;
        returnedObject["label"] = label;
        return returnedObject;
}
function computeNetTextAndPJMColor(returnValues,returnObj,type){
    var netText = '';
    var netPJMColor;
    if (returnValues.netPJMValue >= 0) {
        netText = 'Into Zone';
        netPJMColor = '#669900';
    } else {
        netText = 'Out of Zone';
        netPJMColor = '#36C';
    }
    var blueTextAttr, greenTextAttr, boldBlueTextAttr, boldGreenTextAttr;
    var textAttrFontSize, boldTextAttrFontSize;
    if(type=="phone"){
        textAttrFontSize = "14pt";
        boldTextAttrFontSize = "15pt";
    }else if(type=="tablate"){
        textAttrFontSize = "23pt";
        boldTextAttrFontSize = "24pt";
    }
    blueTextAttr = {
        'fill': '#1F67C8',
        'font-size': textAttrFontSize,
        "font-family": 'HelveticaNeue,sans-serif,Roboto regular',
        'opacity': 1.0
    };
    greenTextAttr = {
        'fill': '#629920',
        'font-size': textAttrFontSize,
        "font-family": 'HelveticaNeue,sans-serif,Roboto regular',
        'opacity': 1.0
    };
    boldBlueTextAttr = {
        'fill': '#1F67C8',
        'font-size': boldTextAttrFontSize,
        "font-family": 'HelveticaNeue-Bold,sans-serif,Roboto bold',
        'opacity': 1.0
    };
    boldGreenTextAttr = {
        'fill': '#629920',
        'font-size': boldTextAttrFontSize,
        "font-family": 'HelveticaNeue-Bold,sans-serif,Roboto bold',
        'opacity': 1.0
    };
    returnObj["netText"] = netText;
    returnObj["netPJMColor"] = netPJMColor;
    returnObj["bluetextattr"] = blueTextAttr;
    returnObj["greentextattr"] = greenTextAttr;
    returnObj["boldbluetextattr"] = boldBlueTextAttr;
    returnObj["boldgreentextattr"] = boldGreenTextAttr;
    return returnObj;
}
function addNetPJMColorForPhone(returnValues,pwidth,pheight,paper){
    var returnObj = {};
    returnObj = computeNetTextAndPJMColor(returnValues,returnObj,"phone");
    $('.actual').addClass('scheduled_phone');
    $('.actimports').addClass('imports_phone');
    $('.actImportsValue').addClass('schValues_phone');
    paper.text(pwidth / 2, pheight / 2 - 15, 'NET PJM')
        .attr({
            'fill': 'black',
            'font-size': "14pt",
            "font-family": 'HelveticaNeue,sans-serif,Roboto regular',
            'opacity': 1.0
        });
    paper.text(pwidth / 2, pheight / 2 + 9, commaSeparateNumber(Math.abs(returnValues.netPJMValue)))
        .attr({
            'fill': returnObj.netPJMColor,
            'font-size': "24pt",
            "font-family": 'HelveticaNeue-Bold,sans-serif,Roboto bold',
            'opacity': 1.0
        });
    paper.text(pwidth / 2, pheight / 2 + 25, returnObj.netText)
        .attr({
            'fill': 'black',
            'font-size': "12pt",
            "font-family": 'HelveticaNeue,sans-serif,Roboto regular',
            'opacity': 1.0
        });
    return returnObj;
}
function addNetPJMColorForTablet(returnValues,pwidth,pheight,paper){
        var returnObj = {};
        returnObj = computeNetTextAndPJMColor(returnValues,returnObj,"tablate");
        $('.actual').addClass('scheduled_tablet');
        $('.actimports').addClass('imports_tablet');
        $('.actImportsValue').addClass('schValues_tablet');
        paper.text(pwidth / 2, pheight / 2 - 25, 'NET PJM')
            .attr({
                'fill': 'black',
                'font-size': '24.5pt',
                "font-family": 'HelveticaNeue,sans-serif,Roboto regular',
                'opacity': 1.0
            });
        
        paper.text(pwidth / 2, pheight / 2 + 14, commaSeparateNumber(Math.abs(returnValues.netPJMValue)))
            .attr({
                'fill': returnObj.netPJMColor,
                'font-size': "40.49pt",
                "font-family": 'HelveticaNeue-Bold,sans-serif,Roboto bold',
                'opacity': 1.0
            });
        paper.text(pwidth / 2, pheight / 2 + 39, returnObj.netText)
            .attr({
                'fill': 'black',
                'font-size': "21.56pt",
                "font-family": 'HelveticaNeue,sans-serif,Roboto regular',
                'opacity': 1.0
            });
        return returnObj;
}

function getAllTieFlows(tieData){
    if (jQuery.isEmptyObject(tieData)) {
            var deviceuuid = localStorage.getItem("deviceuuId");
            try {
                window.plugins.spinnerDialog.show();
            } catch (error) {
            }
            $.ajax({
                type: "POST",
                async: false,
                url: serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/getAllTieFlows',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Origin': 'file:///'
                },
                data: JSON.stringify({
                    "udid": deviceuuid
                }),
                success: function (data) {
                    dbapp.tieData = data;
                    tieData = dbapp.tieData;
                    dbapp.dropTableTie();
                    dbapp.createTableTie(dbapp.tieData);
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
                    app.navigate("components/zoneLMPMap/zoneLMPMap.html", "slide:right");
                    return;
                }
            });
        }
}
function showTieFlowsForTablateLandscape(size){
    $(".km-ios7 .km-view-title").css("line-height", "1.5em");
        /*Header and Footer changes*/
        $("#tableRefreshforAreas").show();
        $("#netTie").attr("data-title", "Tie Flows");
        $("#lastupdatedTieFlows").show();
        var tieData = dbapp.tieData;
        getAllTieFlows(tieData);
        $("#lastupdatedTieFlows").html("As of  " + tieData.Tie_Flow_Last_Updated_Date.replace("EDT", "EPT").replace("AM", "a.m.").replace("EST", "EPT").replace("PM", "p.m."));
        $("#netTD").show();
        $("#ConMW").css("padding-top", "4px");
        $(".km-ios7 .km-tabstrip .km-button").css("display", "inline-block");
        $(".km-ios7 .km-tabstrip .km-button").css("padding-left", "75px");
        $("#graph").html("");
        $("#graph").css("width", (size.width * 63) / 100);
        $("#graph").css("height", size.height - 200);
        $("#tieFlowsView").css("float", "left");
        $("#pjmData").css("width", (size.width * 63) / 100);
        $("#tablteViewFortieflowValues").show();
        $("#tablteViewFortieflowValues").css("width", (size.width * 36) / 100);
        var returnValues = getDataForTieFlows();
        var $container = jQuery('#graph');
        highlightcolor = '#FFF68F';

    var pheight = parseInt($container.css('height')),
        pwidth = parseInt($container.css('width')),
        radius = pwidth < pheight ? pwidth / 2 - (pwidth * 5 / 100) : pheight / 2 - (pheight * 5 / 100);
        bgcolor = jQuery('body').css('background-color');

    var paper = Raphael($container[0], pwidth, pheight);
    paper.clear();
    var set = paper.set();
    var pie = set.push(paper.piechart(pwidth / 2, pheight / 2, radius, returnValues.data, {
        stroke: bgcolor,
        strokewidth: 1,
        colors: returnValues.barcolors,
        startFromFixedAngle: 90
    }));
    pie.attr({
        stroke: '#000704',
        "stroke-width": 2
    });
    var centercircle = set.push(paper.circle(pwidth / 2, pheight / 2, radius * 0.4)
        .attr({
            'fill': "#ffffff",
            stroke: '#000704',
            "stroke-width": 2
        }));
    constructTieFlowPieChart();
    var returnObj = addNetPJMColorForTablet(returnValues,pwidth,pheight,paper);
    $("#graph").css("margin-top", (-1 * size.height * 2 / 100));
    $("#pjmData").css('margin-top', (-1 * size.height * 5.5 / 100));
    $("#tablteViewFortieflowValues").load("components/controlAreas/TablatecontrolAreas.html");
    
    displayEachValueOnTieFlow(pie,returnValues,pwidth,pheight,radius,returnObj,"tablate_landscape");
        
    $(".km-rightitem .km-button .km-icon.km-rightArrowTieflows").hide();
    setTimeout(function () {
            $(".km-rightitem .km-button .km-icon.km-rightArrowTieflows").hide();
            $("#areasTitle").hide();
            $("#control").hide();
            $("#area").hide();
    }, 5);
    setTimeout(function () {
        $(".km-ios7 .km-view-title").css("line-height", "55px");
        $(".km-widget.km-navbar").css("height", '55px');
    }, 100);
}
function showTieFlowsForTablatePortrait(size){
    setTimeout(function () {
        $(".km-rightitem .km-button .km-icon.km-rightArrowTieflows").show();
        $("#areasTitle").show();
        $("#control").show();
        $("#area").show();
	}, 5);
        $("#tableRefreshforAreas").hide();
        /*Header and footer changes*/
        $("#netTie").attr("data-title", "Tie Flows");
        $("#lastupdatedTieFlows").show();
        $("#netTD").hide();
        $("#ConMW").css("text-align", "left");
        $("#ConMW").css("padding-top", "0px");
        $(".km-ios7 .km-tabstrip .km-button").css("display", "table-cell");
        $(".km-ios7 .km-tabstrip .km-button").css("padding-left", "0px");
        $(".km-ios7 .km-view-title").css("line-height", "2.5em");
        $("#tablteViewFortieflowValues").hide();
        try {
            $("#tieFlowsView").removeAttribute("style");
        } catch (error) {}
        $("#graph").html("");
        $("#graph").css("width", size.width);
        $("#graph").css("height", size.height);
        getAllTieFlows();
        var returnValues = getDataForTieFlows();
        var $container = jQuery('#graph');
       highlightcolor = '#FFF68F';

    var pheight = parseInt($container.css('height')),
        pwidth = parseInt($container.css('width')),
        radius = pwidth < pheight ? pwidth / 2 - (pwidth * 5 / 100) : pheight / 2 - (pheight * 5 / 100);
        bgcolor = jQuery('body').css('background-color');

    var paper = Raphael($container[0], pwidth, pheight);
    paper.clear();
    var set = paper.set();
    var pie = set.push(paper.piechart(pwidth / 2, pheight / 2, radius, returnValues.data, {
        stroke: bgcolor,
        strokewidth: 1,
        colors: returnValues.barcolors,
        startFromFixedAngle: 90
    }));
    pie.attr({
        stroke: '#000704',
        "stroke-width": 2
    });
    var centercircle = set.push(paper.circle(pwidth / 2, pheight / 2, radius * 0.3)
        .attr({
            'fill': "#ffffff",
            stroke: '#000704',
            "stroke-width": 2
        }));
    constructTieFlowPieChart();
    var returnObj = addNetPJMColorForTablet(returnValues,pwidth,pheight,paper);

    $("#graph").css("margin-top", (-1 * size.height * 12 / 100));
    $("#pjmData").css('margin-top', (-1 * size.height * 13 / 100));
    $("#pjmData").css("width", "100%");
    displayEachValueOnTieFlow(pie,returnValues,pwidth,pheight,radius,returnObj,"tablate_portrait");
    $(".km-widget.km-navbar").css("height", 'auto');
}
function displayEachValueOnTieFlow(pie,returnValues,pwidth,pheight,radius,returnObj,type){
    var divisionAngle = 360/10;
    for (var sect = 0; sect <= 9; sect++) {
        var bbox = pie.items[0][0][sect].getBBox();
        var eachAngle = (90-(divisionAngle/2))  - divisionAngle*(sect);
        var tempPieWidth = null, tempPieHeight1 = null, tempPieHeight2 = null, x = null, image = null ;

        if(type == "mobile_portrait"){
            tempPieWidth = (pwidth / 2 + 2) + (radius * 0.61 * Math.cos(eachAngle * (Math.PI) / 180));
            tempPieHeight1 = (pheight / 2) - (2 + radius * 0.61 * Math.sin(eachAngle * (Math.PI) / 180));
            tempPieHeight2 = (pheight / 2) - (-13 + radius * 0.61 * Math.sin(eachAngle * (Math.PI) / 180));
        }else if(type == "tablate_portrait"){
            tempPieWidth = (pwidth / 2) + (radius * 0.62 * Math.cos(eachAngle * (Math.PI) / 180));
            tempPieHeight1 = (pheight / 2) - (2 + radius * 0.62 * Math.sin(eachAngle * (Math.PI) / 180));
            tempPieHeight2 = (pheight / 2) - (-30 + radius * 0.62 * Math.sin(eachAngle * (Math.PI) / 180));
        }
        else if(type == "tablate_landscape"){
            tempPieWidth = (pwidth / 2) + (radius * 0.62 * Math.cos(eachAngle * (Math.PI) / 180));
            tempPieHeight1 = (pheight / 2) - (2 + radius * 0.62 * Math.sin(eachAngle * (Math.PI) / 180));
            tempPieHeight2 = (pheight / 2) - (-20 + radius * 0.62 * Math.sin(eachAngle * (Math.PI) / 180));
        }
        if (returnValues.barcolors[sect] == '#C5DCEC') {
            var textObj = pie.items[0][0][sect].paper.text(tempPieWidth, tempPieHeight1, commaSeparateNumber(returnValues.origData[sect])).attr(returnObj.boldbluetextattr);
                         pie.items[0][0][sect].paper.text(tempPieWidth, tempPieHeight2, returnValues.label[sect]).attr(returnObj.bluetextattr);
            image = "styles/images/blue-arr.png";
        } else {
            var textObj = pie.items[0][0][sect].paper.text(tempPieWidth, tempPieHeight1, commaSeparateNumber(returnValues.origData[sect])).attr(returnObj.boldgreentextattr);
                         pie.items[0][0][sect].paper.text(tempPieWidth, tempPieHeight2, returnValues.label[sect]).attr(returnObj.greentextattr);
            image = "styles/images/green-arr.png";
        }
        if(type == "mobile_portrait"){
            x = pie.items[0][0][sect].paper.image(image,(pwidth / 2 - 20) + (radius * 0.87 * Math.cos(eachAngle * (Math.PI) / 180)),(pheight / 2 - 20) - (radius * 0.87 * Math.sin(eachAngle * (Math.PI) / 180)), 40, 40);
        }else if(type == "tablate_portrait"){
            x = pie.items[0][0][sect].paper.image(image,(pwidth / 2 - 40) + (radius * 0.87 * Math.cos(eachAngle * (Math.PI) / 180)),(pheight / 2 - 40) - (radius * 0.87 * Math.sin(eachAngle * (Math.PI) / 180)), 80, 80);
        }else if(type == "tablate_landscape"){
            x = pie.items[0][0][sect].paper.image(image, (pwidth / 2 - 30) + (radius * 0.87 * Math.cos(eachAngle * (Math.PI) / 180)), (pheight / 2 - 30) - (radius * 0.87 * Math.sin(eachAngle * (Math.PI) / 180)), 60, 60);
        }
        x.rotate( (90 + (divisionAngle/2))  + divisionAngle*(sect));
        $("#tieFlowsView tspan").attr("dy", "0");
    }
}