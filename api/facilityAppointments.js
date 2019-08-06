const express = require("express");
const helpers = require('../lib/helpers');
const dbMysql = require("../db/dbMysql");
const router = express.Router();
const appointmentModel = require("../models/appointment");
const departmentModel = require("../models/department");
const facilityKitModel = require("../models/facilityKit");

router.post("/facilityAppointments", async (req, res) => {
    var facilityId = req.body.facility_id;
    var page = req.query.page;
    var perPage = req.query.per_page;
    let query = appointmentModel.getFacilityAppointmentList(facilityId, page, perPage);
    var [facilityAppointmentsRows] = await dbMysql.execute(query);
    if (typeof facilityAppointmentsRows == 'undefined' || facilityAppointmentsRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Error: No data found.', 404, []);
    }

    var getfacilityAppointmentsCountQuery = appointmentModel.getFacilityAppointmentCount(facilityId);
    var [facilityAppointmentsCountRows] = await dbMysql.execute(getfacilityAppointmentsCountQuery);

    var data = {
        count: facilityAppointmentsCountRows[0].total_rows,
        data: facilityAppointmentsRows
    }

    return await helpers.generateApiResponse(res, 'Facility appointments found.', 200, data);
});

router.post("/search", async (req, res, next) => {
    var facilityId = req.body.facility_id;
    var key = req.query.search;
    var perPage = req.query.per_page;
    var page = req.query.page;
    if (key.length < 3) {
        return await helpers.generateApiResponse(res, 'Please enter atleast 3 characters.', 400, []);
    }

    var searchQuery = appointmentModel.search(facilityId, key, page, perPage);
 
    var [searchRows] = await dbMysql.query(searchQuery);
    if (typeof searchRows == 'undefined' || searchRows.length <= 0) {
        return await helpers.generateApiResponse(res, `No appointments found for search: ${key}`, 400, []);
    }

    var getSearchCountQuery = appointmentModel.getSearchCount(facilityId,key);
 
    var [searchCountRows] = await dbMysql.execute(getSearchCountQuery);

    var data = {
        count: searchCountRows[0].total_rows,
        data: searchRows
    }

    return await helpers.generateApiResponse(res, 'Appointments found.', 200, data);
});

router.post("/facilityAppointmentsAll", async (req, res) => {
    var facilityId = req.body.facility_id;
    var key = req.query.search;
    let query = appointmentModel.facilityAppointment(facilityId,key)
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
