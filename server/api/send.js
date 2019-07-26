var mysql = require('mysql');
//var db = 'db_athena';

const helpers = require('../lib/helpers');
const axios = require("axios");
var https = require('https');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_athena'
});

var selectQuery = ('SELECT a.f_facility_id, a.appointment_id,a.patient_fname,a.patient_lname,a.patient_email, f.facility_survey_token, d.facility_survey_campaign_id FROM m_appointment a, m_facility_settings f, m_department d WHERE a.appointment_survey_send_status IN(1,3) AND a.f_facility_id = f.f_facility_id AND f.f_facility_id = d.f_facility_id AND a.departmentid = d.departmentid AND d.department_is_deleted = 0');

connection.connect(function (err) {
  if (err) {
    console.log('error in connecting database', err);
    return;
  }
  connection.query(selectQuery, function (err, result) {
    if (err) {
      console.log('error', err);
      return;
    }
    sendSurveyMail(result);
  });
});

function sendSurveyMail(appointmentRows) {

  for (var i = 0; i < appointmentRows.length; i++) {
    var token = 'Token ' + appointmentRows[i]['facility_survey_token'];
    var apiUrl = 'https://app.promoter.io/api/v2/survey/';
    var method = 'POST';
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': token
    }
    var config = {
      headers: headers
    }

    var emailId = appointmentRows[i]['patient_email'].replace(/@gmail.com|@aol.com|@hotmail.com/g, '@mailinator.com');
    console.log('email----->', emailId);
    //var emailId = appointmentRows[i]['patient_email']
    var body = {
      "campaign_id": appointmentRows[i]['facility_survey_campaign_id'],
      "contact": {
        "email": emailId,
        "first_name": appointmentRows[i]['patient_fname'],
        "last_name": appointmentRows[i]['patient_lname']
      },
      'attributes': {
        'appointment_id': appointmentRows[i]['appointment_id']
      }

    }

    axios.post(apiUrl, body, config)
      .then(async (response) => {
        console.log('\nresponse status: ', response.status);
        updateSucessQuery = 'UPDATE m_appointment SET appointment_survey_send_status = 2 where appointment_id=' + response.data.attributes.appointment_id

        connection.connect(function (err) {  
          connection.query(updateSucessQuery, function (err, result) {});
        });
        
      })
      .catch(async (err) => {
        console.log('\nerr : ', err.response.status);
        var obj = JSON.parse(err.response.config.data);
        var appointment_survey_send_message = JSON.stringify(err.response.data);

        updateFailQuery = 'UPDATE m_appointment SET appointment_survey_send_status = 3, appointment_survey_send_message = '+appointment_survey_send_message + ' where appointment_id=' + obj.attributes.appointment_id

        connection.connect(function (err) {  
          connection.query(updateFailQuery, function (err, result) {});
        });
        console.log('Error-->:',err.response.data);
      });
  }
}

module.exports = connection;