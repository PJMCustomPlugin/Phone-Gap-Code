function initPullToRefreshForControl(e) {
    scrollerOptions = e;
    var scroller = e.view.scroller;
    scroller.setOptions({
        pullToRefresh: true,
        endlessScroll: true,
        messages: {
            pullTemplate: "",
            releaseTemplate: function () {
                $(".km-scroller-pull").remove();
                $("#updateImg_Areas").css("display", "block");
                $("#rotatingImg_Areas").addClass("imgSpan");
            },
            refreshTemplate: function () {
                $(".km-scroller-pull").remove();
                $("#updateImg_Areas").css("display", "block");
                $("#rotatingImg_Areas").addClass("imgSpan");
            },
        },
        pull: function () {
            if ((isiPadPro(device.model) || kendo.support.mobileOS.tablet) && ($(window).width() > $(window).height()) ? 90 : 0 == 90 || sorting == true) {
                e.preventDefault();
            } else {
                refreshControlAreasDb();
                $(".km-scroller-pull").remove();
                setTimeout(function () {
                    scroller.pullHandled();
                    $("#updateImg_Areas").css("display", "none");
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
                $(".km-scroller-pull").remove();
            }
        } else if (e.scrollTop == 0) {
            $("#updateImg_Areas").css("display", "none");
        }
    });
}

function refreshControlAreasDb() {
    if (isOnline()) {
        try {
            tieflowsAndDemandUpdate();
        } catch (error) {}
        try {
            loadtieFlowsData();
        } catch (ex) {}
        try {
            loadControlAreas();
        } catch (error) {}
        try {
            loadControlAreas_landscape();
        } catch (error) {}
    } else {
        networkConnectionCheckingWhileUpdating();
    }
}

function controlAreasLock() {
    try {
        if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
            window.screen.unlockOrientation();
        }
    } catch (error) {}
    try {
        runningPageChange(4);
    } catch (error) {}

}
function sortMethod(container,ui){
    var  placeholder = container.children('.ui-sortable-placeholder:first');
    var helpHeight = ui.helper.outerHeight(),
        helpTop = ui.position.top,
        helpBottom = helpTop + helpHeight;
        container.children().each(function () {
            var item = $(this);
            if (!item.hasClass('ui-sortable-helper') && !item.hasClass('ui-sortable-placeholder')) {
                var itemHeight = item.outerHeight(),
                    itemTop = item.position().top,
                    itemBottom = itemTop + itemHeight;
                if ((helpTop > itemTop) && (helpTop < itemBottom)) {
                    var tolerance = Math.min(helpHeight, itemHeight) / 2,
                        distance = helpTop - itemTop;
                    if (distance < tolerance) {
                        placeholder.insertBefore(item);
                        container.sortable('refreshPositions');
                        return false;
                    }
                } else if ((helpBottom < itemBottom) && (helpBottom > itemTop)) {
                    var tolerance = Math.min(helpHeight, itemHeight) / 2,
                        distance = itemBottom - helpBottom;
                    if (distance < tolerance) {
                        placeholder.insertAfter(item);
                        container.sortable('refreshPositions');
                        return false;
                    }
                }
            }
        });
}