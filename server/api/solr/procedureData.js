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
    var sql_query = "SELECT Patient.PatientKey AS Patient_Id, CASE WHEN Patient.PrimaryMRN = '*Deleted' THEN NULL WHEN Patient.PrimaryMRN = '*Unspecified' THEN NULL ELSE Patient.PrimaryMRN END AS Patient_Mrn, Patient.Ssn AS Patient_Ssn, Patient.Name AS Patient_Name, Patient.FirstName AS Patient_First_Name, Patient.MiddleName AS Patient_Middle_Name, Patient.LastName AS Patient_Last_Name, Patient.Sex as Patient_Gender, DATEDIFF(YEAR, Patient.BirthDate, GETDATE()) AS Patient_Age, Patient.BirthDate as Patient_DOB, Patient.FirstRace AS Patient_Race, Patient.MaritalStatus, procedureeventfact.procedureeventkey AS Procedure_Event_Id, procedureeventfact.procedurekey AS Procedure_id, proceduredim.patientfriendlyname AS Procedure_Friendly_Name, proceduredim.Name AS Procedure_Name, proceduredim.code AS Procedure_Code, proceduredim.codeset AS Procedure_CodeSet, proceduredim.cptcode AS Procedure_CptCode, procedureorderfact.type AS Procedure_Order_Type, procedureorderfact.class AS Procedure_Order_Class, procedureorderfact.Source AS Procedure_Order_Source, procedureorderfact.Status AS Procedure_Order_Status, procedureorderfact.Mode AS Procedure_Order_Mode, CASE WHEN procedureorderfact.OrderedDateKey = '-1' THEN NULL WHEN procedureorderfact.OrderedDateKey = '-2' THEN NULL ELSE CONVERT(date, cast(procedureorderfact.OrderedDateKey AS VARCHAR)) END AS Procedure_OrderedDate, procedureorderfact.OrderedTimeOfDayKey AS Procedure_OrderedTimeOfDay, EncounterFact.Type AS Enounter_Type, CASE WHEN EncounterFact.EndDateKey = '-1' THEN NULL WHEN EncounterFact.EndDateKey = '-2' THEN NULL WHEN EncounterFact.EndDateKey = '-3' THEN NULL ELSE CONVERT(date, cast(EncounterFact.EndDateKey AS VARCHAR)) END AS Enounter_EndDate FROM caboodle_nov18.kit.patientdim AS Patient LEFT JOIN caboodle_nov18.kit.procedureeventfact AS ProcedureEventFact ON Patient.patientkey = procedureeventfact.patientkey LEFT JOIN caboodle_nov18.kit.proceduredim AS ProcedureDim ON procedureeventfact.procedurekey = proceduredim.procedurekey LEFT JOIN caboodle_nov18.kit.procedureorderfact AS ProcedureOrderFact ON procedureorderfact.patientkey = Patient.patientkey LEFT JOIN Caboodle_Nov18.Kit.EncounterFact AS EncounterFact ON EncounterFact.EncounterKey = ProcedureOrderFact.EncounterKey WHERE proceduredim.cptcode != ''  AND proceduredim.cptcode != '*Deleted'";
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
						var file_name = '../../solr_json/procedureDataNew.json';
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