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
        "patientdailyquery",
        {
            pdq_id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            pdq_name: {
                type: "text",
                null: true
            },
            pdq_created_timestamp: {
                type: "timestamp",
                null: true
            },
            pdq_user_id: {
                type: "int",
                length: 11,
                null: true
            },
            pdq_active: {
                type: "varchar",
                length: 50,
                null: true,
                defaultValue: 1
            },
            is_deleted: {
                type: "tinyint",
                length: 1,
                null: true,
                defaultValue: 0
            }
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable("patientdailyquery", callback);
};

exports._meta = {
    version: 1
};
