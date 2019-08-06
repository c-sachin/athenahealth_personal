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
        "m_facility_settings",
        {
          facility_settings_id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            f_facility_id: {
                type: "int",
                length: 11,
                null: true
            },
            facility_practice_id: {
                type: "int",
                length: 11,
                null: true
            },
            facility_survey_token: {
                type: "varchar",
                length: 255,
                null: true
            },
            facility_fhir_id: {
                type: "varchar",
                length: 50,
                null: true
            },
            facility_fhir_secret: {
                type: "varchar",
                length: 100,
                null: true
            },
            facility_is_deleted: {
                type: "tinyint",
                length: 1,
                null: true
            },
            facility_added_at: {
                type: "timestamp",
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
    db.dropTable("m_facility_settings", callback);
};

exports._meta = {
    version: 1
};
