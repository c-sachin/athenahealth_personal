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
        "patientdemographics",
        {
            demographicsId: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            m_added: {
                type: "timestamp",
                null: true
            },
            demographicsName: {
                type: "varchar",
                length: 100,
                null: true
            },
            active: {
                type: "smallint",
                length: 6,
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
    db.dropTable("patientdemographics", callback);
};

exports._meta = {
    version: 1
};
