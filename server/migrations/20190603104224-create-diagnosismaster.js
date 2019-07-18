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
        "diagnosismaster",
        {
            diagnosis_id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            diagnosis_name: {
                type: "longtext",

                null: true
            },
            diagnosis_code_type: {
                type: "varchar",
                length: 255,
                null: true
            },

            diagnosis_code: {
                type: "varchar",
                length: 100,
                null: true
            },
            order_actve: {
                type: "tinyint",
                length: 1,
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
    db.dropTable("diagnosismaster", callback);
};

exports._meta = {
    version: 1
};
