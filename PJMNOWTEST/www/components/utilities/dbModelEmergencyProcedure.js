var dbapp = dbapp || {};
dbapp.emergencyProcedureData = {};
console.log("dbModelEmergencyProcedure.js");
dbapp.dropTableEP = function () {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS emergency_procedure", []);
    });
}
dbapp.createTableEP = function (emergencyProcedure) {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE emergency_procedure(emergency_procedure TEXT)", [],dbapp.insertDataEmergencyProcedure(emergencyProcedure),dbapp.onError);
    });
}

dbapp.insertDataEmergencyProcedure = function (emergencyProcedure) { 
    if(!jQuery.isEmptyObject( emergencyProcedure)) {
        var db = dbapp.db;
        emergencyProcedure = JSON.stringify(emergencyProcedure);
        var epDataInserted = function () {
              localStorage.setItem("epDataInserted",true);
        }
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO emergency_procedure(emergency_procedure) VALUES (?)", [emergencyProcedure],
                epDataInserted,
                dbapp.onError);
        });
    }else {
          var db = dbapp.db;
    }
}

dbapp.updateDataEmergencyProcedure = function (emergencyProcedure) { 
    if(!jQuery.isEmptyObject( emergencyProcedure)) {
        var db = dbapp.db;
        emergencyProcedure = JSON.stringify(emergencyProcedure);
        db.transaction(function (tx) {
            tx.executeSql("update emergency_procedure set emergency_procedure =? ", [emergencyProcedure],
                dbapp.retrieveEmergencyProcedure,
                dbapp.onError);
        });
    }
}

dbapp.retrieveEmergencyProcedure = function () {
    var db = dbapp.db;
    var renderEP = function (tx, rs) {
        dbapp.emergencyProcedureData = JSON.parse(rs.rows.item(0).emergency_procedure);
    }
    db.transaction(function (tx) {
        tx.executeSql("SELECT emergency_procedure FROM emergency_procedure", null,
            renderEP,
            dbapp.onError);
    });
}
