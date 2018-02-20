var dbapp = dbapp || {};
dbapp.demandData = {};
dbapp.dropTableDemand = function () {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS demandGraph", []);
    });
}
dbapp.createTableDemand = function (demand) {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE demandGraph(demand TEXT)", [],dbapp.insertDataDemand(demand),dbapp.onError);
    });
}
function demandDataForService() {
     new servicesModel.getServiceData("graph");
}

dbapp.insertDataDemand = function (demand) {
    if(!jQuery.isEmptyObject( demand)) {  
        var db = dbapp.db;
        demand = JSON.stringify(demand);
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO demandGraph(demand) VALUES (?)", [demand],
                dbapp.onSuccess,
                dbapp.onError);
        });
    }else  { 
        var db = dbapp.db;
        setTimeout(function() {
            demand = JSON.stringify(dbapp.demandData);
            db.transaction(function (tx) {
                tx.executeSql("INSERT INTO demandGraph(demand) VALUES (?)", [demand],
                    dbapp.onSuccess,
                    dbapp.onError);
            });
       },1000);
    }

}
dbapp.retrieveDemand = function () {
    var db = dbapp.db;
    var render = function (tx, rs) {
        dbapp.demandData = JSON.parse(rs.rows.item(0).demand);
    }
    db.transaction(function (tx) {
        tx.executeSql("SELECT demand FROM demandGraph", null,
            render,
            dbapp.onError);
    });
}