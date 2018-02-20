var dbapp = dbapp || {};
console.log("dbModelAnalytics.js");
dbapp.createTableForAnalytics = function () {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE tbl_analytics(page_number int primary key,spending_time int)", [], dbapp.insertDataForAnalytics, dbapp.onError);

    });
}
dbapp.insertDataForAnalytics = function () {
    var db = dbapp.db;
    db.transaction(function (tx) {
        for (var i = 1; i <= 20; i++) {
            var temp;
            if (i == 20)
                temp = 1;
            else
                temp = 0;
            tx.executeSql("INSERT INTO tbl_analytics(page_number,spending_time) VALUES (?,?)", [i, temp], dbapp.onSuccess, dbapp.onError);
        }
    });
}
dbapp.createTableForAnalyticsSending = function () {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE tbl_analyticsTime(last_time int)", [], dbapp.insertDataForAnalyticsTime, dbapp.onError);
    });
}
dbapp.insertDataForAnalyticsTime = function () {
    var lasttime = new Date().getTime() / 1000;
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO tbl_analyticsTime(last_time) VALUES (?)", [lasttime], dbapp.onSuccess, dbapp.onError);
    });
}
dbapp.retrieveDataForAnalyticsTime = function () {
    var db = dbapp.db;
    var render = function (tx, rs) {
        var lastTime = rs.rows.item(0).last_time;
        var currentTime = new Date().getTime() / 1000;
        var differenceTime = currentTime - lastTime;
        if (differenceTime >= 300) {
            dbapp.retrieveForAnalyticsInFiveMinutesInterval();
        }
    }
    db.transaction(function (tx) {
        tx.executeSql("SELECT last_time FROM tbl_analyticsTime", null,
            render,
            dbapp.onError);
    });
}
dbapp.dropTableForAnalyticsTime = function () {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS tbl_analyticsTime", []);
    });
}
dbapp.selectTimeForPageAnalytics = function (pageNumber) {
    var db = dbapp.db;
    var pastTime;
    return pastTime;
}
dbapp.updateTableForAnalytics = function (pageNumber, seconds) {
    var db = dbapp.db;
    var pastTime;
    var pastTimeforPage = function (tx, result) {
        pastTime = result.rows.item(0).spending_time;
        var completeTime = seconds + pastTime;

        db.transaction(function (tx) {
            try {
                tx.executeSql("UPDATE tbl_analytics set spending_time=" + completeTime + " where page_number=" + pageNumber, []);
            } catch (error) {}
        });
    };
    db.transaction(function (tx) {
        tx.executeSql("SELECT spending_time FROM tbl_analytics where page_number=" + pageNumber, null, pastTimeforPage, dbapp.onErrorsss);
    });
}
dbapp.retrieveForAnalytics = function () {
    var db = dbapp.db;
    var retrive = function (tx, result) {
        if (result != null && result.rows != null) {
            for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
            }
        }
    }
    db.transaction(function (tx) {
        tx.executeSql("SELECT page_number,spending_time FROM tbl_analytics", null, retrive, dbapp.onErrorsss);
    });
}

dbapp.retrieveForAnalyticsInFiveMinutesInterval = function () {
    var db = dbapp.db;
    var pageSpendingInformation = [];
    var totalAppOpensTriggeredByPushes = 0;
    var totalAppOpens = 0;
    var retriveAllInformation = function (tx, result) {
        if (result != null && result.rows != null) {
            for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                if (row.page_number == 21) {
                    totalAppOpensTriggeredByPushes = row.spending_time;
                    continue;
                }
                if (row.page_number == 22) {
                    totalAppOpens = row.spending_time;
                    continue;
                }
                var eachPageTimeSpentObj = {
                    "pageId": row.page_number,
                    "timeInSeconds": row.spending_time
                }
                pageSpendingInformation.push(eachPageTimeSpentObj);
            }
            var d = new Date().toString();
            var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
            var ssse = "(";
            var updatedTimestamp;
            try {
                updatedTimestamp = localISOTime + "+" + d.split("+")[1].split(ssse)[0];
            } catch (error) {
                updatedTimestamp = localISOTime + "-" + d.split("-")[1].split(ssse)[0];
            }
            var totalInformation = {
                "udid": localStorage.getItem('deviceuuId'),
                "analytics": pageSpendingInformation,
                "updatedTimestamp": updatedTimestamp,
                "totalAppOpens": totalAppOpens + totalAppOpensTriggeredByPushes,
                "totalAppOpensTriggeredByPushes": totalAppOpensTriggeredByPushes
            }
            $.ajax({
                type: "POST",
                async: true,
                url: serviceIpAddress_PJM + '/pjm/rest/services/edatafeed/addAnalyticData',
                contentType: "application/json; charset=utf-8",
                timeout: 10000,
                headers: {
                    'Origin': 'file:///'
                },
                data: JSON.stringify(totalInformation),
                success: function (data) {
                    db.transaction(function (tx) {
                        for (var j = 0; j < result.rows.length; j++) {
                            var row = result.rows.item(j);
                            try {
                                tx.executeSql("UPDATE tbl_analytics set spending_time=" + 0 + " where page_number=" + row.page_number, []);
                            } catch (error) {}
                        }
                    });
                    var appUpdatedTime = new Date().getTime() / 1000;
                    localStorage.setItem("analyticsSendingTime", appUpdatedTime);
                },
                error: function (r, s, e) { }
            });
        }
    }
    db.transaction(function (tx) {
        tx.executeSql("SELECT page_number,spending_time FROM tbl_analytics where spending_time > 0", null, retriveAllInformation, dbapp.onAnalyticsError);
    });
}
dbapp.onAnalyticsError = function (tx, e) { }