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
        'm_appointment',
        {
            appointment_id: {
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
            practice_id: {
                type: 'int',
                length: 11,
                null: true,
            },
            departmentid: {
                type: 'varchar',
                length: 10,
                null: true,
            },
            patient_id: {
                type: 'int',
                length: 11,
                null: true,
            },
            patient_fname: {
                type: 'varchar',
                length: 100,
                null: true,
            },
            patient_lname: {
                type: 'varchar',
                length: 100,
                null: true,
            },
            patient_email: {
                type: 'varchar',
                length: 100,
                null: true,
            },
            patient_mobileno: {
                type: 'int',
                length: 11,
                null: true,
            },
            patient_homephone: {
                type: 'int',
                length: 11,
                null: true,
            },
            patient_address1: {
                type: 'text',
                null: true,
            },
            patient_city: {
                type: 'varchar',
                length: 50,
                null: true,
            },
            patient_zip: {
                type: 'varchar',
                length: 50,
                null: true,
            },
            patient_sex: {
                type: 'varchar',
                length: 50,
                null: true,
            },
            patient_state: {
                type: 'varchar',
                length: 50,
                null: true,
            },
            patient_country: {
                type: 'varchar',
                length: 50,
                null: true,
            },
            appointmentid: {
                type: 'int',
                length: 11,
                null: true,
            },
            appointment_date: {
                type: 'date',
                null: true,
            },
            appointment_encounter_id: {
                type: 'int',
                length: 11,
                null: true,
            },
            appointment_type: {
                type: 'tinytext',
                null: true,
            },
            appointment_starttime: {
                type: 'varchar',
                length: 10,
                null: true,
            },
            appointment_survey_send_status: {
                type: 'tinyint',
                length: 1,
                null: true,
                defaultValue: 1,
            },
            appointment_survey_send_message: {
                type: 'text',
                null: true,
            },
            appointment_feedback_status: {
              type: 'tinyint',
              length: 1,
              null: true,
              defaultValue: 1,
            },
            appointment_feedback_response: {
                type: 'text',
                null: true,
            },
            appointment_feedback_score: {
              type: 'varchar',
              length: 10,
              null: true,
            },
            appointment_added_at: {
              type: 'timestamp',
              null: true,
            },
            appointment_updated_at: {
              type: 'timestamp',
              null: true,
            },
            appointment_is_deleted: {
              type: 'tinyint',
              length: 4,
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
    db.dropTable('m_appointment', callback);
};

exports._meta = {
    version: 1,
};