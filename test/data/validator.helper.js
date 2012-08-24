var patio = require("index"),
    config = require("../test.config.js"),
    comb = require("comb-proxy");

var DB;
var createTables = function () {
    patio.resetIdentifierMethods();
    DB = patio.connect(config.DB_URI + "/sandbox");
    return DB.forceCreateTable("validator", function () {
        this.primaryKey("id");
        this.str(String);
        this.str2(String);
        this.macAddress(String);
        this.ipAddress(String);
        this.uuid(String);
        this.num(Number);
        this.date(Date);
    });
};


var dropTableAndDisconnect = function () {
    return comb.executeInOrder(patio, DB, function (patio, db) {
        db.forceDropTable("validator");
        patio.disconnect();
        patio.resetIdentifierMethods();
    });
};

exports.createSchemaAndSync = function (underscore) {
    var ret = new comb.Promise();
    createTables(underscore).chain(comb.hitch(patio, "syncModels"), ret).then(ret);
    return ret;
};


exports.dropModels = function () {
    return dropTableAndDisconnect();
};