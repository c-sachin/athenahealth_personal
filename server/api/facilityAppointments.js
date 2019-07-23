const express = require("express");
const helpers = require('../lib/helpers');
const dbMysql = require("../db/dbMysql");
const router = express.Router();
const appointmentModel = require("../models/appointment");

router.post("/facilityAppointments", async (req, res) => {
    var facilityId = req.body.facility_id;
    let query = appointmentModel.facilityAppointment(facilityId)
    var [facilityAppointmentRows] = await dbMysql.execute(query);
    if (typeof facilityAppointmentRows == 'undefined' || facilityAppointmentRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility user list found.', 200, facilityAppointmentRows);
});

module.exports = router;
