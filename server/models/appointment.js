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

    static facilityAppointment(facilityId) {
        let sql = 'SELECT `appointment_id`, `f_facility_id`, `practice_id`, `patient_id`, `patient_fname`, `patient_lname`, `patient_email`, `patient_mobileno`, `patient_homephone`, `patient_address1`, `patient_city`, `patient_zip`, `patient_sex`, `patient_state`, `patient_country`, `appointmentid`, DATE_FORMAT(`appointment_date`,"%d-%m-%Y") AS `appointment_date`, `appointment_encounter_id`, `appointment_type`, `appointment_starttime`, `appointment_survey_send_status`, `appointment_survey_send_message`, `added_at`, `updated_at`, `is_deleted` from  m_appointment where f_facility_id = ' + facilityId
        return sql;
    }

    static insertAppointment() {
        let sql = 'INSERT INTO m_appointment SET ?';
        return sql;
    }

    static appointmentToSurvey() {
        let sql = 'SELECT a.f_facility_id, appointment_id,patient_fname,patient_lname,patient_email,facility_survey_token,facility_survey_campaign_id FROM m_facility_settings b, m_appointment a WHERE appointment_survey_send_status = 1 AND a.f_facility_id = b.f_facility_id'
        return sql;
    }
}

module.exports = Appointment;