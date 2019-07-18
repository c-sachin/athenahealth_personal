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
    var sql_query = "SELECT Patient.PatientKey AS Patient_Id, CASE WHEN Patient.PrimaryMRN = '*Deleted' THEN NULL WHEN Patient.PrimaryMRN = '*Unspecified' THEN NULL ELSE Patient.PrimaryMRN END AS Patient_Mrn, Patient.Ssn AS Patient_Ssn, Patient.Name AS Patient_Name, Patient.FirstName AS Patient_First_Name, Patient.MiddleName AS Patient_Middle_Name, Patient.LastName AS Patient_Last_Name, Patient.Sex as Patient_Gender, DATEDIFF(YEAR, Patient.BirthDate, GETDATE()) AS Patient_Age, Patient.BirthDate as Patient_DOB, Patient.FirstRace AS Patient_Race, Patient.MaritalStatus, LabComponentResultFact.LabComponentResultKey AS Fact_Id, LabComponentResultFact.ResultStatus AS Result_Status, LabComponentResultFact.Value AS Result_Value, LabComponentResultFact.NumericValue AS Result_Numeric_Value, LabComponentResultFact.Unit AS Result_Unit, LabComponentResultFact.ReferenceValues AS Result_Reference_Values, LabComponentResultFact.Abnormal AS Result_Abnormal_Flag, LabComponentDim.Name AS LabComponent_Name, LabComponentDim.Abbreviation AS LabComponent_Abbreviation, LabComponentDim.LoincCode AS LabComponent_LoincCode, LabComponentResultTextFact.LabComponentResultTextKey AS Fact_Text_Id, '' AS Free_Text_Type, 'Lab Component Result Notes' AS Free_Text_Category, LabComponentResultTextFact.Comment AS Free_Text_1, '' as Free_Text_2, '' as Free_Text_3, LabComponentResultTextFact.Status_CreationInstant as Created_on, LabComponentResultTextFact.Status_LastUpdatedDate as Modified_on FROM Caboodle_Nov18.Kit.PatientDim AS Patient LEFT JOIN Caboodle_Nov18.Kit.LabComponentResultFact AS LabComponentResultFact ON LabComponentResultFact.PatientKey = Patient.PatientKey LEFT JOIN Caboodle_Nov18.Kit.LabComponentDim AS LabComponentDim ON LabComponentDim.LabComponentKey = LabComponentResultFact.LabComponentKey LEFT JOIN Caboodle_Nov18.Kit.LabComponentResultTextFact AS LabComponentResultTextFact ON LabComponentResultTextFact.LabComponentResultKey = LabComponentResultFact.LabComponentResultKey";
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
						var file_name = '../../solr_json/labComponentResultDataNew.json';
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