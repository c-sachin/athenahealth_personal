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
        "maritalstatus",
        {
            maritalStatus_id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            maritalStatus_name: {
                type: "varchar",
                length: 100,
                null: true
            },
            maritalStatus_added: {
                type: "timestamp",
                null: true
            },
            maritalStatus_active: {
                type: "smallint",
                length: 6,
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
    db.dropTable("maritalstatus", callback);
};

exports._meta = {
    version: 1
};
