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
        'baa', {
            baa_id: {
                type: 'bigint',
                length: 20,
                primaryKey: true,
                autoIncrement: true,
            },
            baa_name: {
                type: 'text',
                null: true,
                defaultValue: null,
            },

            baa_user_id: {
                type: 'bigint',
                length: 20,
                null: true,
                defaultValue: null,
            },
            baa_created_timestamp: {
                type: 'timestamp',
                null: true,
                defaultValue: null,
            },

            baa_intervention_timestamp: {
                type: 'timestamp',
                null: true,
                defaultValue: null,
            },
            baa_active: {
                type: 'varchar',
                length: 50,
                null: true,
                defaultValue: 1,
            },
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable('baa', callback);
};

exports._meta = {
    version: 1,
};