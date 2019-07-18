const express = require("express");
const helpers = require('../../lib/helpers');
const dbMysql = require("../../db/dbMysql");
const router = express.Router();
const genderModel = require("../../models/master/gender");

router.get('/genderList', async (req, res) => {
    var genderListQuery = genderModel.getGenderList('0', '0');
    var [genderRows] = await dbMysql.execute(genderListQuery);
    if (typeof genderRows == 'undefined' || genderRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data Found', 200, []);
    }
    return await helpers.generateApiResponse(res, 'Gender list found.', 200, genderRows);
});

router.post('/genderEdit/:id', async (req, res) => {
    let id = req.params.id;
    var post = { gender_id: id };
    var genderEditQuery = genderModel.getGenderList('1');
    var [genderRows] = await dbMysql.query(genderEditQuery, post);

    if (typeof genderRows == 'undefined' || genderRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Gender found.', 200, genderRows);
});

router.post('/genderUpdate/:id', async (req, res) => {
    let id = req.params.id;
    if (req.body.genderName == '') {
        return await helpers.generateApiResponse(res, 'Error: Please enter all required fields.', 400, []);
    }
    var post = { gender_name: req.body.genderName, };
    var updateGenderByIdQuery = genderModel.updateGenderById(id);
    var [genderUpdate] = await dbMysql.query(updateGenderByIdQuery, post);

    if (typeof genderUpdate.affectedRows == 'undefined' || genderUpdate.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Gender updated successfully', 200, []);
});

router.post('/genderCreate', async (req, res) => {
    if (req.body.genderName == null || req.body.genderName == "" ) {
        return await helpers.generateApiResponse(res, 'Please enter all required fields.', 400, []);
    }
    var post = { gender_name: req.body.genderName };
    var insertGenderQuery = genderModel.insertGender();
    var [genderInsert] = await dbMysql.query(insertGenderQuery, post);

    if (typeof genderInsert.insertId == 'undefined' || genderInsert.insertId <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Gender created successfully', 200, []);
});

router.post('/genderDelete/:id', async (req, res) => {
    let id = req.params.id;
    var post = { gender_active: 0 };
    var query = genderModel.updateGenderById(id);
    var [genderDelete] = await dbMysql.query(query, post);

    if (typeof genderDelete.affectedRows == 'undefined' || genderDelete.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Gender deleted successfully.', 200, []);
});

module.exports = router;