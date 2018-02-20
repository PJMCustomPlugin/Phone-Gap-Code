var dbapp = dbapp || {};
dbapp.operationalReservesData = {};
dbapp.dropTableOperationalReserves = function () {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS operationalReserves", []);
    });
}
dbapp.createTableOperationalReserves = function (operational) {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE operationalReserves(operational TEXT)", [],dbapp.insertDataOperationalReserves(operational),dbapp.onError);
    });
}
function operationalReservesDataForService() {
     new servicesModel.getServiceData("operational");
}

dbapp.insertDataOperationalReserves = function (operational) {
    if(!jQuery.isEmptyObject( operational)) {  
        var db = dbapp.db;
        operational = JSON.stringify(operational);
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO operationalReserves(operational) VALUES (?)", [operational],
                dbapp.onSuccess,
                dbapp.onError);
        });
    }else  { 
        var db = dbapp.db;
        setTimeout(function() {
            operational = JSON.stringify(dbapp.operationalReservesData);
            db.transaction(function (tx) {
                tx.executeSql("INSERT INTO operationalReserves(operational) VALUES (?)", [operational],
                    dbapp.onSuccess,
                    dbapp.onError);
            });
       },1000);
    }

}

dbapp.updateDataOperationalReserves = function (operational) { 
    if(!jQuery.isEmptyObject( operational)) {
        var db = dbapp.db;
        operational = JSON.stringify(operational);
        db.transaction(function (tx) {
            tx.executeSql("update operationalReserves set operational =? ", [operational],
                dbapp.retrieveOperationalReserves,
                dbapp.onError);
        });
    }
}

dbapp.retrieveOperationalReserves = function () {
    var db = dbapp.db;
    var render = function (tx, rs) {
        dbapp.operationalReservesData = JSON.parse(rs.rows.item(0).operational);
    }
    db.transaction(function (tx) {
        tx.executeSql("SELECT operational FROM operationalReserves", null,
            render,
            dbapp.onError);
    });
}