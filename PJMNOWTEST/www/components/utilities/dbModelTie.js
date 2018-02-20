var dbapp = dbapp || {};
dbapp.tieData = {};
dbapp.dropTableTie = function () {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS tieFlow", []);
    });
}
dbapp.createTableTie = function (tie) {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE tieFlow(tie TEXT)", [],dbapp.insertDataTie(tie),dbapp.onError);
    });
}
function tieflowDataFromService() {
    new servicesModel.getServiceData("tie");
}
dbapp.insertDataTie = function (tie) { 
    if(!jQuery.isEmptyObject( tie)) {
        var db = dbapp.db;
        tie = JSON.stringify(tie);
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO tieFlow(tie) VALUES (?)", [tie], dbapp.onSuccess, dbapp.onError);
        });
    }else {
        var db = dbapp.db;
        setTimeout(function(){
            tie = JSON.stringify(dbapp.tieData);
            db.transaction(function (tx) {
                tx.executeSql("INSERT INTO tieFlow(tie) VALUES (?)", [tie], dbapp.onSuccess, dbapp.onError);
            });
       },1000);     
    }
}

dbapp.retrieveTie = function () {
    var db = dbapp.db;
    var render = function (tx, rs) {
        dbapp.tieData = JSON.parse(rs.rows.item(0).tie);
    }
    db.transaction(function (tx) {
        tx.executeSql("SELECT tie FROM tieFlow", null, render, dbapp.onError);
    });
}
