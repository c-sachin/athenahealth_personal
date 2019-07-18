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
        'variable_values',
        {
            variable_value_id: {
                type: 'bigint',
                length: 20,
                primaryKey: true,
                autoIncrement: true,
            },
            variable_value_name: {
                type: 'varchar',
                length: 50,
                null: true,
            },
            variable_type: {
                type: 'smallint',
                length: 6,
                null: true,
            },
            variable_value_active: {
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
    db.dropTable('variable_values', callback);
};

exports._meta = {
    "version": 1
};
