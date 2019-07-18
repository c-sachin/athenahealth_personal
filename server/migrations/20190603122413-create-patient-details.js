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
        "patient_details",
        {
            id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            patient_mrn: {
                type: "varchar",
                length: 20,
                null: true
            },
            patient_name: {
                type: "varchar",
                length: 255,
                null: true
            },
            patient_dob: {
                type: "date",
                null: true
            },
            patient_gender: {
                type: "varchar",
                length: 20,
                null: true
            },
            patient_race: {
                type: "varchar",
                length: 100,
                null: true
            },
            patient_age: {
                type: "int",
                length: 4,
                null: true
            },
            marital_status: {
                type: "varchar",
                length: 50,
                null: true
            },
            active: {
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
    db.dropTable("patient_details", callback);
};

exports._meta = {
    version: 1
};
