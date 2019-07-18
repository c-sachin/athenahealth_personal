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
        'vital_signs',
        {
            vital_signs_id: {
                type: 'bigint',
                length: 20,
                primaryKey: true,
                autoIncrement: true,
            },
            vital_signs_name: {
                type: 'varchar',
                length: 500,
                null: true,
            },
            vital_signs_active: {
                type: 'tinyint',
                length: 1,
                null: true,
                deafultValue: 0,
            },
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable('vital_signs', callback);
};

exports._meta = {
    version: 1,
};
