var dbapp = dbapp || {};
dbapp.zoneData = {};
console.log("dbModelZone.js");
dbapp.dropTable = function () {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS zoneLMPMap", []);
    });
}
dbapp.createTable = function (zoneLMP) {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE zoneLMPMap(lmpMap TEXT)", [], dbapp.insertData(zoneLMP), dbapp.onError);
    });
}

function dataForInsertZones() {
    new servicesModel.getServiceData("zone");
}
dbapp.insertData = function (LMPMap) {
    if (!jQuery.isEmptyObject(LMPMap)) {
        var db = dbapp.db;
        LMPMap = JSON.stringify(LMPMap);
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO zoneLMPMap(lmpMap) VALUES (?)", [LMPMap],
                dbapp.onSuccess,
                dbapp.onError);
        });
    } else {
        var db = dbapp.db;
        setTimeout(function () {
            LMPMap = JSON.stringify(dbapp.zoneData);
            db.transaction(function (tx) {
                tx.executeSql("INSERT INTO zoneLMPMap(lmpMap) VALUES (?)", [LMPMap],
                    dbapp.onSuccess,
                    dbapp.onError);
            });
        }, 1000);
    }
}
dbapp.retrieveZone = function () {
    var db = dbapp.db;
    var render = function (tx, rs) {
        dbapp.zoneData = JSON.parse(rs.rows.item(0).lmpMap);
        splashScreenEvent();
    }
    db.transaction(function (tx) {
        tx.executeSql("SELECT lmpMap FROM zoneLMPMap", null,
            render,
            dbapp.retrieveZoneError);
    });
}

dbapp.retrieveZoneError = function () {
    splashScreenEvent();
}

dbapp.onError = function (tx, e) {
    try {
        $state.hide();
        $('#rotatingImg').removeClass('rot');
    } catch (ex) { }
}

dbapp.onSuccess = function (tx, r) { }

