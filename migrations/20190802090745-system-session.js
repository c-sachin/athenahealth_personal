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
        "system_session",
        {
            id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            ehr_id: {
                type: "varchar",
                length: 100,
                null: true
            },
            system_user_id: {
                type: "varchar",
                length: 100,
                null: true
            },
            utype: {
                type: "tinyint",
                length: 2,
                null: true
            },
            access_token: {
                type: "varchar",
                length: 255,
                null: true
            },
            refresh_token: {
                type: "varchar",
                length: 255,
                null: true
            },
            sys_session_id: {
                type: "varchar",
                length: 255,
                null: true
            },
            session_started_at: {
                type: "timestamp",
                null: true
            },
            session_expires_in: {
                type: "varchar",
                length: 15,
                null: true
            },
            session_expires_at: {
                type: "timestamp",
                null: true
            },
            added_at: {
                type: "datetime",
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
    db.dropTable("system_session", callback);
};

exports._meta = {
    version: 1
};
