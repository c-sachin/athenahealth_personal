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
        "m_facility_users",
        {
            m_facility_user_id: {
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
            user_type: {
                type: "smallint",
                length: 6,
                null: true
            },
            m_facility_user_name: {
                type: "varchar",
                length: 255,
                null: true
            },
            m_facility_epicuser_id: {
                type: "varchar",
                length: 100,
                null: true
            },
            m_facility_user_active: {
                type: "smallint",
                length: 6,
                null: true,
                defaultValue: 1
            },
            remember_token: {
                type: "varchar",
                length: 100,
                null: true
            },
            m_added: {
                type: "timestamp",
                null: true
            },
            is_deleted: {
                type: "tinyint",
                null: true,
                length: 1,
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
    db.dropTable("m_facility_users", callback);
};

exports._meta = {
    version: 1
};
