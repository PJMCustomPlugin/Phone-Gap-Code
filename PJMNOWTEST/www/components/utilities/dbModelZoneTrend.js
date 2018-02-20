var dbapp = dbapp || {};
dbapp.zoneTrendData = {};
console.log("dbModelZoneTrend.js");
dbapp.createzoneTrendDetails = function (zoneTrendDetails) {
    var db = dbapp.db;
    db.transaction(function (tx) {
        try {
            tx.executeSql("CREATE TABLE tbl_zoneTrend(zonetrend_details TEXT)", [], dbapp.insertZoneTrendDetails(zoneTrendDetails), dbapp.onError);
        } catch (error) {}
    });
}

dbapp.dropZoneTrendDetails = function () {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS tbl_zoneTrend", []);
    });
}

dbapp.insertZoneTrendDetails = function (zoneTrendDetails) {
    var dataZones = JSON.stringify(zoneTrendDetails);
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO tbl_zoneTrend(zonetrend_details) VALUES (?)", [dataZones],
            dbapp.onSuccess,
            dbapp.onError);
    });
}

dbapp.retrieveZoneTrendDetails = function () {
    var db = dbapp.db;
    var render = function (tx, rs) {
        dbapp.zoneTrendData = JSON.parse(rs.rows.item(0).zonetrend_details);
    }
    db.transaction(function (tx) {
        tx.executeSql("SELECT zonetrend_details FROM tbl_zoneTrend", null,
            render,
            dbapp.onError);
    });
}