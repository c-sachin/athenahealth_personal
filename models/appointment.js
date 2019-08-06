const helpers = require('../lib/helpers');
class Appointment {
    static getAppointment(flag, id) {
        let sql = 'SELECT * FROM m_appointment WHERE appointment_id =' + id; //specific appointment
        if (flag == 0) {
            // all 
            sql = 'SELECT * FROM m_appointment where is_deleted = 0';
        }
        return sql;
    }

    static appointmentUpdate(id) {
        let sql = 'UPDATE m_appointment SET ? where appointment_id=' + id
        return sql;
    }

    static appointmentDelete() {
        let sql = 'DELETE FROM m_appointment WHERE ?'
        return sql;
    }
    static checkAppointment(facilityId) {
        let sql = 'SELECT * from  m_appointment where f_facility_id = ' + facilityId
        return sql;
    }

    // used for export csv, do not change column names
    static facilityAppointment(facilityId, key) {
        let sql = 'SELECT patient_fname AS FirstName ,patient_lname AS LastName,patient_email AS Email,patient_mobileno AS MobileNumber,patient_homephone AS PhoneNumber,patient_address1 AS Address,patient_city AS City,patient_zip AS Zip,patient_sex AS Sex,patient_state AS State,patient_country AS Country, DATE_FORMAT(`appointment_date`,"%d-%m-%Y") AS AppointmentDate, (CASE WHEN appointment_survey_send_status = 2 THEN "Success" WHEN appointment_survey_send_status = 3 THEN "Fail" ELSE " " END) AS SurveySendStatus, appointment_survey_send_message AS FailReason, (CASE WHEN appointment_feedback_status = 2 THEN "Feedback recevied" WHEN appointment_feedback_status = 3 THEN "Feedback not recevied" ELSE " " END) AS SurveyFeedbackStatus, appointment_feedback_response AS FeedbackResponse, appointment_feedback_score AS FeedbackScore from m_appointment where f_facility_id =' + facilityId + ' AND patient_fname LIKE "%' + key + '%" OR patient_lname LIKE "%' + key + '%" OR patient_email LIKE "%' + key + '%" OR patient_mobileno LIKE "%' + key + '%" ORDER BY appointment_id'
        return sql;
    }

    static insertAppointment() {
        let sql = 'INSERT INTO m_appointment SET ?';
        return sql;
    }

    static appointmentToSurvey() {
        let sql = 'SELECT a.f_facility_id, a.appointment_id,a.patient_fname,a.patient_lname,a.patient_email, f.facility_survey_token, d.facility_survey_campaign_id FROM m_appointment a, m_facility_settings f, m_department d WHERE a.appointment_survey_send_status IN(1,3) AND a.f_facility_id = f.f_facility_id AND f.f_facility_id = d.f_facility_id AND a.departmentid = d.departmentid AND d.department_is_deleted = 0'
        return sql;
    }

    static getFacilityAppointmentCount(facilityId) {
        let sql = 'SELECT count(*) as total_rows FROM m_appointment where f_facility_id = ' + facilityId;
        return sql;
    }

    static getFacilityAppointmentList(facilityId, page = 1, perPage = 10) {
        let offset = helpers.getPaginationOffset(page, perPage);
        let sql = 'SELECT *, DATE_FORMAT(`appointment_date`,"%d-%m-%Y") AS `appointment_date` from  m_appointment where f_facility_id = ' + facilityId + ' ORDER BY `appointment_id` ASC LIMIT ' + offset + ' , ' + perPage;
        return sql;
    }

   static getSearchCount(facilityId, key) {
        let sql = 'SELECT count(*) as total_rows from  m_appointment where f_facility_id = ' + facilityId+ ' AND patient_fname LIKE "%' + key + '%" OR patient_lname LIKE "%' + key + '%" OR patient_email LIKE "%' + key + '%" OR patient_mobileno LIKE "%' + key + '%" ';
        return sql;
    }

    static search(facilityId, key, page = 1, perPage = 10) {
        let offset = helpers.getPaginationOffset(page, perPage);
        let sql = 'SELECT *, DATE_FORMAT(appointment_date,"%d-%m-%Y") AS appointment_date from  m_appointment where f_facility_id = ' + facilityId + ' AND patient_fname LIKE "%' + key + '%" OR patient_lname LIKE "%' + key + '%" OR patient_email LIKE "%' + key + '%" OR patient_mobileno LIKE "%' + key + '%" ORDER BY appointment_id ASC LIMIT ' + offset + ' , ' + perPage;
        return sql; 
    }
}

module.exports = Appointment;