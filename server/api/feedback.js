const express = require("express");
const dbMysql = require("../db/dbMysql");
const helpers = require('../lib/helpers');
const router = express.Router();
const appointmentModel = require("../models/appointment");
const facilityKitModel = require("../models/facilityKit");
const axios = require("axios");
const moment = require("moment");
var https = require('https')

router.get('/get', async (req, res) => {
    let query = appointmentModel.appointmentToSurvey()
    var [appointmentRows] = await dbMysql.execute(query);
    for(var i = 0; i < appointmentRows.length; i++)
    {
        var token = 'Token '+appointmentRows[i]['facility_survey_token'];
        var apiUrl = 'https://app.promoter.io/api/v2/survey/';
        var method = 'POST';
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        }
        var config = {
            headers:headers
        }

        var body = {
            "campaign_id": appointmentRows[i]['facility_survey_campaign_id'],
            "contact": {
                //"email": appointmentRows[i]['patient_email'].replace(/@gmail.com|@io.com|@hotmail.com/g, '@mailinator.com'),
                "email": appointmentRows[i]['patient_email'],
                "first_name": appointmentRows[i]['patient_fname'],
                "last_name": appointmentRows[i]['patient_lname']
            },
            'attributes':{
                'appointment_id':appointmentRows[i]['appointment_id']
            }
            
        }
        
        axios.post(apiUrl, body, config)
        .then(async (response) => {
            console.log('\nresponse status: ', response.status);
            console.log('\nresponse statusText: ', response.statusText);
            console.log('\nresponse data: ', response.data);
            console.log('\nappointment_id: ', response.data.attributes.appointment_id);
            var postdata = {
                appointment_survey_send_status: '2'
            };
            var updateQuery = appointmentModel.appointmentUpdate(response.data.attributes.appointment_id);
            var [updateRow] = await dbMysql.query(updateQuery,postdata);
            if (typeof updateRow == 'undefined' || updateRow.length <= 0) {
                console.log('\nupdate failed: ', updateRow);
            }
            //return await helpers.generateApiResponse(res, 'Success: Test success.', 200, response);
        })
        .catch(async (err) => {
            console.log('\nerr : ', err.response.status);
            console.log('\nerr : ', err.response.statusText);
            console.log('\nerr : ', err.response.data);
            
            var obj = JSON.parse(err.response.config.data);
            console.log('\n appointment id-- : ', obj.attributes.appointment_id);

            var postdata2 = {
                appointment_survey_send_status: '3',
                appointment_survey_send_message: JSON.stringify(err.response.data)
            };
            var updateQuery = appointmentModel.appointmentUpdate(obj.attributes.appointment_id);
            var [updateRow] = await dbMysql.query(updateQuery,postdata2);
            if (typeof updateRow == 'undefined' || updateRow.length <= 0) {
                console.log('\nupdate failed: ', updateRow);
            }

            //return await helpers.generateApiResponse(res, 'Error: Test error.', 400, err.response.data);
        });
    } 

});

module.exports = router;