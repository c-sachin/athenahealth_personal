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
    var sql_query = "SELECT TOP 500000 Patient.PatientKey AS Patient_Id, CASE WHEN Patient.PrimaryMRN = '*Deleted' THEN NULL WHEN Patient.PrimaryMRN = '*Unspecified' THEN NULL ELSE Patient.PrimaryMRN END AS Patient_Mrn, Patient.Ssn AS Patient_Ssn, Patient.Name AS Patient_Name, Patient.FirstName AS Patient_First_Name, Patient.MiddleName AS Patient_Middle_Name, Patient.LastName AS Patient_Last_Name, Patient.Sex as Patient_Gender, DATEDIFF(YEAR, Patient.BirthDate, GETDATE()) AS Patient_Age, Patient.BirthDate as Patient_DOB, Patient.FirstRace AS Patient_Race, Patient.MaritalStatus, MedicationOrderFact.OrderName AS Medication_Name, MedicationOrderFact.Frequency AS Medication_Frequency, MedicationOrderFact.Route AS Medication_Route, MedicationOrderFact.QuantityUnit AS Medication_QuantityUnit, MedicationOrderFact.DoseUnit AS Medication_DoseUnit, CASE WHEN MedicationOrderFact.StartDateKey = '-1' THEN NULL WHEN MedicationOrderFact.StartDateKey = '-2' THEN NULL WHEN MedicationOrderFact.StartDateKey = '-3' THEN NULL ELSE  CONVERT(date, cast(MedicationOrderFact.StartDateKey AS VARCHAR)) END AS Medication_StartDate, CASE WHEN MedicationOrderFact.EndDateKey = '-1' THEN NULL WHEN MedicationOrderFact.EndDateKey = '-2' THEN NULL WHEN MedicationOrderFact.EndDateKey = '-3' THEN NULL ELSE CONVERT(date, cast(MedicationOrderFact.EndDateKey as VARCHAR)) END AS Medication_EndDate, CASE WHEN MedicationOrderFact.DiscontinuedDateKey = '-1' THEN NULL WHEN MedicationOrderFact.DiscontinuedDateKey = '-2' THEN NULL WHEN MedicationOrderFact.DiscontinuedDateKey = '-3' THEN NULL ELSE CONVERT(date, cast(MedicationOrderFact.DiscontinuedDateKey AS VARCHAR)) END AS Medication_DiscontinuedDate, MedicationOrderFact.DiscontinuedTimeOfDayKey AS Medication_DiscontinuedTime, CASE WHEN MedicationOrderFact.OrderedDateKey = '-1' THEN NULL WHEN MedicationOrderFact.OrderedDateKey = '-2' THEN NULL WHEN MedicationOrderFact.OrderedDateKey = '-3' THEN NULL ELSE CONVERT(date, cast(MedicationOrderFact.OrderedDateKey as VARCHAR )) END AS Medication_OrderedDate, MedicationOrderFact.AssociatedDiagnosisComboKey AS Medication_AssociatedDiagnosis, MedicationOrderFact.NumberOfDoses AS Medication_NumberOfDoses, MedicationOrderFact.RefillsWritten AS Medication_RefillsWritten, MedicationOrderFact.MinimumDose AS Medication_MinimumDose, MedicationOrderFact.MaximumDose AS Medication_MaximumDose, MedicationOrderFact.Quantity AS Medication_Quantity, MedicationDim.Form AS Medication_Form, MedicationDim.PharmaceuticalClass AS Medication_PharmaceuticalClass, MedicationDim.PharmaceuticalSubClass AS Medication_PharmaceuticalSubClass,  MedicationDim.GenericName AS Medication_GenericName, MedicationDim.Gpi AS Medication_Gpi, EncounterFact.Type AS Enounter_Type, CASE WHEN EncounterFact.EndDateKey = '-1' THEN NULL WHEN EncounterFact.EndDateKey = '-2' THEN NULL WHEN EncounterFact.EndDateKey = '-3' THEN NULL ELSE CONVERT(date, cast(EncounterFact.EndDateKey AS VARCHAR)) END AS Enounter_EndDate FROM Caboodle_Nov18.Kit.PatientDim AS Patient LEFT JOIN Caboodle_Nov18.Kit.MedicationOrderFact AS MedicationOrderFact ON MedicationOrderFact.PatientKey = Patient.PatientKey LEFT JOIN Caboodle_Nov18.Kit.MedicationDim AS MedicationDim ON MedicationDim.MedicationKey = MedicationOrderFact.MedicationKey LEFT JOIN Caboodle_Nov18.Kit.EncounterFact AS EncounterFact ON MedicationOrderFact.EncounterKey = EncounterFact.EncounterKey ";
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
						var file_name = '../../solr_json/medication_data.json';
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