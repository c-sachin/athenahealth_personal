const express = require("express");
const dbMssql = require("../../db/dbMssql");
const Solr = require("../../models/solr");
const helpers = require('../../lib/helpers');
const router = express.Router();

router.get("/", async (req, res, next) => {
    return await helpers.generateApiResponse(res, 'solr listed.', 200, []);
});

router.get("/clinical_notes", (req, res, next) => {
    var offsetStart = 1;
    var offsetEnd = 5;
    var startDate = '2019-02-01 00:00:00.000';
    var endDate = '2019-02-28 23:59:59.997';

    var sqlQuery = Solr.getClinicalNoteJson(offsetStart, offsetEnd, startDate, endDate);
    dbMssql.executeQuery(sqlQuery, res, 'Clinical_Note_Text_Fact');
});

router.get("/imaging_notes", (req, res, next) => {
    var offsetStart = 1;
    var offsetEnd = 5;
    var startDate = '2019-02-18 00:00:00.000';
    var endDate = '2019-02-18 23:59:59.997';

    var sqlQuery = Solr.getImagingNoteJson(offsetStart, offsetEnd, startDate, endDate);
    dbMssql.executeQuery(sqlQuery, res, 'Imaging_Text_Fact');
});

router.get("/lab_component_result", (req, res, next) => {
    var offsetStart = 1;
    var offsetEnd = 5;
    var startDate = '2019-02-01 00:00:00.000';
    var endDate = '2019-02-28 23:59:59.997';

    var sqlQuery = Solr.getLabComponentTextJson(offsetStart, offsetEnd, startDate, endDate);
    dbMssql.executeQuery(sqlQuery, res, 'Lab_Component_Result');
});

router.get("/lab_test_notes", (req, res, next) => {
    var offsetStart = 1;
    var offsetEnd = 5;
    var startDate = '2019-02-01 00:00:00.000';
    var endDate = '2019-02-28 23:59:59.997';

    var sqlQuery = Solr.getLabTestNoteJson(offsetStart, offsetEnd, startDate, endDate);
    dbMssql.executeQuery(sqlQuery, res, 'Lab_Test_Note');
});

router.get("/test_data", (req, res, next) => {

    var sqlQuery = Solr.getTestJson();
    dbMssql.executeQuery(sqlQuery, res, 'Lab_Test_Note');
});

router.get("/medication_data", (req, res, next) => {
    var offsetStart = 1;
    var offsetEnd = 5;
    var startDate = '2019-02-01 00:00:00.000';
    var endDate = '2019-02-28 23:59:59.997';

    var sqlQuery = Solr.getMedicationsJson(offsetStart, offsetEnd, startDate, endDate);
    dbMssql.executeQuery(sqlQuery, res, 'Medication_Data');
});

router.get("/diagnosis_data", (req, res, next) => {
    var offsetStart = 1;
    var offsetEnd = 5;
    var startDate = '2019-02-01 00:00:00.000';
    var endDate = '2019-02-28 23:59:59.997';

    var sqlQuery = Solr.getDiagnosisJson(offsetStart, offsetEnd, startDate, endDate);
    dbMssql.executeQuery(sqlQuery, res, 'Diagnosis_Data');
});

router.get("/provider_data", (req, res, next) => {
    var offsetStart = 1;
    var offsetEnd = 5;
    var startDate = '2019-02-01 00:00:00.000';
    var endDate = '2019-02-28 23:59:59.997';

    var sqlQuery = Solr.getProviderJson(offsetStart, offsetEnd, startDate, endDate);
    dbMssql.executeQuery(sqlQuery, res, 'Provider_Data');
});

router.get("/procedure_data", (req, res, next) => {
    var offsetStart = 1;
    var offsetEnd = 5;
    var startDate = '2019-02-01 00:00:00.000';
    var endDate = '2019-02-28 23:59:59.997';

    var sqlQuery = Solr.getProcedureJson(offsetStart, offsetEnd, startDate, endDate);
    dbMssql.executeQuery(sqlQuery, res, 'Procedure_Data');
});

router.get("/patient_data", (req, res, next) => {
    var sqlQuery = Solr.getPatientCount();
    dbMssql.executeCountQuery(sqlQuery, res, 'Patient_data');

});

router.get("/diagnosis_master", (req, res, next) => {
    var sqlQuery = Solr.getDiagnosisMasterCount();
    dbMssql.executeCountQuery(sqlQuery, res, 'Diagnosis_master');
});

router.get("/flowsheet_data", (req, res, next) => {
    var offsetStart = 1;
    var offsetEnd = 5;
    var startDate = '2019-02-01 00:00:00.000';
    var endDate = '2019-02-28 23:59:59.997';

    var sqlQuery = Solr.getFlowsheetJson(offsetStart, offsetEnd, startDate, endDate);
    dbMssql.executeQuery(sqlQuery, res, 'Flowsheet_Data');
});

router.get("/:patientId", async (req, res, next) => {

    var Patient_Key = req.params.patientId;
    var sqlQuery = Solr.getPatientByPatientKey(Patient_Key);
    if (sqlQuery != false) {
        db.executeQuery(sqlQuery, res);
    }
    else {
        return await helpers.generateApiResponse(res, 'Invalid Patient Id.', 400, []);
    }
});


module.exports = router;