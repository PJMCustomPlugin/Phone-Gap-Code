var dbapp = {
    db:null,
    openDb:function() {
       var dbName = "pjm.sqlite";
       if (window.navigator.simulator === true) {
            // For debugin in simulator fallback to native SQL Lite
            dbapp.db = window.openDatabase(dbName, "1.0", "PJM", 200000);
       }
       else {
            dbapp.db = window.sqlitePlugin.openDatabase(
                {
                  name: dbName,
                  location: 1 
                },
                function (msg) { },
                function (msg) { }
            );
        }
	}
};
