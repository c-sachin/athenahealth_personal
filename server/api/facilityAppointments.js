const express = require("express");
const helpers = require('../lib/helpers');
const dbMysql = require("../db/dbMysql");
const router = express.Router();
const appointmentModel = require("../models/appointment");
const departmentModel = require("../models/department");
const facilityKitModel = require("../models/facilityKit");

router.post("/facilityAppointments", async (req, res) => {
    var facilityId = req.body.facility_id;
    let query = appointmentModel.facilityAppointment(facilityId)
    var [facilityAppointmentRows] = await dbMysql.execute(query);
    if (typeof facilityAppointmentRows == 'undefined' || facilityAppointmentRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }
    
    return await helpers.generateApiResponse(res, 'Facility user list found.', 200, facilityAppointmentRows);
});

router.post("/feedback", async (req, res) => {
    var appointment_id = req.body.appointment_id;
    
    let appointmentQuery = appointmentModel.getAppointment(1,appointment_id);
    var [facilityAppointmentRows] = await dbMysql.execute(appointmentQuery);
    if (typeof facilityAppointmentRows == 'undefined' || facilityAppointmentRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }

    var facilityId = facilityAppointmentRows[0]['f_facility_id'];
    var departmentId = facilityAppointmentRows[0]['departmentid'];
    var email = facilityAppointmentRows[0]['patient_email'];

    let query = departmentModel.departmentCompaignId(facilityId,departmentId);
    var [departmentRows] = await dbMysql.execute(query);
    if (typeof departmentRows == 'undefined' || departmentRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Compaign Id Not found', 404, []);
    }
    var compaignId = departmentRows[0]['facility_survey_campaign_id'];
    var facility_survey_token = departmentRows[0]['facility_survey_token'];
   
    var feedbackRows = await helpers.feedback(facility_survey_token,compaignId, email);
    if (typeof feedbackRows == 'undefined' || feedbackRows.length <= 0) {
        var postdata = {
            appointment_feedback_status : '3'
        };
    }else{
        var comment = feedbackRows[0]['comment'];
        var score = feedbackRows[0]['score'];
        var postdata = {
            appointment_feedback_status : '2',
            appointment_feedback_response: comment,
            appointment_feedback_score: score
        };
    }
    var updateQuery = appointmentModel.appointmentUpdate(appointment_id);
    var [updateRow] = await dbMysql.query(updateQuery,postdata);

    return await helpers.generateApiResponse(res, 'Feedback Updated Successfully..', 200, updateRow);
});

module.exports = router;
