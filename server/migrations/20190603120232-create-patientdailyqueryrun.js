"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db, callback) {
    db.createTable(
        "patientdailyqueryrun",
        {
            pdqr_id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            pdqr_run_timestamp: {
                type: "timestamp",
                null: true
            },
            pdqr_pdq_id: {
                type: "int",
                length: 11,
                null: true
            },
            pdq_active: {
                type: "varchar",
                length: 50,
                null: true,
                defaultValue: 1
            }
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable("patientdailyqueryrun", callback);
};

exports._meta = {
    version: 1
};
