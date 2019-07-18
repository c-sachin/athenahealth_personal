"use strict";

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
        "ordersresultsmaster",
        {
            order_result_id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            order_result_name: {
                type: "text",
                null: true
            },
            order_result_cpt_code: {
                type: "varchar",
                length: 50,
                null: true
            },
            order_result_loinc_code: {
                type: "varchar",
                length: 100,
                null: true
            },
            order_result_active: {
                type: "varchar",
                length: 50,
                null: true,
                defaultValue: 1
            }
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable("ordersresultsmaster", callback);
};

exports._meta = {
    version: 1
};
