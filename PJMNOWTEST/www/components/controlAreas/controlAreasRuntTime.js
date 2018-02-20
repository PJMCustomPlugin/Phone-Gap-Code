var isControlAreasSaved = true;
var sortableTouched = false;
var sorting = false;
var areasIneditmode = false;
var actualValues = [];
var scheduledValues = [];
var areasToScroll = true;

function loadControlAreas() {
    areasToScroll = true;
    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    }
    var headerHeight = $('.km-header').height();
    var footerHeight = $('.km-footer').height();
    var tieData = dbapp.tieData; 
    actualValues = [];
    scheduledValues = [];
    for (var j = 0; j < tieData.tieFlowList.length; j++) {
        var tname = tieData.tieFlowList[j].Name.split(',');
        var valueResult = tieData.tieFlowList[j].Value;
        var orignalName = String(tname[1]);
        var tieFlowNameAndValueObject = {
                    "key": orignalName,
                    "value": valueResult
                };
        if(orignalName != " MECS"){
            if (tname[0] == 'ACTUAL')
                actualValues.push(tieFlowNameAndValueObject);
            else if (tname[0] == 'SCHEDULED')
                scheduledValues.push(tieFlowNameAndValueObject);
        }
    }
    var arrangingDifferences = "";
    var sortableControlAreasList = localStorage.getItem('sortableControlAreas');
    if (jQuery.isEmptyObject(sortableControlAreasList)) {
        arrangingDifferences = getActualValues(true,null,arrangingDifferences);
    } else {
        var tempControlAreasArray = JSON.parse(sortableControlAreasList);
        for (var l = 0; l < tempControlAreasArray.length; l++) {
            arrangingDifferences =  getActualValues(false,tempControlAreasArray[l].area,arrangingDifferences);
        }
    }
    setTimeout(function () {
        var mainContainer_portrait = document.getElementById("sortableAreas");
        mainContainer_portrait.innerHTML = arrangingDifferences;
        $("#lastUpdatedTieFlowsDate").html("As of  " + tieData.Tie_Flow_Last_Updated_Date.replace("EDT", "EPT").replace("AM", "a.m.").replace("PM", "p.m.").replace("EST", "EPT"));
        if (headerHeight == 0) {
            headerHeight = 46;
        }
        if (footerHeight == 0) {
            footerHeight = 56;
        }
        var listHeight = size.height - headerHeight - footerHeight - 78;
        $(".sortableAreasList").css('height', listHeight - 5);
        if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
            doneOrEditButtonCSSForTablet(listHeight);
        } else {
            doneOrEditButtonCSSForPhone(listHeight);
        }
        var reqHeight = size.height - headerHeight - footerHeight;
        $('#controlAreasWhite').css('height', reqHeight);
        $(".reorderingAreas").bind('touchstart', function (event) {
            $("#sortableAreas li").css("border-top", "1px solid #BCC1C6");
            areasToScroll = false;
        });
        $(".reorderingAreas").bind('touchend', function (event) {
            $("#sortableAreas li").css("border-top", "0px solid #BCC1C6");
            areasToScroll = true;
        });
    }, 200);
}
loadControlAreas();
function backtoNetDeviation() {
    if (!isControlAreasSaved) {
        $("#sortableAreas").sortable("cancel");
    }
    $('.reorderingAreas').hide();
    $('#areasDonebtn').hide();
    $('#areasEditbtn').show();
    $("#sortableAreas").sortable({
        disabled: true
    });
}
var $areasstate = $('#updateImg_Areas');
$(document).ready(function () {
    setTimeout(function () {
        $('.reorderingAreas').hide();
        $("#areasDonebtn").hide();
        var lastY;
        var currentY;
        $('#sortableAreas').bind('touchstart', function (e) {
            if (areasToScroll) {
                var currentY = e.originalEvent.touches[0].clientY;
                lastY = currentY;
                e.preventDefault();
            }
        });
        $('#sortableAreas').bind('touchmove', function (e) {
            if (areasToScroll) {
                var currentY = e.originalEvent.touches[0].clientY;
                delta = currentY - lastY;
                if (delta > 0) {
                    sorting = true;
                }
                if (this.scrollTop == 0 && delta > 0) {
                    sorting = false;
                } else {
                    sortableTouched = true;
                    this.scrollTop += delta * -1;
                    lastY = currentY;
                }
            }
        });
        $('#sortableAreas').bind('touchend', function (e) {
            sortableTouched = false;
        });
        var size = {
            width: window.innerWidth || document.body.clientWidth,
            height: window.innerHeight || document.body.clientHeight
        }
        $('.clearWhite').addClass('mapdivclr');
        var isAreasrefreshed = false;
        $("#areasEditbtn").click(function () {
            editButtonClicked();
        });
        $('#areasDonebtn').click(function () {
            doneButtonClicked();
        });
    }, 200);
});
function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}
function getActualValues(isUndefined,tempTieflowValue,arrangingdifferences){
    for (var i = 0; i < actualValues.length; i++) {
        if (isUndefined || tempTieflowValue == actualValues[i].key) {
            var areaKey = actualValues[i].key;
            var tempKey = actualValues[i].key;
            if (areaKey.trim() == "SAYR")
                areaKey = 'NEPT';
            else if (areaKey.trim() == 'HTP')
                areaKey = 'HTP'
            else if (areaKey.trim() == 'LINDEN')
                areaKey = 'LIND'
            else if (areaKey.trim() == 'NYIS')
                 areaKey = 'NY'
            else if (areaKey.trim() == 'CPLE')
                areaKey = 'CPLE'
            else if (areaKey.trim() == 'DUKE')
                areaKey = 'DUK'
            else if (areaKey.trim() == 'CPLW')
                areaKey = 'CPLW'
            else if (areaKey.trim() == 'TVA')
                areaKey = 'TVA'
            else if (areaKey.trim() == 'LGEE')
                areaKey = 'LGEE'
            // else if (areaKey.trim() == 'OVEC')
            //     areaKey = 'OVEC'
            else if (areaKey.trim() == 'MECS')
                areaKey = 'MECS'
            else if (areaKey.trim() == 'PJM MISO')
                areaKey = 'MISO'
            else {
                 continue;
            }
            var value = actualValues[i].value;
            var scheduledValued = 0;
            for (var k = 0; k < scheduledValues.length; k++) {
                if (tempKey == scheduledValues[k].key) {
                    scheduledValued = scheduledValues[k].value;
                    break;
                }
            }
            var actualValue = value >= 0 ? "<img src='styles/images/green-arr.png' width='22px' height='23px'>"+
                                         "<div style='color:#659800;font-family: HelveticaNeue-Bold;font-size:13pt;'>" + commaSeparateNumber(value) + "</div>" :
                                         "<img src='styles/images/blue-arr.png' width='22px' height='23px'>"+
                                         "<div style='color:#3366CC;font-family: HelveticaNeue-Bold;font-size:13pt;'>" + commaSeparateNumber((-value)) + "</div>";

            var scheduledvalue = scheduledValued >= 0 ? "<img src='styles/images/green-arr.png' width='22px' height='23px'>"+
                                                     "<div style='color:#659800;font-family: HelveticaNeue-Bold;font-size:13pt;'>" + commaSeparateNumber(scheduledValued) + "</div>" :
                                                     "<img src='styles/images/blue-arr.png' width='22px' height='23px'>"+
                                                     "<div style='color:#3366CC;font-family: HelveticaNeue-Bold;font-size:13pt;'>" + commaSeparateNumber((-scheduledValued)) + "</div>";

            var loopFlow = value - scheduledValued >= 0 ? "<img src='styles/images/green-arr.png' width='22px' height='23px'>"+
                                                      "<div style='color:#659800;font-family: HelveticaNeue-Bold;font-size:13pt;'>" + commaSeparateNumber((value - scheduledValued)) + "</div>" :
                                                      "<img src='styles/images/blue-arr.png' width='22px' height='23px'>"+
                                                      "<div style='color:#3366CC;font-family: HelveticaNeue-Bold;font-size:13pt;'>" + commaSeparateNumber((-(value - scheduledValued))) + "</div>";

            arrangingdifferences = arrangingdifferences +"<li id='" + i + "'>" + 
                                                      "<div style='width:20%;float:left;padding-left:8px;font-family: HelveticaNeue-Light;font-size:16pt;margin-top:-5px;' class='area'>" + areaKey + "</div>" + 
                                                      "<div class='setWidth actualValueDiv'>" + actualValue + "</div>" + 
                                                      "<div class='setWidth scheduledValueDiv'>" + scheduledvalue + "</div>" + 
                                                      "<div class='setWidth loopflowValueDiv'>" + loopFlow + "</div>" + 
                                                      "<img style='display:none' src='styles/images/Reorder_Icon.png' class='reorderingAreas'>" +
                                                      "</li>";
        }
    }
    return arrangingdifferences;
}
function editButtonClicked(){
    $(".sortableAreaswidthClass").css("width","100%");
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        $('.setWidth').css('width', '25%');
        $('.actualValueDiv').css('padding-left', '0');
        $('.scheduledValueDiv').css('padding-left', '0');
        $('.loopflowValueDiv').css('width', '22%');
        $('.loopflowValueDiv').css('padding-left', '4.75%');
        $('.setWidth_loop').css('margin-left', '0%');
        $('.reorderingAreas').css("width",'38px');
        $('.reorderingAreas').css("margin-right",'2%');
    } else {
        $('.actualValueDiv').css('width', '22%');
        $('.scheduledValueDiv').css('width', '26%');
        $('.loopflowValueDiv').css('width', '21%');
        $('.actualValueDiv').css('padding-left', '2.6%');
        $('.scheduledValueDiv').css('padding-left', '4.7%');
        $('.loopflowValueDiv').css('padding-left', '2.5%');
        $('.reorderingAreas').css("width",'7%');
        $('.reorderingAreas').css("margin-right",'3%');
    }
    areasIneditmode = true;
    $('.reorderingAreas').show();
    $('.reorderingAreas').css("float",'right');
    $('.reorderingAreas').css("margin-left",'1%');
    $('#areasEditbtn').hide();
    $('.PJM-RTO-vertical-text').hide();
    $('#areasDonebtn').show();
    $("#sortableAreas").sortable({
        scroll: true,
        scrollSensitivity: 1,
        axis: 'y',
        containment: "parent",
        handle: '.reorderingAreas',
        disabled: false,
        start: function (event, ui) {
            sortableTouched = true;
            sorting = true;
            isControlAreasSaved = false;
        },
        stop: function (event, ui) {
            sorting = false;
            sortableTouched = false;
        },
        sort: function (e, ui) {
            sorting = true;
            var container = $(this);
            sortMethod(container,ui);
        },
    }).disableSelection();
}
function doneButtonClicked(){
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        $('.setWidth').css('width', '25%');
        $('.loopflowValueDiv').css('width', '22%');
        $('.actualValueDiv').css('padding-left', '2.7%');
        $('.scheduledValueDiv').css('padding-left', '4.8%');
        $('.loopflowValueDiv').css('padding-left', '11.7%');
        $('.setWidth_loop').css('margin-left', '0%');
    } else {
        $('.setWidth_actual').css('width', '25%');
        $('.setWidth_scheduled').css('width', '23%');
        $('.setWidth_loop').css('width', '26%');
        $('.setWidth_scheduled').css('padding-left', '0%');
        $('.setWidth').css('width', '25%');
        $('.actualValueDiv').css('padding-left', '2.3%');
        $('.scheduledValueDiv').css('padding-left', '4.5%');
        $('.loopflowValueDiv').css('padding-left', '1.2%');
    }
    var sortableControlAreas = [];
    isControlAreasSaved = true;
    areasIneditmode = false;
    $(".sortableAreaswidthClass").css("width","96%");
    $('.reorderingAreas').hide();
    $('#areasDonebtn').hide();
    $('#areasEditbtn').show();
    $('.PJM-RTO-vertical-text').show();
    $("#sortableAreas").sortable({
        disabled: true
    });
    var idsInOrder = $("#sortableAreas").sortable("toArray");
    var num = 0;
    for (var ids in idsInOrder) {
        var sortableAreasInfo = {};
        var id = parseInt(idsInOrder[ids]);
        sortableAreasInfo.area = actualValues[id].key;
        sortableControlAreas.push(sortableAreasInfo);
        num++;
    } 
    if (jQuery.isEmptyObject(sortableControlAreas) == false) {
        localStorage.setItem("sortableControlAreas", JSON.stringify(sortableControlAreas));
    }
}

function doneOrEditButtonCSSForTablet(listheight){

     $(" #sortableAreas li:first-child").css("width", "100%");
     $('.setWidth').css('width', '25%');
     $('.actualValueDiv').css('padding-left', '2.5%');
     $('.scheduledValueDiv').css('padding-left', '5%');
     $('.loopflowValueDiv').css('padding-left', '12%');
     $(".PJM-RTO-vertical-text").css('width', listheight - 14);
     $(".PJM-RTO-vertical-text").css('padding', '3px 0px');
     $(".PJM-RTO-vertical-text").css('margin-right', '3%');
     $("#sortableAreas li ").css("width", "100%");
    if ($('#areasDonebtn').is(":visible")) {
            $('.reorderingAreas').show();
            $('.setWidth').css('width', '25%');
            $('.actualValueDiv').css('padding-left', '0');
            $('.scheduledValueDiv').css('padding-left', '0');
            $('.loopflowValueDiv').css('width', '22%');
            $('.loopflowValueDiv').css('padding-left', '4.75%');
            $('.setWidth_loop').css('margin-left', '0%');
            $('.reorderingAreas').css("width",'38px');
            $('.reorderingAreas').css("margin-right",'2%');
            $('.reorderingAreas').css("margin-left",'1%');
    } else {
            $('.setWidth').css('width', '25%');
            $('.loopflowValueDiv').css('width', '22%');
            $('.actualValueDiv').css('padding-left', '2.7%');
            $('.scheduledValueDiv').css('padding-left', '4.8%');
            $('.loopflowValueDiv').css('padding-left', '11.7%');
            $('.setWidth_loop').css('margin-left', '0%');
            $('.reorderingAreas').hide();
    }
}
function doneOrEditButtonCSSForPhone(listheight){

    $(".PJM-RTO-vertical-text").css('width', listheight - 3);
    $(".PJM-RTO-vertical-text").css('margin-right', '3%');
    if ($('#areasDonebtn').is(":visible")) {
            $('.reorderingAreas').show();
            $('.actualValueDiv').css('width', '22%');
            $('.scheduledValueDiv').css('width', '26%');
            $('.loopflowValueDiv').css('width', '21%');
            $('.actualValueDiv').css('padding-left', '2.6%');
            $('.scheduledValueDiv').css('padding-left', '4.7%');
            $('.loopflowValueDiv').css('padding-left', '2.5%');
            $('.reorderingAreas').css("float",'right');
            $('.reorderingAreas').css("margin-right",'3%');
            $('.reorderingAreas').css("margin-left",'1%');
            $('.reorderingAreas').css("width",'7%');
    } else {
            $('.setWidth_actual').css('width', '25%');
            $('.setWidth_scheduled').css('width', '23%');
            $('.setWidth_loop').css('width', '26%');
            $('.setWidth_scheduled').css('padding-left', '0%');
            $('.setWidth').css('width', '25%');
            $('.actualValueDiv').css('padding-left', '2.3%');
            $('.scheduledValueDiv').css('padding-left', '4.5%');
            $('.loopflowValueDiv').css('padding-left', '1.2%');
            $('.reorderingAreas').hide();
    }
}