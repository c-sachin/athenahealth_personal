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
        'variable_type',
        {
            variable_type_id: {
                type: 'bigint',
                length: 20,
                primaryKey: true,
                autoIncrement: true,
            },
            variable_type_name: {
                type: 'varchar',
                length: 50,
                null: true,
            },
            variable_added: {
                type: 'varchar',
                length: 100,
                null: true,
            },
            variable_active: {
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
    db.dropTable('variable_type', callback);
};

exports._meta = {
    "version": 1
};
