const express = require("express");
const helpers = require('../../lib/helpers');
const dbMysql = require("../../db/dbMysql");
const router = express.Router();
const raceModel = require("../../models/master/race");

router.get('/raceList', async (req, res) => {
    var raceListQuery = raceModel.getRaceList('0', '0');
    var [raceRows] = await dbMysql.execute(raceListQuery);
    if (typeof raceRows == 'undefined' || raceRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data Found', 200, []);
    }

    return await helpers.generateApiResponse(res, 'Race list found.', 200, raceRows);
});

router.post('/raceEdit/:id', async (req, res) => {
    let id = req.params.id;
    var post = { race_id: id };
    var raceEditQuery = raceModel.getRaceList('1');
    var [raceRows] = await dbMysql.query(raceEditQuery, post);

    if (typeof raceRows == 'undefined' || raceRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Race found.', 200, raceRows);
});

router.post('/raceUpdate/:id', async (req, res) => {
    let id = req.params.id;
    var post = { race_name: req.body.raceName, };
    var updateRaceByIdQuery = raceModel.updateRaceById(id);
    var [raceUpdate] = await dbMysql.query(updateRaceByIdQuery, post);

    if (typeof raceUpdate.affectedRows == 'undefined' || raceUpdate.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    return await helpers.generateApiResponse(res, 'race updated successfully', 200, []);
});

router.post('/raceCreate', async (req, res) => {
    if (req.body.raceName == null || req.body.raceName == "" ) {
        return await helpers.generateApiResponse(res, 'Please enter all required fields.', 400, []);
    }
    var post = { race_name: req.body.raceName };
    var insertRaceQuery = raceModel.insertRace();
    var [raceInsert] = await dbMysql.query(insertRaceQuery, post);

    if (typeof raceInsert.insertId == 'undefined' || raceInsert.insertId <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    return await helpers.generateApiResponse(res, 'Race created successfully', 200, []);
});

router.post('/raceDelete/:id', async (req, res) => {
    let id = req.params.id;
    var post = { race_active: 0 };
    var query = raceModel.updateRaceById(id);
    var [raceDelete] = await dbMysql.query(query, post);

    if (typeof raceDelete.affectedRows == 'undefined' || raceDelete.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    return await helpers.generateApiResponse(res, 'race deleted successfully.', 200, []);
});

module.exports = router;