const express = require("express");
const helpers = require('../lib/helpers');
const dbMysql = require("../db/dbMysql");
const router = express.Router();
const departmentModel = require("../models/department");
const facilityKitModel = require("../models/facilityKit");


router.post("/facilityDepartments", async (req, res) => {
    var facilityId = req.body.facility_id;
    let query = departmentModel.facilityDepartment(facilityId);
    var [facilityDepartmentRows] = await dbMysql.execute(query);
    if (typeof facilityDepartmentRows == 'undefined' || facilityDepartmentRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }
    
    return await helpers.generateApiResponse(res, 'Department list found.', 200, facilityDepartmentRows);
});

router.post("/updateCompaignId", async (req, res) => {
    console.log('update compaign');
    var departmentId = req.body.department_id;
    var compaignId = req.body.compaign_id;
    let query = departmentModel.updateDepartmentCompaignId(departmentId,compaignId);
    
    var [resp] = await dbMysql.execute(query);
    
    if (typeof resp == 'undefined' || resp.length <= 0) {
        return await helpers.generateApiResponse(res, 'Not updated', 404, []);
    }
    return await helpers.generateApiResponse(res, 'Department Updated Successfully.', 200, []);
});

router.post("/updateStatus", async (req, res) => {
    
    var departmentId = req.body.department_id;
    var status = req.body.status;
    let query = departmentModel.updateDepartmentStatus(departmentId,status);
    
    var [resp] = await dbMysql.execute(query);
    
    if (typeof resp == 'undefined' || resp.length <= 0) {
        return await helpers.generateApiResponse(res, 'Not updated', 404, []);
    }
    return await helpers.generateApiResponse(res, 'Department Updated Successfully.', 200, []);
});

router.post("/FatchDepartments", async (req, res) => {
    
    var facilityId = req.body.facility_id;

    let query = facilityKitModel.getFacilityKit(1,facilityId)
    var [facilityRows] = await dbMysql.execute(query);

    if (typeof facilityRows == 'undefined' || facilityRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Client ID or Secret ID not found.', 404, []);
    }

    var facility_practice_id = facilityRows[0]['facility_practice_id'];
    var facility_fhir_id = facilityRows[0]['facility_fhir_id'];
    var facility_fhir_secret = facilityRows[0]['facility_fhir_secret'];
    var token = await helpers.authentication(facility_fhir_id,facility_fhir_secret);
    console.log('token',token);
    if (typeof token == 'undefined' || token.length <= 0) {
        return await helpers.generateApiResponse(res, 'Client ID or Secret ID not found.', 404, []);
    }

    var deptArr = await helpers.department(token,facility_practice_id);

    if (typeof deptArr == 'undefined' || deptArr.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }

    let deletequery = departmentModel.deletefacilityDepartment(facilityId)
    var [deleteRows] = await dbMysql.execute(deletequery);
    
    for(var i = 0; i < deptArr.length; i++)
    {
        var post = {
            f_facility_id:facilityId,
            departmentid:deptArr[i]['departmentid'],
            department_name:deptArr[i]['name'],
            department_phone:deptArr[i]['phone'],
            department_fax:deptArr[i]['fax'],
            department_address:deptArr[i]['address'],
            department_city:deptArr[i]['city'],
            department_state:deptArr[i]['state'],
            department_zip:deptArr[i]['zip'],
            department_is_deleted:'1'
        }
        let query = departmentModel.insertDepartment();
        var [appointmentQueryInsert] = await dbMysql.query(query, post);
    }  

    if (typeof appointmentQueryInsert == 'undefined' || appointmentQueryInsert.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }
    return await helpers.generateApiResponse(res, 'Department list found.', 200, []);
});

module.exports = router;
