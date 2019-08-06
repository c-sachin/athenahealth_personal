require('dotenv').config({path: 'E:/athenahealth/server/.env'})
const dbMysql = require("../db/dbMysql");
const axios = require("axios");

executeQuery ();

async function executeQuery(){	
  var selectQuery = 'SELECT a.f_facility_id, a.appointment_id,a.patient_fname,a.patient_lname,a.patient_email, f.facility_survey_token, d.facility_survey_campaign_id FROM m_appointment a, m_facility_settings f, m_department d WHERE a.appointment_survey_send_status IN(1,3) AND a.f_facility_id = f.f_facility_id AND f.f_facility_id = d.f_facility_id AND a.departmentid = d.departmentid AND d.department_is_deleted = 0';
  var appointmentRowsArr = await dbMysql.execute(selectQuery);

  if (typeof appointmentRowsArr[0] == 'undefined' || appointmentRowsArr[0].length <= 0) {
      console.log("No data found.");
  }else{
    appointmentRows = appointmentRowsArr[0];
    var flagCount = 0;
    var totalRecords = appointmentRows.length;
    for (var i = 0; i < appointmentRows.length; i++) {
      var token = 'Token ' + appointmentRows[i]['facility_survey_token'];
      var apiUrl = 'https://app.promoter.io/api/v2/survey/';
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
          console.log('\n response status: ', response.status);
          var postData = {
            appointment_survey_send_status:'2'
          };
          let updateSucessQuery = 'UPDATE m_appointment SET ? where appointment_id=' + response.data.attributes.appointment_id
          var [appointmentUpdate] = await dbMysql.query(updateSucessQuery, postData);

          if (typeof appointmentUpdate.affectedRows == 'undefined' || appointmentUpdate.affectedRows <= 0) {
            console.log('Error while updating success response status.');
          }
          flagCount++;
          if(flagCount == totalRecords){
            await process.exit(0);
          }
        })
        .catch(async (err) => {
          console.log('Error status:', err.response.status);
          console.log('Error:',err.response.data);

          var obj = JSON.parse(err.response.config.data);
          var message = err.response.data;
          var errorString = '';
          for(var key in message) {
            errorString = key +" : "+message[key];
          }
  
          var post = {
            appointment_survey_send_message: errorString,
            appointment_survey_send_status:'3'
          };
          let sql = 'UPDATE m_appointment SET ? where appointment_id=' + obj.attributes.appointment_id
          var [appointmentFailUpdate] = await dbMysql.query(sql, post);

          if (typeof appointmentFailUpdate.affectedRows == 'undefined' || appointmentFailUpdate.affectedRows <= 0) {
            console.log('Error while updating fail response status.');
          }
          flagCount ++;
          if(flagCount == totalRecords){
            await process.exit(0);
          }
        });
    }
  }	
}