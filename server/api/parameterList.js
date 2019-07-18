const express = require("express");
const dbMysql = require("../db/dbMysql");
const helpers = require('../lib/helpers');
const router = express.Router();
const patientSearchModel = require("../models/patientSearch");

router.post("/", async (req, res) => {
    let id = req.body.id;
    var patientSearchModelQuery = patientSearchModel.getPatientScreeningList(1, id);
    var [patientSearchRows] = await dbMysql.query(patientSearchModelQuery);

    if (typeof patientSearchRows == 'undefined' || patientSearchRows.length <= 0) {
        return await helpers.generateApiResponse(res, `No data found.`, 400, []);
    }

    var data = {
        count: patientSearchRows.length,
        data: patientSearchRows
    };
    return await helpers.generateApiResponse(res, `Parameter data found.`, 200, data);
});

module.exports = router;
