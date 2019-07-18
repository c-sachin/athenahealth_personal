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
        "psq_result",
        {
            psq_result_id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            psq_result_mrn: {
                type: "varchar",
                length: 255,
                null: true
            },
            psq_result_name: {
                type: "varchar",
                length: 255,
                null: true
            },
            psq_result_age: {
                type: "varchar",
                length: 100,
                null: true
            },
            psq_result_sex: {
                type: "varchar",
                length: 100,
                null: true
            },
            psq_result_race: {
                type: "varchar",
                length: 100,
                null: true
            },
            psq_result_marital_status: {
                type: "varchar",
                length: 100,
                null: true
            },

            psq_result_psq_run_id: {
                type: "bigint",
                length: 20,
            }
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable("psq_result", callback);
};

exports._meta = {
    version: 1
};
