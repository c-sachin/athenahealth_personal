require('dotenv').config({ path: 'E:/athenahealth/server/.env' })
const dbMysql = require("../db/dbMysql");
const axios = require("axios");

executeQuery();

async function executeQuery() {
    var selectQuery = 'SELECT a.f_facility_id, a.appointment_id, a.patient_email, f.facility_survey_token, d.facility_survey_campaign_id FROM m_appointment a, m_facility_settings f, m_department d WHERE a.appointment_survey_send_status = 2 AND appointment_feedback_status IN (1,3) AND a.f_facility_id = f.f_facility_id AND f.f_facility_id = d.f_facility_id AND a.departmentid = d.departmentid';
    var appointmentRowsArr = await dbMysql.execute(selectQuery);

    if (typeof appointmentRowsArr[0] == 'undefined' || appointmentRowsArr[0].length <= 0) {
        console.log("No data found.");
    } else {
        appointmentRows = appointmentRowsArr[0];
        for (var i = 0; i < appointmentRows.length; i++) {
            var appointment_id = appointmentRows[i]['appointment_id'];
            var token = appointmentRows[i]['facility_survey_token'];
            var campaign_id = appointmentRows[i]['facility_survey_campaign_id'];
            var email = appointmentRows[i]['patient_email'].replace(/@gmail.com|@aol.com|@hotmail.com/g, '@mailinator.com');
            var feedbackRows = await getFeedback(token, campaign_id, email);
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
            
            var updateQuery = 'UPDATE m_appointment SET ? where appointment_id=' + appointment_id;
            var [updateRow] = await dbMysql.query(updateQuery,postdata); 
        }
    }
    //await process.exit(1);
}

async function getFeedback(facility_survey_token,compaignId, email){
    var email = email.replace(/@gmail.com|@aol.com|@hotmail.com/g, '@mailinator.com');
    var token = 'Token '+facility_survey_token;
    var apiUrl = 'https://app.promoter.io/api/v2/feedback/?survey__campaign='+compaignId+'&survey__contact__email='+email;
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    }
    var config = {
        headers:headers
    }
    var { data } = await axios.get(apiUrl,config);
    return data.results;
}