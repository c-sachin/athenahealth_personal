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
        'm_facility',
        {
            m_facility_id: {
                type: 'bigint',
                length: 20,
                primaryKey: true,
                autoIncrement: true,
            },
            m_facility_nm: {
                type: 'varchar',
                length: 255,
                null: true,
            },
            m_facility_app_id: {
                type: 'varchar',
                length: 255,
                null: true,
            },
            m_facility_owner_nm: {
                type: 'varchar',
                length: 100,
                null: true,
            },
            m_added: {
                type: 'timestamp',
                null: true,
            },
            is_deleted: {
                type: 'tinyint',
                length: 1,
                null: true,
                defaultValue: 0,
            },
            m_facility_active: {
                type: 'smallint',
                length: 6,
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
    db.dropTable('m_facility', callback);
};

exports._meta = {
    version: 1,
};
