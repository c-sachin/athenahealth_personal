'use strict';

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
        'providers',
        {
            id: {
                type: 'bigint',
                length: 20,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: 'varchar',
                length: 300,
                null: true,
            },
            npi: {
                type: 'varchar',
                length: 50,
                null: true,
            },
            type: {
                type: 'varchar',
                length: 300,
                null: true,
            },
            department: {
                type: 'varchar',
                length: 300,
                null: true,
            },
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable('providers', callback);
};

exports._meta = {
    version: 1,
};
