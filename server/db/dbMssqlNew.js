require('dotenv').config({ path: '/opt/agora/server/.env' });
const mssql = require("mssql");
const helpers = require("../lib/helpers");
const dbMysql = require("../db/dbMysql");

var config = {
    server: 'kit-archive.epic.com',
    database: 'Caboodle_Nov18',
    user: 'Kit-v-3865202-001',
    password: 'oliv3Ant99',
    port: 1433,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    max: 10,
    min: 1,
};

//Function to connect to database and execute query
var executeQuery = function (sql_query, message_title = '', file_counter = 0) {
    console.log(sql_query);
    mssql.close();
    mssql.connect(config, function (err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
        }
        else {
            // create Request object
            var request = new mssql.Request();
            // query to the database
            request.query(sql_query, function (err1, recordset) {
                if (err1) {
                    console.log("Error while querying database :- " + err1);
                }
                else {
                    var message = 'Success';
                    console.log(recordset);
                    var sqlQuery1 = 'INSERT INTO diagnosismaster (`diagnosis_name`,`diagnosis_code_type`,`diagnosis_code`) VALUES ("Abdominal pain", "ICD-9-CM", "789.0")';
                    dbMysql.query(sqlQuery1, function (err, result) {
                        if (err) throw err;
                        console.log("1 record inserted");
                    });
                }
            });
        }
    });
}

/**/
//Function to connect to database and execute count query
var executeCountQuery = function (sql_query, res, file_name) {
    console.log(config);
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
                    var dataCount = recordset.recordset[0].DataCount;
                    var file_name = '../solr_json/diagnosis_test.json';
                    const fs = require('fs');
                    fs.writeFile(file_name, JSON.stringify(recordset.recordset), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        return true;
                    });
                    console.log(file_name + ' File created.');
                    var counter = parseInt(dataCount / 500);
                    var offset_start = 0;
                    var offset_end = 500;
                    count = 0;
                }
            });
        }
    });
}

module.exports = {
    executeQuery: executeQuery
}
module.exports.executeCountQuery = executeCountQuery;