const express = require("express");
const dbMysql = require("../db/dbMysql");
const searchDataModel = require("../models/searchDataModel");
const helpers = require('../lib/helpers');
const router = express.Router();

const resultLimit = 100;

// Search medication by name
router.get("/medication", async (req, res, next) => {
    var key = req.query.search;
    if (key.length < 3) {
        return await helpers.generateApiResponse(res, 'Please enter atleast 3 characters.', 400, []);
    }

    var medicationSearchQuery = searchDataModel.searchMedication(key, resultLimit);
    var [medicationRows] = await dbMysql.query(medicationSearchQuery);
    if (typeof medicationRows == 'undefined' || medicationRows.length <= 0) {
        return await helpers.generateApiResponse(res, `No medication found for search: ${key}|No medication found.`, 400, []);
    }

    var data = {
        count: medicationRows.length,
        data: medicationRows
    };
    
    return await helpers.generateApiResponse(res, `${medicationRows.length} Medications found for search: ${key}|Medication found.`, 200, data);
});

// Search procedure by name
router.get("/procedure", async (req, res, next) => {
    var key = req.query.search;
    if (key.length < 3) {
        return await helpers.generateApiResponse(res, 'Please enter atleast 3 characters.', 400, []);
    }

    var procedureSearchQuery = searchDataModel.searchProcedure(key, resultLimit);
    var [procedurRows] = await dbMysql.query(procedureSearchQuery);

    if (typeof procedurRows == 'undefined' || procedurRows.length <= 0) {
        return await helpers.generateApiResponse(res, `No procedures found for search: ${key}|No procedures found.`, 400, []);
    }

    var data = {
        count: procedurRows.length,
        data: procedurRows
    };
    
    return await helpers.generateApiResponse(res, `${procedurRows.length} Procedures found for search: ${key}|Procedures found.`, 200, data);
});

// Search lab component by name
router.get("/lab-component", async (req, res, next) => {
    var key = req.query.search;
    if (key.length < 3) {
        return await helpers.generateApiResponse(res, 'Please enter atleast 3 characters.', 400, []);
    }

    var labComponentSearchQuery = searchDataModel.searchLabComponent(key, resultLimit);
    var [labComponentRows] = await dbMysql.query(labComponentSearchQuery);
    if (typeof labComponentRows == 'undefined' || labComponentRows.length <= 0) {
        return await helpers.generateApiResponse(res, `No lab components found for search: ${key}|No lab components found.`, 400, []);
    }

    var data = {
        count: labComponentRows.length,
        data: labComponentRows
    };
    
    return await helpers.generateApiResponse(res, `${labComponentRows.length} Lab components found for search: ${key}|Lab components found.`, 200, data);
});

// Search admission status by name
router.get("/admission", async (req, res, next) => {
    var key = req.query.search;
    if (key.length < 1) {
        return await helpers.generateApiResponse(res, 'Please enter atleast 1 character.', 400, []);
    }

    var admissionSearchQuery = searchDataModel.getAdmission(resultLimit);
    var [admissionRows] = await dbMysql.query(admissionSearchQuery);

    if (typeof admissionRows == 'undefined' || admissionRows.length <= 0) {
        return await helpers.generateApiResponse(res, `No admission status found for search: ${key}|No admission status found.`, 400, []);
    }

    var data = {
        count: admissionRows.length,
        data: admissionRows
    };
    
    return await helpers.generateApiResponse(res, `${admissionRows.length} Admission status found for search: ${key}|Admission status found.`, 200, data);
});

// Search demographics by name
router.get("/patient-demographics", async (req, res, next) => {
    var key = req.query.search;
    if (key.length < 1) {
        return await helpers.generateApiResponse(res, 'Please enter atleast 1 character.', 400, []);
    }

    var patientDemographicsSearchQuery = searchDataModel.searchDemographics(key, resultLimit);
    var [demographicsRows] = await dbMysql.query(patientDemographicsSearchQuery);

    if (typeof demographicsRows == 'undefined' || demographicsRows.length <= 0) {
        return await helpers.generateApiResponse(res, `No demographics found for search: ${key}|No demographics found.`, 400, []);
    }

    var data = {
        count: demographicsRows.length,
        data: demographicsRows
    };
    
    return await helpers.generateApiResponse(res, `${demographicsRows.length} Demographics found for search: ${key}|DemographicsLab componentsDemographics found.`, 200, data);
});

// Search vital signs by name
router.get("/vital-signs", async (req, res, next) => {
    var key = req.query.search;
    if (key.length < 3) {
        return await helpers.generateApiResponse(res, 'Please enter atleast 3 characters.', 400, []);
    }

    var vitalSignSearchQuery = searchDataModel.searchVitalSigns(key, resultLimit);
    var [vitalSignRows] = await dbMysql.query(vitalSignSearchQuery);

    if (typeof vitalSignRows == 'undefined' || vitalSignRows.length <= 0) {
        return await helpers.generateApiResponse(res, `No vital signs found for search: ${key}|No vital signs found.`, 400, []);
    }

    var data = {
        count: vitalSignRows.length,
        data: vitalSignRows
    };
    
    return await helpers.generateApiResponse(res, `${vitalSignRows.length} Vital signs found for search: ${key}|Vital signs found.`, 200, data);
});

// Search imaging by name
router.get("/imaging", async (req, res, next) => {
    var key = req.query.search;
    if (key.length < 3) {
        return await helpers.generateApiResponse(res, 'Please enter atleast 3 characters.', 400, []);
    }

    var imagingSearchQuery = searchDataModel.searchImaging(key, resultLimit);
    var [imagingRows] = await dbMysql.query(imagingSearchQuery);

    if (typeof imagingRows == 'undefined' || imagingRows.length <= 0) {
        return await helpers.generateApiResponse(res, `No imaging found for search: ${key}|No imaging found.`, 400, []);
    }

    var data = {
        count: imagingRows.length,
        data: imagingRows
    };
    
    return await helpers.generateApiResponse(res, `${imagingRows.length} Imaging found for search: ${key}|Imaging found.`, 200, data);
});

// Search diagnosis by name
router.get("/diagnosis", async (req, res, next) => {
    var key = req.query.search;
    if (key.length < 3) {
        return await helpers.generateApiResponse(res, 'Please enter atleast 3 characters.', 400, []);
    }

    var diagnosisSearchQuery = searchDataModel.searchDiagnosis(key, resultLimit);
    var [diagnosisRows] = await dbMysql.query(diagnosisSearchQuery);

    if (typeof diagnosisRows == 'undefined' || diagnosisRows.length <= 0) {
        return await helpers.generateApiResponse(res, `No diagnosis found for search: ${key}|No diagnosis found.`, 400, []);
    }
    
    var data = {
        count: diagnosisRows.length,
        data: diagnosisRows
    };

    return await helpers.generateApiResponse(res, `${diagnosisRows.length} Diagnosis found for search: ${key}|Diagnosis found.`, 200, data);
});

module.exports = router;