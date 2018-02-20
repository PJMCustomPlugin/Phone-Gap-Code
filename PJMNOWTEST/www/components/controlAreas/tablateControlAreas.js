var sortableTouched = false;
var actualValues_Tab = [];
var scheduledValues_Tab = [];
var tabAreasToScroll = true;

function loadControlAreas_landscape() {
    tabAreasToScroll = true;
    var tieData = dbapp.tieData;
    actualValues_Tab = [];
    scheduledValues_Tab = [];
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
                 actualValues_Tab.push(tieFlowNameAndValueObject);
            else if (tname[0] == 'SCHEDULED')
                scheduledValues_Tab.push(tieFlowNameAndValueObject);
        }          
    }
    var arrangingDifferences = "";
    var sortableControlAreasList = localStorage.getItem('sortableControlAreas');
    if (jQuery.isEmptyObject(sortableControlAreasList)) {
            arrangingDifferences = getActualValues_Tab(true,null,arrangingDifferences);
    } else {
        var tempxzoneArray = JSON.parse(sortableControlAreasList);
        for (var l = 0; l < tempxzoneArray.length; l++) {
            arrangingDifferences = getActualValues_Tab(false,tempxzoneArray[l].area,arrangingDifferences);
        }
    }
    setTimeout(function () {
        var mainContainer = document.getElementById("sortableAreas_tab");
        mainContainer.innerHTML = arrangingDifferences;
        if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
            $('.setWidth_Tab').css('width', '23%');
            $('.loopflowValueDivTab').css('width', '32%');
            $('.loopflowValueDivTab').css('padding-right', '7%');
            $(".actualValueDivTab").css("padding-left", '3%');
        }
        $(".reorderingAreas_tab").bind('touchstart', function (event) {
            $("#sortableAreas_tab li").css("border-top", "1px solid #BCC1C6");
            tabAreasToScroll = false;
        });
        $(".reorderingAreas_tab").bind('touchend', function (event) {
            $("#sortableAreas_tab li").css("border-top", "0px solid #BCC1C6");
            tabAreasToScroll = true;
        });
    }, 200);
}
loadControlAreas_landscape();

$(document).ready(function () {
    setTimeout(function () {
        $('.reorderingAreas_tab').hide();
        $("#done_btn").hide();

         $('.actualValueDivTab').css('width', '26%');		
    $('.loopflowValueDivTab').css('width', '22%');			
    // $('.actualValueDivTab').css('padding-left', '0%');				
    // $('.loopflowValueDivTab').css('padding-left', '6%');
    $('.scheduledValueDivTab').css('width', '16%');
    // $('.scheduledValueDivTab').css('padding-left', '0%');

        // $('.actualValueDivTab').css('width', '27%');
        // $('.loopflowValueDivTab').css('width', '25%');
        $('.loopflowValueDivTab').css('padding-right', '0%');
        $('.actualValueDivTab').css('padding-left', '0%');
        $('.loopflowValueDivTab').css('padding-left', '6%');
        var sortableControlAreas = [];
        $("#sortableAreas_tab li").css("width","100%");
        $('.vertical-text-tab').show();
        var lastY;
        var currentY;
        // reset touch position on touchstart
        $('#sortableAreas_tab').bind('touchstart', function (e) {
            if (tabAreasToScroll) {
                var currentY = e.originalEvent.touches[0].clientY;
                lastY = currentY;
                e.preventDefault();
            }
        });
        // get movement and scroll the same way
        $('#sortableAreas_tab').bind('touchmove', function (e) {
            if (tabAreasToScroll) {
                var currentY = e.originalEvent.touches[0].clientY;
                delta = currentY - lastY;
                sortableTouched = true;
                this.scrollTop += delta * -1;
                lastY = currentY;
            }
        });
        // get movement and scroll the same way
        $('#sortableAreas_tab').bind('touchend', function (e) {
            sortableTouched = false;
        });
        var size = {
            width: window.innerWidth || document.body.clientWidth,
            height: window.innerHeight || document.body.clientHeight
        }
        var headerHeight = $('.km-header').height();
        var footerHeight = $('.km-footer').height();
        if (footerHeight == 0) {
            footerHeight = 57;
        }
        if (headerHeight == 0) {
            headerHeight = 55;
        }
        var listHeight = size.height - headerHeight - footerHeight - 95;
        $(".sortableAreasList_tab").css('height', listHeight);
        $(".vertical-text-tab").css('width', listHeight);
        $("#edit_btn").click(function () {
            editButtonClicked_Tab();
        });
        $('#done_btn').click(function () {
            doneButtonClicked_Tab();
        });
    }, 200);
});
function editButtonClicked_Tab(){
    $(".sortableAreasTabHeading").css("width","100%");		
    $('.loopflowValueDivTab').css('width', '17%');		
    $('.actualValueDivTab').css('width', '23%');		
    $('.scheduledValueDivTab').css('width', '18%');		
    // $('.actualValueDivTab').css('padding-left', '3%');		
    $('.scheduledValueDivTab').css('padding-left', '0');		
    $('.loopflowValueDivTab').css('padding-left', '7%');		
    $('.loopflowValueDivTab').css('padding-right', '0%');		
    $("#sortableAreas_tab").css("width","100%");		
    $('.vertical-text-tab').hide();		
    $('.reorderingAreas_tab').show();
    $('.reorderingAreas_tab').css("width",'32px');		
    $('.reorderingAreas_tab').css("margin-right",'3%');		
    $('.reorderingAreas_tab').css("float",'right');		
    $('.reorderingAreas_tab').css("margin-left",'0%');
    $('#edit_btn').hide();
    $('#done_btn').show();
    $("#sortableAreas_tab").sortable({
        scroll: true,
        scrollSensitivity: 1,
        axis: 'y',
        containment: "parent",
        handle: '.reorderingAreas_tab',
        disabled: false,
        start: function (event, ui) {
            sortableTouched = true;
        },
        stop: function (event, ui) {
            sortableTouched = false;
        },
        sort: function (e, ui) {
           var container = $(this);
            sortMethod(container,ui);
        },
    }).disableSelection();
}
function doneButtonClicked_Tab(){
    $(".sortableAreasTabHeading").css("width","96%");		
    $('.actualValueDivTab').css('width', '26%');		
    $('.loopflowValueDivTab').css('width', '22%');			
    $('.actualValueDivTab').css('padding-left', '0%');				
    $('.loopflowValueDivTab').css('padding-left', '6%');
    $('.scheduledValueDivTab').css('width', '16%');
    $('.scheduledValueDivTab').css('padding-left', '0%');			
    var sortableControlAreas = [];
    $("#sortableAreas_tab li").css("width","100%");		
    $('.vertical-text-tab').show();
    $('.reorderingAreas_tab').hide();
    $('#done_btn').hide();
    $('#edit_btn').show();
    $("#sortableAreas_tab").sortable({
        disabled: true
    });
    var idsInOrder = $("#sortableAreas").sortable("toArray");
    var num = 0;
    for (var ids in idsInOrder) {
        var sortableAreasInfo = {};
        var id = parseInt(idsInOrder[ids]);
        sortableAreasInfo.area = actualValues_Tab[id].key;
        sortableControlAreas.push(sortableAreasInfo);
        num++;
    }
     if (jQuery.isEmptyObject(sortableControlAreas) == false) {
        localStorage.setItem("sortableControlAreas", JSON.stringify(sortableControlAreas));
    }
}
function getActualValues_Tab(isUndefined,tempxzoneArrayValue,arrangingDifferences){

    for (var i = 0; i < actualValues_Tab.length; i++) {
        if (isUndefined || tempxzoneArrayValue == actualValues_Tab[i].key) {
            var areaKey = actualValues_Tab[i].key;
            var tempKey = actualValues_Tab[i].key;
            var areyKeysObject = {"key": "SAYR","value":"NEPT"};
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
            else
                continue;
            
            var value = actualValues_Tab[i].value;
            var tempScheduledValue = 0;
            for (var k = 0; k < scheduledValues_Tab.length; k++) {
                if (tempKey == scheduledValues_Tab[k].key) {
                    tempScheduledValue = scheduledValues_Tab[k].value;
                    break;
                }
            }
            var actualValue = value >= 0 ? "<img src='styles/images/green-arr.png' width='18px' height='18px'>"+
                                         "<div style='color:#659800;'>" + commaSeparateNumber(value) + "</div>" :
                                         "<img src='styles/images/blue-arr.png' width='18px' height='18px'>"+
                                         "<div style='color:#3366CC;'>" + commaSeparateNumber((-value)) + "</div>";

            var scheduledvalue = tempScheduledValue >= 0 ? "<img src='styles/images/green-arr.png' width='18px' height='18px'>"+
                                                        "<div style='color:#659800;'>" + commaSeparateNumber(tempScheduledValue) + "</div>" :
                                                        "<img src='styles/images/blue-arr.png' width='18px' height='18px'>"+
                                                        "<div style='color:#3366CC;'>" + commaSeparateNumber((-tempScheduledValue)) + "</div>";

            var loopFlow = value - tempScheduledValue >= 0 ? "<img src='styles/images/green-arr.png' width='18px' height='18px'>"+
                                                          "<div style='color:#659800;'>" + commaSeparateNumber((value - tempScheduledValue)) + "</div>" :
                                                          "<img src='styles/images/blue-arr.png' width='18px' height='18px'>"+
                                                          "<div style='color:#3366CC;'>" + commaSeparateNumber((-(value - tempScheduledValue))) + "</div>";

            arrangingDifferences = arrangingDifferences + "<li id='" + i + "'>" + 
                                                            "<div style='width:20%;float:left;padding-left:8px;font-family: HelveticaNeue-Light;font-size:12pt;margin-top:-5px;'>" + areaKey + "</div>" +
                                                            "<div class='setwidth_Tab actualValueDivTab' style='width:25%;float:left;font-family:HelveticaNeue-Bold;font-size:12pt;text-align:center;margin-top:-14px;line-height:75%;'>" + actualValue + "</div>" + 
                                                            "<div class='setwidth_Tab scheduledValueDivTab' style='width:25%;float:left;font-family:HelveticaNeue-Bold;font-size:12pt;text-align:center;margin-top:-14px;line-height:75%;''>" + scheduledvalue + "</div>" + 
                                                            "<div class='setwidth_Tab loopflowValueDivTab' style='width:30%;float:left;font-family:HelveticaNeue-Bold;font-size:12pt;text-align:center;margin-top:-14px;line-height:75%;'>" + loopFlow + "</div>" + 
                                                            "<img style='display:none' src='styles/images/Reorder_Icon.png' class='reorderingAreas_tab'>" +
                                                       "</li>" ;
        }
    }
    return arrangingDifferences;
}