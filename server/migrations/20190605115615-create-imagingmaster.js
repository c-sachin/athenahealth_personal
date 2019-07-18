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
        'imagingmaster',
        {
            imaging_id: {
                type: 'bigint',
                length: 20,
                primaryKey: true,
                autoIncrement: true,
            },
            imaging_name: {
                type: 'varchar',
                length: 500,
                null: true,
            },
            procedure_key: {
                type: 'varchar',
                length: 100,
                null: true,
            },
            procedure_code: {
                type: 'varchar',
                length: 100,
                primaryKey: true,
                autoIncrement: true,
            },
            code_set_type: {
                type: 'varchar',
                length: 100,
                primaryKey: true,
                autoIncrement: true,
            },
            imaging_active: {
                type: 'tinyint',
                length: 1,
                null: true,
                deafultValue: 1,
            },
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable('imagingmaster', callback);
};

exports._meta = {
    "version": 1
};
