const express = require("express");
const helpers = require('../lib/helpers');
const dbMysql = require("../db/dbMysql");
const router = express.Router();
const facilityModel = require("../models/facility");

router.post('/Facilitycreate', async (req, res) => {
    if (req.body.facilityName == null || req.body.facilityName == "" || req.body.facilityId == "" || req.body.ownerName == ""){
        return await helpers.generateApiResponse(res, 'Please enter all required fields.', 400, []);
    }
    
    var post = {
        m_facility_nm: req.body.facilityName,
        m_facility_app_id: req.body.facilityId,
        m_facility_owner_nm: req.body.ownerName,
        m_facility_active: req.body.activeStatus,
    };
    var insertFacilityQuery = facilityModel.insertFacility();
    var [facilityInsert] = await dbMysql.query(insertFacilityQuery, post);

    if (typeof facilityInsert.insertId == 'undefined' || facilityInsert.insertId <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility created successfully', 200, []);

});

router.get('/Facilities', async (req, res) => {
    var facilityQuery = facilityModel.getFacilityList('0', '0');
    var [facilityRows] = await dbMysql.execute(facilityQuery);
    if (typeof facilityRows == 'undefined' || facilityRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data Found', 404, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility list found.', 200, facilityRows);
});

router.post('/FacilityEdit/:id', async (req, res) => {
    let id = req.params.id;
    var post = { m_facility_id: id };
    var facilityQuery = facilityModel.getFacilityList('1');
    var [facilityRows] = await dbMysql.query(facilityQuery, post);

    if (typeof facilityRows == 'undefined' || facilityRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility user found.', 200, facilityRows);
});

router.post('/FacilityUpdate/:id', async (req, res) => {
    let id = req.params.id;
    var post = {
        m_facility_nm: req.body.facilityName,
        m_facility_app_id: req.body.facilityId,
        m_facility_owner_nm: req.body.ownerName,
        m_facility_active: req.body.activeStatus,
    };
    var updateFacilityByIdQuery = facilityModel.updateFacilityById(id);
    var [facilityUpdate] = await dbMysql.query(updateFacilityByIdQuery, post);

    if (typeof facilityUpdate.affectedRows == 'undefined' || facilityUpdate.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility updated successfully', 200, []);
});

router.post('/FacilityDelete/:id', async (req, res) => {
    let id = req.params.id;
    var post = { m_facility_id: id };
    var query = facilityModel.getFacilityUpdate();
    var [facilityDelete] = await dbMysql.query(query, post);

    if (typeof facilityDelete.affectedRows == 'undefined' || facilityDelete.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Facility deleted successfully.', 200, []);
});

router.post('/doesFacilitAppIdExist/:id', async (req, res) => {
    let id = req.params.id;
    let edit = req.body.postData.edit;
    if (edit == true) {
        let facilityId = req.body.postData.facilityId;
        var post = { m_facility_app_id: id };
        let query = facilityModel.facilityAppIdExist(id, facilityId)
        var [facilityExistRows] = await dbMysql.query(query, post);
        if (typeof facilityExistRows == 'undefined' || facilityExistRows.length <= 0) {
            return await helpers.generateApiResponse(res, id + ' doesnot already exist.', 200, []);
        }
        if (facilityExistRows.length > 0){
            return await helpers.generateApiResponse(res, facilityExistRows[0].m_facility_app_id + ' already exist.', 400, []);
        }

    }
    if (edit == false) {
        var post = { m_facility_app_id: id };
        var query = facilityModel.getFacilityList('1');
        var [facilityExistRows] = await dbMysql.query(query, post);
        if (typeof facilityExistRows == 'undefined' || facilityExistRows.length <= 0) {
            return await helpers.generateApiResponse(res, id + ' doesnot already exist.', 200, []);
        }
        if (facilityExistRows.length > 0){
            return await helpers.generateApiResponse(res, facilityExistRows[0].m_facility_app_id + ' already exist.', 400, []);
        }
    }
    return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
});


module.exports = router;