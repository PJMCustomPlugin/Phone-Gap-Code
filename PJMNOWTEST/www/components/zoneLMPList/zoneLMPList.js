function zoneLMPListInit(){
    if(runningPage != 2){
        runningPageChange(2);
    }
}
function displayImage(){
    $(".km-scroller-pull").remove();
    $("#updateImg").css("display", "block");
    $("#rotatingImg").addClass("imgSpan");
}

function initPullToRefreshForZoneLMPList(e) {
    scrollerOptions = e;
    var scroller = e.view.scroller;
    scroller.setOptions({
        pullToRefresh: true,
        endlessScroll: true,
        messages: {
            pullTemplate: "",
            releaseTemplate: function () {
                displayImage();
            },
            refreshTemplate: function () {
                displayImage();
            },
        },
        pull: function () {
            if ((isiPadPro(device.model) || kendo.support.mobileOS.tablet) && ($(window).width() > $(window).height()) ? 90 : 0 == 90 || sorting == true) {
                e.preventDefault();
            } else {
                refreshZoneLMPMapDbPull();
                $(".km-scroller-pull").remove();
                setTimeout(function () {
                    scroller.pullHandled();
                    $("#updateImg").css("display", "none");
                    scroller.reset();
                }, 800);
            }
        }
    })
    scroller.bind("scroll", function (e) {
        if (e.scrollTop > 0) {
            scroller.reset();
        } else if (e.scrollTop < 0) {
            $(".km-scroller-pull").remove();
            if ((isiPadPro(device.model) || kendo.support.mobileOS.tablet) && ($(window).width() > $(window).height()) ? 90 : 0 == 90 || sorting == true) {
                scroller.reset();
                e.preventDefault();
            } else {
                if (scrollTopZero == true) {} else if (sortableTouched == true) {
                    $(".km-scroller-pull").remove();
                    scroller.reset();
                    sortableTouched = false;
                }
            }
        } else if (e.scrollTop == 0) {
            scroller.pullHandled();
            scrollTopZero = true;
        }
    });
}

var isLMPListSaved = true;
var scrollTopZero = true;
var sortableTouched = false;
var LMPListInEditMode = false;
var currentZoneLMPArray;
var toScroll = true;
var sorting = false;

function renderZoneLMPList() {
    toScroll = true;
    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    }
    var reqHeight = size.height;
    $('#zoneLMPListWhite').css('height', reqHeight);
    var currentZoneLMPObj = dbapp.zoneData;
    var sortableZoneArray = localStorage.getItem("sortableZoneArray");
    currentZoneLMPArray = currentZoneLMPObj.zoneLMPList;

    var asOfDiv = document.getElementById("asof");
    asOfDiv.innerHTML = "As of  " + currentZoneLMPObj.Zone_LMP_Last_Updated_Date.replace("EDT", "EPT").replace("AM", "a.m.").replace("PM", "p.m.").replace("EST", "EPT");
    var sortableDiv = "";
    if (typeof sortableZoneArray === 'undefined' || sortableZoneArray === null) {
        for (var i = 0; i < currentZoneLMPArray.length; i++) {
            var colorAttr = ZoneMapModule.getZoneLmpColor(currentZoneLMPArray[i].Zone_LMP_Value);
            var color = colorAttr["fill"];
            var zoneLMPTableValue = parseFloat(currentZoneLMPArray[i].Zone_LMP_Value).toFixed(2);
            if(zoneLMPTableValue<0){
                zoneLMPTableValue = "("+(-(zoneLMPTableValue))+")";
            }
            sortableDiv = sortableDiv + 
                    "<li id='" + i + "'>"+
                            "<div class='zone-lmp-name'>" + currentZoneLMPArray[i].Zone_LMP + "</div>"+
                            "<div class='lmpColor' style='float: left;width: 15px;height: 15px;background-color:" + color + "'></div>"+
                            "<div class='lmp-mw-val'>" + zoneLMPTableValue + 
                                "<img style='display:none' src='styles/images/Reorder_Icon.png' class='reordering'>" + 
                            "</div>"+
                    "</li>";
        }
    } else {
        var tempxzoneArray = JSON.parse(sortableZoneArray);
        for (var k = 0; k < tempxzoneArray.length; k++) {
            for (var i = 0; i < currentZoneLMPArray.length; i++) {
                if (tempxzoneArray[k].Zone_LMP == currentZoneLMPArray[i].Zone_LMP) {
                    var colorAttr = ZoneMapModule.getZoneLmpColor(currentZoneLMPArray[i].Zone_LMP_Value);
                    var color = colorAttr["fill"];
                     var zoneLMPTableValue = parseFloat(currentZoneLMPArray[i].Zone_LMP_Value).toFixed(2);
                    if(zoneLMPTableValue<0){
                        zoneLMPTableValue = "("+(-(zoneLMPTableValue))+")";
                    }
                    sortableDiv = sortableDiv +
                                 "<li id='" + i + "'>"+
                                        "<div class='zone-lmp-name'>" + currentZoneLMPArray[i].Zone_LMP + "</div>"+
                                        "<div class='lmpColor' style='float:left;width: 15px;height: 15px;background-color:" + color + "'></div>"+
                                        "<div class='lmp-mw-val'>" + zoneLMPTableValue + 
                                                "<img style='display:none' src='styles/images/Reorder_Icon.png' class='reordering'>" +
                                        "</div>"+
                                 "</li>";
                }
            }
        }
    }

    var sortdiv = document.getElementById("sortable");
    sortdiv.innerHTML = "";
    sortdiv.innerHTML = sortdiv.innerHTML + sortableDiv;
    if (LMPListInEditMode) {
        $('.reordering').show();
        $('#editSorting').hide();
        $('#doneSorting').show();
    } else {
        $('.reordering').hide();
        $('#editSorting').show();
        $('#doneSorting').hide();
    }

    $(".reordering").bind('touchstart', function (event) {
        $(this).parent().parent().css("opacity", 0.6);
        $(this).parent().parent().css("background-color", 'clear');
        $(this).parent().parent().css("border-top", "1px solid #BCC1C6");
        toScroll = false;
    });
    $(".reordering").bind('touchend', function (event) {
        $(this).parent().parent().css("opacity", 1);
        $(this).parent().parent().css("border-top", "0px solid #BCC1C6");
        toScroll = true;
    });

    try {
        if (isiPadPro(device.model) == false && !kendo.support.mobileOS.tablet) {
            $(".lmp-mw-val").css('margin-top', '-18.5px');
        } else {
            $(".lmp-mw-val").css('margin-top', '-19px');
            $(".zone-lmp-name").css('margin-top', '-5px');
            $(".lmpColor").css('margin-top', '-1px');
        }

    } catch (error) {}
}

function backToZoneLMPView() {
    try {
        if (!isLMPListSaved) {
            $("#sortable").sortable("cancel");
        }
        $('.reordering').hide();
        $('#doneSorting').hide();
        $('#editSorting').show();
        $("#sortable").sortable({
            disabled: true
        });
    } catch (error) {}

    try {
        runningPageChange(1);
        window.screen.unlockOrientation();
    } catch (error) {}
    location.href = '#zoneLMPView';
}

renderZoneLMPList();

function clickOnZoneLMPTableList(e){			
    var zoneLMPName = e.item.find('div.zone-lmp-name').text();				
    var zoneColor = e.item.find('div.lmpColor').css("background-color");			
    zoneTrendPopupGeneration(zoneLMPName,zoneColor);		
}

var $state = $('#updateImg');

$(document).ready(function () {
    var lastY;
    var currentY;
    var lastScrollTop;
    var currentScrollTop;

    // reset touch position on touchstart
    $('#sortable').bind('touchstart', function (e) {
        //do your stuff
        sortableTouched = true;
        currentScrollTop = this.scrollTop;
        lastScrollTop = currentScrollTop;
        if (toScroll) {
            var currentY = e.originalEvent.touches[0].clientY;
            lastY = currentY;
            e.preventDefault();
        }
    });

    // get movement and scroll the same way
    $('#sortable').bind('touchmove', function (e) {
        $(".km-vertical-scrollbar").css("display", "None");
        if (toScroll) {
            var currentY = e.originalEvent.touches[0].clientY;
            delta = currentY - lastY;
            currentScrollTop = this.scrollTop;

            if (this.scrollTop == 0 && delta > 0) {
                scrollTopZero = true;
                sortableTouched = true;
            } else {
                sortableTouched = true;
                scrollTopZero = false;
                this.scrollTop += delta * -1;
                lastY = currentY;
            }
            lastScrollTop = currentScrollTop;
        }
    });
    var isRefreshed = false;

    // get movement and scroll the same way
    $('#sortable').bind('touchend', function (e) {
        if (this.scrollTop == 0) {
            scrollTopZero = true;
        }
        sortableTouched = false;
    });

    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    }

    var headerheight = $('.km-header').height();
    var footerheight = $('.km-footer').height();

    var sortListHeight = window.innerHeight - headerheight - footerheight - 72;
    $(".sortablelist").css('height', sortListHeight);

    $('.clearWhite').addClass('mapdivclr');
    $('.reordering').hide();
    $('#doneSorting').hide();
    $('#editSorting').click(function () {

        LMPListInEditMode = true;
        $('.reordering').show();
        $('#editSorting').hide();
        $('#doneSorting').show();
        $("#sortable").sortable({
            scroll: true,
            scrollSensitivity: 1,
            axis: 'y',
            containment: "parent",
            handle: '.reordering',
            disabled: false,
            start: function (event, ui) {
                sorting = true;
                sortableTouched = true;
                isLMPListSaved = false;
            },
            stop: function (event, ui) {
                sortableTouched = false;
                sorting = false;
            },
            sort: function (e, ui) {
                sorting = true;
                doZoneLMPListSort(this,ui);
            },
        }).disableSelection();;

    });

    $('#doneSorting').click(function () {

        var sortableZones = [];
        isLMPListSaved = true;
        LMPListInEditMode = false;

        $('.reordering').hide();
        $('#doneSorting').hide();
        $('#editSorting').show();
        $("#sortable").sortable({
            disabled: true
        });
        var idsInOrder = $("#sortable").sortable("toArray");
        saveSortableZoneLMPArray(idsInOrder,currentZoneLMPArray,sortableZones)
    });
});