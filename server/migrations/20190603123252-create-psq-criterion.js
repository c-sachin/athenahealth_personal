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
        "psq_criterion",
        {
            psqc_criterion_id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            psqc_criterion_name: {
                type: "varchar",
                length: 100,
                null: true
            },
            psqc_criterion: {
                type: "longtext",
                null: true
            },
            psqc_criterion_text: {
                type: "longtext",
                null: true
            },
            psqc_criterion_condition: {
                type: "varchar",
                length: 50,
                null: true
            },
            psqc_group_id: {
                type: "bigint",
                length: 20,
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
    db.dropTable("psq_criterion", callback);
};

exports._meta = {
    version: 1
};
