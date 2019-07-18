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
        "pdq_criterion",
        {
            pdqc_criterion_id: {
                type: "bigint",
                length: 20,
                primaryKey: true,
                autoIncrement: true
            },
            pdqc_frequency: {
                type: "varchar",
                length: 100,
                null: true
            },
            pdqc_variable_id: {
                type: "int",
                length: 11,
                null: true
            },
            pdqc_variable_option_selected: {
                type: "varchar",
                length: 100,
                null: true
            },
            pdqc_variable_period_seleted: {
                type: "varchar",
                length: 100,
                null: true
            },
            pdqc_variable_value_seleted: {
                type: "varchar",
                length: 100,
                null: true
            },
            pdqc_pdq_id: {
                type: "int",
                length: 11,
                null: true
            },
            pdqc_variable_solr_querytxt: {
                type: "longtext",

                null: true
            }
        },
        function (err) {
            if (err) return callback(err);
            return callback();
        }
    );
};

exports.down = function (db, callback) {
    db.dropTable("pdq_criterion", callback);
};

exports._meta = {
    version: 1
};
