const express = require("express");
const helpers = require('../../lib/helpers');
const dbMysql = require("../../db/dbMysql");
const router = express.Router();
const maritalStatusModel = require("../../models/master/maritalStatus");

router.get('/maritalStatusList', async (req, res) => {
    var  maritalStatusListQuery = maritalStatusModel.getMaritalStatusList('0', '0');
    var [rows] = await dbMysql.execute(maritalStatusListQuery);
    if (typeof rows == 'undefined' || rows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data Found', 200, []);
    }

    return await helpers.generateApiResponse(res, 'Marital status list found.', 200, rows);
});

router.post('/maritalStatusEdit/:id', async (req, res) => {
    let id = req.params.id;
    var post = { maritalStatus_id: id };
    var maritalStatusQuery = maritalStatusModel.getMaritalStatusList('1');
    var [maritalStatusRows] = await dbMysql.query(maritalStatusQuery, post);

    if (typeof maritalStatusRows == 'undefined' || maritalStatusRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Marital Status found.', 200, maritalStatusRows);
});

router.post('/maritalStatusUpdate/:id', async (req, res) => {
    let id = req.params.id;
    var post = { maritalStatus_name: req.body.maritalStatusName, };
    var updateMaritalStatusById = maritalStatusModel.updateMaritalStatusById(id);
    var [maritalStatusUpdate] = await dbMysql.query(updateMaritalStatusById, post);

    if (typeof maritalStatusUpdate.affectedRows == 'undefined' || maritalStatusUpdate.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Marital Status updated successfully', 200, []);
});

router.post('/maritalStatusCreate', async (req, res) => {
    if (req.body.maritalStatusName == null || req.body.maritalStatusName == "") {
        return await helpers.generateApiResponse(res, 'Please enter all required fields.', 400, []);
    }
    var post = { maritalStatus_name: req.body.maritalStatusName };
    var insertMaritalStatusQuery = maritalStatusModel.insertMaritalStatus();
    var [maritalStatusInsert] = await dbMysql.query(insertMaritalStatusQuery, post);

    if (typeof maritalStatusInsert.insertId == 'undefined' || maritalStatusInsert.insertId <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Marital Status created successfully', 200, []);

});

router.post('/maritalStatusDelete/:id', async (req, res) => {
    let id = req.params.id;
    var post = { maritalStatus_active: 0 };
    var query = maritalStatusModel.updateMaritalStatusById(id);
    var [maritalStatusDelete] = await dbMysql.query(query, post);

    if (typeof maritalStatusDelete.affectedRows == 'undefined' || maritalStatusDelete.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Marital Status deleted successfully.', 200, []);
});

module.exports = router;