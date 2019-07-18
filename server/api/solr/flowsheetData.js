require('dotenv').config({ path: '/opt/agora/server/.env'});
const mssql = require("mssql");
const dbMysql = require("../../db/dbMysql");

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
    var sql_query = "SELECT Patient.PatientKey AS Patient_Id, CASE WHEN Patient.PrimaryMRN = '*Deleted' THEN NULL WHEN Patient.PrimaryMRN = '*Unspecified' THEN NULL ELSE Patient.PrimaryMRN END AS Patient_Mrn, Patient.Ssn AS Patient_Ssn, Patient.Name AS Patient_Name, Patient.FirstName AS Patient_First_Name, Patient.MiddleName AS Patient_Middle_Name, Patient.LastName AS Patient_Last_Name, Patient.Sex as Patient_Gender, DATEDIFF(YEAR, Patient.BirthDate, GETDATE()) AS Patient_Age, Patient.BirthDate as Patient_DOB, Patient.FirstRace AS Patient_Race, Patient.MaritalStatus, CASE WHEN FlowsheetValueFact.DateKey = '-1' THEN NULL ELSE CONVERT(date, cast(FlowsheetValueFact.DateKey AS VARCHAR)) END AS Flowsheet_Date, FlowsheetValueFact.TimeOfDayKey AS Flowsheet_TimeOfDay, FlowsheetValueFact.Value AS Flowsheet_Value, FlowsheetRowDim.Name AS Flowsheet_Name, FlowsheetRowDim.DisplayName AS Flowsheet_DisplayName, FlowsheetRowDim.Description AS Flowsheet_Description FROM Caboodle_Nov18.Kit.PatientDim AS Patient LEFT JOIN Caboodle_Nov18.Kit.FlowsheetValueFact AS FlowsheetValueFact ON Patient.patientkey = FlowsheetValueFact.PatientKey LEFT JOIN Caboodle_Nov18.Kit.FlowsheetRowDim AS FlowsheetRowDim ON FlowsheetRowDim.FlowsheetRowKey = FlowsheetValueFact.FlowsheetRowKey WHERE FlowsheetRowDim.DisplayName IS NOT NULL AND Patient.PatientKey > 0";
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
						var file_name = '../../solr_json/flowsheetDataNew.json';
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