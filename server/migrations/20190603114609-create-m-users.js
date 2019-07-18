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
        'm_users',
        {
            user_id: {
                type: 'bigint',
                length: 20,
                primaryKey: true,
                autoIncrement: true,
            },
            user_name: {
                type: 'varchar',
                length: 255,
                null: true,
            },
            user_email: {
                type: 'varchar',
                length: 100,
                null: true,
            },
            user_pwd: {
                type: 'varchar',
                length: 255,
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
                defaultValue: 0
            },
            remember_token: {
                type: 'varchar',
                length: 100,
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
    db.dropTable('m_users', callback);
};

exports._meta = {
    version: 1,
};
