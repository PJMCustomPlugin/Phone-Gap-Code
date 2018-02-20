var dbapp = dbapp || {};
dbapp.allRegionsDemand = {};
dbapp.createAndInsertTableRegionsDemand = function (regionsDemand,isRegionsDemandTableCreated) {
    var db = dbapp.db;
    db.transaction(function (tx) {
        tx.executeSql("create table regionsDemandGraph(regionsDemandGraph text)", [], 
            dbapp.insertTableRegionDemand(regionsDemand,isRegionsDemandTableCreated),
            dbapp.onError);
    });
}

dbapp.insertTableRegionDemand = function (regionsDemand,isRegionsDemandTableCreated) {
     if(!jQuery.isEmptyObject(regionsDemand)) {  
         var db = dbapp.db;
         regionsDemand = JSON.stringify(regionsDemand);
         if(isRegionsDemandTableCreated == null || isRegionsDemandTableCreated == "false"){
                localStorage.setItem("isRegionsDemandTableCreated","true");
                db.transaction(function (tx) {
                    tx.executeSql("insert into regionsDemandGraph(regionsDemandGraph) values (?)", [regionsDemand],
                        dbapp.onSuccess,
                        dbapp.onError);
                });
          }else{
                db.transaction(function (tx) {
                        tx.executeSql("update regionsDemandGraph set regionsDemandGraph=?", [regionsDemand],
                            dbapp.onSuccess,
                            dbapp.onError);
                });
          }
     }
}

dbapp.updateTableRegionsDemand = function (regionsDemand){
    var db = dbapp.db;
    var isRegionsDemandTableCreated = localStorage.getItem("isRegionsDemandTableCreated");
    if(isRegionsDemandTableCreated == null || isRegionsDemandTableCreated == "false"){
        dbapp.createAndInsertTableRegionsDemand(regionsDemand,isRegionsDemandTableCreated);
    }else{
        dbapp.insertTableRegionDemand(regionsDemand,isRegionsDemandTableCreated);
    }
}

dbapp.retrieveRegionsDemand = function () {
    var db = dbapp.db;
    var render = function (tx, rs) {
        dbapp.allRegionsDemand = JSON.parse(rs.rows.item(0).regionsDemandGraph);
    }
    db.transaction(function (tx) {
        tx.executeSql("select regionsDemandGraph from regionsDemandGraph", null,
            render,
            dbapp.onError);
    });
}