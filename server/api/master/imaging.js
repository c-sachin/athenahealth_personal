const express = require("express");
const helpers = require('../../lib/helpers');
const dbMysql = require("../../db/dbMysql");
const router = express.Router();
const imagingModel = require("../../models/master/imaging");

router.get('/imagingList', async (req, res) => {
    var imagingListQuery = imagingModel.getImagingList('0', '0');
    var [imagingRows] = await dbMysql.execute(imagingListQuery);
    if (typeof imagingRows == 'undefined' || imagingRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data Found', 200, []);
    }
    return await helpers.generateApiResponse(res, 'Imaging list found.', 200, imagingRows);
});

router.post('/imagingEdit/:id', async (req, res) => {
    let id = req.params.id;
    var post = { imaging_id: id };
    var imagingEditQuery = imagingModel.getImagingList('1');
    var [imagingRows] = await dbMysql.query(imagingEditQuery, post);

    if (typeof imagingRows == 'undefined' || imagingRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Imaging found.', 200, imagingRows);
});

router.post('/imagingUpdate/:id', async (req, res) => {
    let id = req.params.id;
    if (req.body.imagingName == null || req.body.imagingName == "" || req.body.procedureKey == null || req.body.procedureKey == "" || req.body.procedureCode == null || req.body.procedureCode == "" || req.body.codeSetType == null || req.body.codeSetType == "") {
        return await helpers.generateApiResponse(res, 'Please enter all required fields.', 400, []);
    }
    var post = { imaging_name: req.body.imagingName, procedure_key: req.body.procedureKey, procedure_code: req.body.procedureCode, code_set_type: req.body.codeSetType };
    var updateImagingByIdQuery = imagingModel.updateImagingById(id);
    var [imagingUpdate] = await dbMysql.query(updateImagingByIdQuery, post);

    if (typeof imagingUpdate.affectedRows == 'undefined' || imagingUpdate.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Imaging updated successfully', 200, []);
});

router.post('/imagingCreate', async (req, res) => {
    if (req.body.imagingName == null || req.body.imagingName == "" || req.body.procedureKey == null || req.body.procedureKey == "" || req.body.procedureCode == null || req.body.procedureCode == "" || req.body.codeSetType == null || req.body.codeSetType == "") {
        return await helpers.generateApiResponse(res, 'Please enter all required fields.', 400, []);
    }
    var post = { imaging_name: req.body.imagingName, procedure_key: req.body.procedureKey, procedure_code: req.body.procedureCode, code_set_type :req.body.codeSetType, imaging_active: 1 };
    var insertImagingQuery = imagingModel.insertImaging();
    var [imagingInsert] = await dbMysql.query(insertImagingQuery, post);

    if (typeof imagingInsert.insertId == 'undefined' || imagingInsert.insertId <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Imaging created successfully', 200, []);

});

router.post('/imagingDelete/:id', async (req, res) => {
    let id = req.params.id;
    var post = { imaging_active: 0 };
    var query = imagingModel.updateImagingById(id);
    var [imagingDelete] = await dbMysql.query(query, post);

    if (typeof imagingDelete.affectedRows == 'undefined' || imagingDelete.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Imaging deleted successfully.', 200, []);
});

module.exports = router;