require('dotenv').config();
const express = require("express");
const router = express.Router();
const helpers = require('../lib/helpers');
const dbMysql = require("../db/dbMysql");
const facilityKitModel = require("../models/facilityKit");

router.post('/FacilityKitAccessCreate', async (req, res) => {
    if (req.body.facilityKitServer == null || req.body.facilityKitServer == "" || req.body.facility_kit_port == "" || req.body.facility_kit_userid == "" || req.body.facility_kit_password == "" || req.body.facility_fhir_secret == "" || req.body.facility_fhir_id == "" || req.body.facility_fhir_hash == "") {
        return await helpers.generateApiResponse(res, 'Please enter all required fields.', 400, []);
    }
    var post = {
        facility_kit_server: req.body.facilityKitServer,
        facility_kit_port: req.body.facilityKitPort,
        facility_kit_userid: req.body.facilityKitUserid,
        facility_fhir_secret: req.body.facilityFhirSecret,
        facility_kit_password: req.body.facilityKitPassword,
        facility_fhir_id: req.body.facilityFhirId,
        facility_fhir_hash: req.body.facilityFhirHash,
        f_facility_id: req.body.facilityId
    };
    var insertFacilityKitAccessQuery = facilityKitModel.insertFacilityKitAccess();
    var [facilityKitInsert] = await dbMysql.query(insertFacilityKitAccessQuery, post);

    if (typeof facilityKitInsert.insertId == 'undefined' || facilityKitInsert.insertId <= 0) {
        return await helpers.generateApiResponse(res, 'Error:something went wrong.', 400, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility access kit created successfully', 200, []);
});

router.get('/FacilityKitAccess', async (req, res) => {
    let query = facilityKitModel.getFacilityKit(0, id)
    var [facilityKitRows] = await dbMysql.execute(query);
    if (typeof facilityKitRows == 'undefined' || facilityKitRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility kit list found.', 200, facilityUserRows);
});

router.post('/FacilityKitAccessEdit/:id', async (req, res) => {
    let id = req.params.id;
    var post = { f_facility_id: id };
    let query = facilityKitModel.getFacilityKit(1, id)
    var [facilityKit] = await dbMysql.query(query, post);

    if (typeof facilityKit == 'undefined' || facilityKit.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }
    return await helpers.generateApiResponse(res, 'Facility kit found.', 200, facilityKit);
});

router.post('/FacilityKitAccessUpdate/:id', async (req, res) => {
    let id = req.params.id;
    var post = {
        facility_kit_server: req.body.facilityKitServer,
        facility_kit_port: req.body.facilityKitPort,
        facility_kit_userid: req.body.facilityKitUserid,
        facility_fhir_secret: req.body.facilityFhirSecret,
        facility_kit_password: req.body.facilityKitPassword,
        facility_fhir_id: req.body.facilityFhirId,
        facility_fhir_hash: req.body.facilityFhirHash,
        f_facility_id: req.body.facilityId
    };
    let query = facilityKitModel.getFacilityKitUpdate(id)
    var [facilityKitUpdate] = await dbMysql.query(query, post);

    if (typeof facilityKitUpdate.affectedRows == 'undefined' || facilityKitUpdate.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility kit updated successfully', 200, []);
});

router.post('/FacilityKitAccessDelete/:id', async (req, res) => {
    let id = req.params.id;
    var post = { facility_kit_access_id: id };
    let query = facilityKitModel.facilityKitDelete()
    var [facilityKitDelete] = await dbMysql.query(query, post);

    if (typeof facilityKitDelete.affectedRows == 'undefined' || facilityKitDelete.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility kit deleted successfully.', 200, []);
});

router.get('/checkFacilityKit/:id', async (req, res) => {
    let facilityId = req.params.id;
    let query = facilityKitModel.checkFacilityKit(facilityId)

    var [facilityKitCheck] = await dbMysql.execute(query);
    if (facilityKitCheck.length > 0) {
        return await helpers.generateApiResponse(res, process.env.CLIENT_URL + 'editkitAcess/' + facilityId, 200, facilityKitCheck);
    }
    
    return await helpers.generateApiResponse(res, process.env.CLIENT_URL + 'FacilitykitAcessPage/' + facilityId, 200, []);
});

module.exports = router;