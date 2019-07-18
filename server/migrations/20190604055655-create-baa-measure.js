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
        'baa_measure', {
            baa_measure_id: {
                type: 'bigint',
                length: 20,
                primaryKey: true,
                autoIncrement: true,
            },
            baa_intervention_type: {
                type: 'varchar',
                length: 100,
                null: true,
                defaultValue: null,
            },
            baa_intervention_code: {
                type: 'varchar',
                length: 255,
                null: true,
                defaultValue: null,
            },
            baa_measure_type: {
                type: 'text',
                null: true,
                defaultValue: null,
            },
            baa_measure_baa_id: {
                type: 'int',
                length: 11,
                null: true,
                defaultValue: null,
            },
            baa_measure_code: {
                type: 'varchar',
                length: 255,
                null: true,
                defaultValue: null,
            },
            baa_measure_value_selected: {
                type: 'varchar',
                length: 100,
                null: true,
                defaultValue: null,
            },
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable('baa_measure', callback);
};

exports._meta = {
    version: 1,
};