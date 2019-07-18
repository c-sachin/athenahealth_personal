const express = require("express");
const helpers = require('../lib/helpers');
const dbMysql = require("../db/dbMysql");
const router = express.Router();
const facilityUserModel = require("../models/facilityUser");

router.post("/FacilityUserCreate", async (req, res) => {
    if (req.body.facilityUserName == null || req.body.facilityUserName == "" || req.body.facilityEpicuserId == "") {
        return await helpers.generateApiResponse(res, 'Please enter all required fields.', 400, []);
    }
    var post = {
        m_facility_user_name: req.body.facilityUserName,
        f_facility_id: req.body.facilityId,
        m_facility_epicuser_id: req.body.facilityEpicuserId
    };
    var insertFacilityUserQuery = facilityUserModel.insertFacilityUser();
    var [facilityUserInsert] = await dbMysql.query(insertFacilityUserQuery, post);

    if (typeof facilityUserInsert.insertId == 'undefined' || facilityUserInsert.insertId <= 0) {
        return await helpers.generateApiResponse(res, 'Error: facilityUserInsert went wrong.', 400, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility user created successfully', 200, []);

});

router.post("/FacilityUsers", async (req, res) => {
    var facilityId = req.body.facility_id;
    let query = facilityUserModel.getFacilityUserList(0, facilityId)
    var [facilityUserRows] = await dbMysql.execute(query);
    if (typeof facilityUserRows == 'undefined' || facilityUserRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility user list found.', 200, facilityUserRows);
});

router.post("/FacilityUserEdit/:facility_user_id", async (req, res) => {
    let id = req.params.facility_user_id;
    var post = {
        m_facility_user_id: id
    };
    let query = facilityUserModel.getFacilityUserList(1, id)
    var [facilityUser] = await dbMysql.query(query, post);

    if (typeof facilityUser == 'undefined' || facilityUser.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility user found.', 200, facilityUser);
});

router.post("/FacilityUserUpdate/:id", async (req, res) => {
    let id = req.params.id;
    var post = {
        m_facility_user_name: req.body.facilityUserName,
        f_facility_id: req.body.facilityId,
        m_facility_epicuser_id: req.body.facilityEpicuserId
    };
    let query = facilityUserModel.getFacilityUserUpdate(id)
    var [facilityUserUpdate] = await dbMysql.query(query, post);

    if (typeof facilityUserUpdate.affectedRows == 'undefined' || facilityUserUpdate.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility user updated successfully', 200, []);
});

router.post("/FacilityUserDelete/:id", async (req, res) => {
    let id = req.params.id;
    var post = {
        m_facility_user_id: id
    };
    let query = facilityUserModel.facilityUserDelete();
    var [facilityUserDelete] = await dbMysql.query(query, post);

    if (typeof facilityUserDelete.affectedRows == 'undefined' || facilityUserDelete.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility users deleted successfully.', 200, []);
});

router.post("/doesFacilityEpicUserIdExist", async (req, res) => {
    var epicUserId = req.body.postData.epicUserId.trim();
    var edit = req.body.postData.edit;
    var facilityId = req.body.postData.facility_id;

    if (edit == false) {
        let query = facilityUserModel.facilityUserIdExist(0, epicUserId, facilityId, '')
        var [facilityUserExistRows] = await dbMysql.query(query);
        if (facilityUserExistRows.length == 0) {
            return await helpers.generateApiResponse(res, epicUserId + ' doesnot already exist.', 200, []);
        }
        if (facilityUserExistRows.length > 0){
            return await helpers.generateApiResponse(res, facilityUserExistRows[0].m_facility_epicuser_id + ' already exist.', 400, []);
        }

    } 
    if (edit == true) {
        var userId = req.body.postData.userId;
        let query = facilityUserModel.facilityUserIdExist(1, epicUserId, facilityId, userId)
        var [facilityUserExistRows] = await dbMysql.query(query);
        if (facilityUserExistRows.length == 0) {
            return await helpers.generateApiResponse(res, epicUserId + ' doesnot already exist.', 200, []);
        }
        if (facilityUserExistRows.length > 0){
            return await helpers.generateApiResponse(res, facilityUserExistRows[0].m_facility_epicuser_id + ' already exist.', 400, []);
        }
    }
    return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
});
module.exports = router;
