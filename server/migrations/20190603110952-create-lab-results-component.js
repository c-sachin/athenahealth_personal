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
        "lab_results_component",
        {
            id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            lab_component_name: {
                type: "text",
                null: true
            },
            lab_component_abbr: {
                type: "varchar",
                length: 100,
                null: true,
                defaultValue: null,
            },
            lab_component_loinc: {
                type: "varchar",
                length: 100,
                null: true,
                defaultValue: null,
            }
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable("lab_results_component", callback);
};

exports._meta = {
    version: 1
};
