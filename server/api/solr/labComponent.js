require('dotenv').config({ path: '/opt/agora/server/.env' });
const mssql = require("mssql");
const dbMysql = require("../../db/dbMysql");

var config = {
    server: process.env.MSSQL_DB_SERVER,
    database: process.env.MSSQL_DB_DATABASE,
    user: process.env.MSSQL_DB_USER,
    password: process.env.MSSQL_DB_PASSWORD,
    port: parseInt(process.env.MSSQL_DB_PORT),
    connectionTimeout: 300000,
    requestTimeout: 300000,
    max: parseInt(process.env.MSSQL_DB_MAX_CON),
    min: parseInt(process.env.MSSQL_DB_MIN_CON),
};

executeQuery();

function executeQuery() {
    var sql_query = 'SELECT DISTINCT Name, Abbreviation, LoincCode FROM LabComponentDim';
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
                    var importData = recordset.recordset;
                    if (importData.length > 0) {
                        importData.forEach(function (element, ind) {
                            var displayString = element.Name.replace(/\"/g, "");
                            displayString = displayString.replace(/\'/g, '');
                            var abbreviation = element.Abbreviation.replace(/\"/g, "");
                            abbreviation = abbreviation.replace(/\'/g, '');

                            var sqlQuery1 = 'INSERT INTO lab_results_component (`lab_component_name`,`lab_component_abbr`,`lab_component_loinc`) VALUES ("' + displayString + '", "' + abbreviation + '", "' + element.LoincCode + '")';
                            dbMysql.query(sqlQuery1, function (err, result) {
                                if (err) throw err;
                            });
                            if ((ind % 1000) == 0) {
                                console.log(" " + ind + " records inserted");
                            }
                        });
                    }
                }
            });
        }
    });
}