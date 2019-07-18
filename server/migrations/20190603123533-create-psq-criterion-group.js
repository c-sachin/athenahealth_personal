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
        "psq_criterion_group",
        {
            psqc_group_id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            psqc_group_condition: {
                type: "varchar",
                length: 50,
                null: true
            },
            psqc_psq_id: {
                type: "bigint",
                length: 20,
                null: true
            },
            group_criteria_name: {
                type: "varchar",
                length: 100,
                null: true
            }
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable("psq_criterion_group", callback);
};
exports._meta = {
    version: 1
};
