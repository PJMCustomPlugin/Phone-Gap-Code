var dbapp = dbapp || {};
dbapp.dispatchedReservesData = {};
dbapp.dropTableDispatchedReserves = function () {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS dispatchedReserves", []);
    });
}
dbapp.createTableDispatchedReserves = function (dispatched) {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE dispatchedReserves(dispatched TEXT)", [],dbapp.insertDataDispatchedReserves(dispatched),dbapp.onError);
    });
}
function dispatchedReservesDataForService() {
     new servicesModel.getServiceData("dispatched");
}

dbapp.insertDataDispatchedReserves = function (dispatched) {
    if(!jQuery.isEmptyObject( dispatched)) {  
        var db = dbapp.db;
        dispatched = JSON.stringify(dispatched);
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO dispatchedReserves(dispatched) VALUES (?)", [dispatched],
                dbapp.onSuccess,
                dbapp.onError);
        });
    }else  { 
        var db = dbapp.db;
        setTimeout(function() {
            dispatched = JSON.stringify(dbapp.dispatchedReservesData);
            db.transaction(function (tx) {
                tx.executeSql("INSERT INTO dispatchedReserves(dispatched) VALUES (?)", [dispatched],
                    dbapp.onSuccess,
                    dbapp.onError);
            });
       },1000);
    }

}

dbapp.updateDataDispatchedReserves = function (dispatched) { 
    if(!jQuery.isEmptyObject( dispatched)) {
        var db = dbapp.db;
        dispatched = JSON.stringify(dispatched);
        db.transaction(function (tx) {
            tx.executeSql("update dispatchedReserves set dispatched =? ", [dispatched],
                dbapp.retrieveDispatchedReserves,
                dbapp.onError);
        });
    }
}

dbapp.retrieveDispatchedReserves = function () {
    var db = dbapp.db;
    var render = function (tx, rs) {
        dbapp.dispatchedReservesData = JSON.parse(rs.rows.item(0).dispatched);
    }
    db.transaction(function (tx) {
        tx.executeSql("SELECT dispatched FROM dispatchedReserves", null,
            render,
            dbapp.onError);
    });
}