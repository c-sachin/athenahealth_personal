require('dotenv').config();
const mssql = require("mssql");
const helpers = require("../lib/helpers");
const Solr = require("../models/solr");
var async = require('async');

// config for your database
var config = {
    server: process.env.MSSQL_DB_SERVER,
    database: process.env.MSSQL_DB_DATABASE,
    user: process.env.MSSQL_DB_USER,
    password: process.env.MSSQL_DB_PASSWORD,
    port: parseInt(process.env.MSSQL_DB_PORT),
    connectionTimeout: parseInt(process.env.MSSQL_DB_CON_TIMEOUT),
    requestTimeout:parseInt(process.env.MSSQL_DB_REQ_TIMEOUT),
    max: parseInt(process.env.MSSQL_DB_MAX_CON),
    min: parseInt(process.env.MSSQL_DB_MIN_CON),
};

//Function to connect to database and execute query
var executeQuery = function (sql_query, res, message_title = '', file_counter = 0) {
    mssql.close();
    mssql.connect(config, function (err) {
        if (err) {
            return helpers.generateApiResponse(res, 'Error while connecting database.', 400, err);
        }
        else {
            // create Request object
            var request = new mssql.Request();
            // query to the database
            request.query(sql_query, function (err1, recordset) {
                if (err1) {
                    return helpers.generateApiResponse(res, 'Error while querying database.', 400, err1);
                }
                else {
                    var message = 'Success';
                    if (message_title != '') {
                        message = message_title;
                        var jsonData = {
                            data: recordset.recordset
                        };
                        return helpers.generateApiResponse(res, 'Data found.', 200, jsonData);
                    }
                    else {
                        return helpers.generateApiResponse(res, 'Data found.', 200, {
                            message: message,
                            data: recordset
                        });
                    }
                }
            });
        }
    });
}

/**/
//Function to connect to database and execute count query
var executeCountQuery = function (sql_query, res, file_name) {
    mssql.close();
    mssql.connect(config, function (err) {
        if (err) {
            return helpers.generateApiResponse(res, 'Error while connecting database.', 400, err);
        }
        else {
            // create Request object
            var request = new mssql.Request();
            // query to the database
            request.query(sql_query, function (err1, recordset) {
                if (err1) {
                    return helpers.generateApiResponse(res, 'Error while querying database.', 400, err1);
                }
                else {
                    var dataCount = recordset.recordset[0].Patient_Count;
                    var counter = parseInt(dataCount / 500);
                    var offset_start = 0;
                    var offset_end = 500;

                    count = 0;

                    async.whilst(
                        function () { return count <= counter; },
                        function (callback) {
                            count++;
                            var sql_query1 = Solr.getPatientJson(offset_start, offset_end);
                            executeQuery(sql_query1, res, file_name, count);
                            offset_start = offset_end;
                            offset_end = offset_end + 500;
                            setTimeout(callback, 1000);
                        },
                        function (err, result) {
                            if (err) { };
                        }
                    );
                    return helpers.generateApiResponse(res, 'Process done.', 200, {
                        'Process': 'Done'
                    });
                }
            });
        }
    });
}

var executeFile = function (sql_query, res, message_title = '', file_counter = 0) {
    const fs = require('fs');
    fs.writeFile('./solr_json/' + message_title + '_' + file_counter + '.json', JSON.stringify(sql_query), function (err) {
        if (err) {
            return console.log(err);
        }
        return true;
    });
}

module.exports = {
    executeQuery: executeQuery
}
module.exports.executeCountQuery = executeCountQuery; 