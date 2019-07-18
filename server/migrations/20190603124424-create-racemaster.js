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
        "racemaster",
        {
            race_id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            race_name: {
                type: "varchar",
                length: 50,
                null: true
            },
            race_active: {
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
    db.dropTable("racemaster", callback);
};

exports._meta = {
    version: 1
};
