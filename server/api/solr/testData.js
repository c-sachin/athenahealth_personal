require('dotenv').config({ path: '/opt/agora/server/.env'});
const mssql = require("mssql");

var config = {
    server: process.env.MSSQL_DB_SERVER,
    database: 'Caboodle_Feb19',
    user: process.env.MSSQL_DB_USER,
    password: process.env.MSSQL_DB_PASSWORD,
    port: parseInt(process.env.MSSQL_DB_PORT),
    connectionTimeout: 300000,
    requestTimeout: 300000,
    max: parseInt(process.env.MSSQL_DB_MAX_CON),
    min: parseInt(process.env.MSSQL_DB_MIN_CON),
};

executeQuery ();

function executeQuery(){
	var sql_query = "SELECT TOP 10 Narrative FROM ImagingTextFact WHERE Narrative LIKE '%Nuclear Medicine%'";
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
					if(importData.length > 0){
						const fs = require('fs');
						var file_name = '../../solr_json/testDataNew.json';
						fs.writeFile(file_name, JSON.stringify(recordset.recordset), function(err) {
							if(err) {
								return console.log(err);
							}
							return true;
						});
						console.log(file_name +' File created.');
					}
				}
			});
		}
	});	
}