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
        'm_department',
        {
            department_id: {
                type: 'bigint',
                length: 20,
                primaryKey: true,
                autoIncrement: true,
            },
            f_facility_id: {
                type: 'int',
                length: 11,
                null: true,
            },
            facility_survey_campaign_id: {
                type: 'varchar',
                length: 10,
                null: true,
            },
            departmentid: {
                type: 'varchar',
                length: 10,
                null: true,
            },
            department_name: {
                type: 'varchar',
                length: 100,
                null: true,
            },
            department_phone: {
                type: 'varchar',
                length: 20,
                null: true,
            },
            department_fax: {
                type: 'varchar',
                length: 20,
                null: true,
            },
            department_address: {
                type: 'text',
                null: true,
            },
            department_city: {
                type: 'varchar',
                length: 50,
                null: true,
            },
            department_state: {
                type: 'varchar',
                length: 50,
                null: true,
            },
            department_zip: {
                type: 'varchar',
                length: 10,
                null: true,
            },
            department_is_deleted: {
                type: 'tinyint',
                length: 4,
                null: true,
            },
            department_appointment_added_at: {
                type: 'timestamp',
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
    db.dropTable('m_department', callback);
};

exports._meta = {
    version: 1,
};