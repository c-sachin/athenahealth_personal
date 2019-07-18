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
        "problemconditionmaster",
        {
            problem_condition_id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            problem_condition_name: {
                type: "text",
                null: true
            },
            problem_condition_type: {
                type: "varchar",
                length: 100,
                null: true
            },
            problem_condition_snomed_code: {
                type: "varchar",
                length: 100,
                null: true
            },
            problem_condition_active: {
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
    db.dropTable("problemconditionmaster", callback);
};
exports._meta = {
    version: 1
};
