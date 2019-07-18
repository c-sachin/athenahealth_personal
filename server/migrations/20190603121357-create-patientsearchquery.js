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
        'patientsearchquery',
        {
            psq_id: {
                type: 'bigint',
                length: 20,
                primaryKey: true,
                autoIncrement: true,
            },
            psq_name: {
                type: 'text',
                null: true,
            },
            psq_created_timestamp: {
                type: 'timestamp',
                null: true,
            },
            psq_user_id: {
                type: 'bigint',
                length: 20,
                null: true,
            },
            psq_active: {
                type: 'varchar',
                length: 50,
                null: true,
            },
            solar_query_repsonse: {
                type: 'longtext',
                null: true,
            },
            solar_query_reponse_patients_cnt: {
                type: 'varchar',
                length: 11,
                null: true,
            },
            query_run_updated_at: {
                type: 'timestamp',
                null: true,
            },
            psq_daily_query_id: {
                type: "bigint",
                length: 20,
                null: true,
                defaultValue: null,
            },
            baa_baa_id: {
                type: "bigint",
                length: 20,
                null: true,
                defaultValue: null,
            },
            is_deleted: {
                type: 'tinyint',
                length: 1,
                null: true,
                defaultValue: 0,
            },
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable('patientsearchquery', callback);
};

exports._meta = {
    version: 1,
};
