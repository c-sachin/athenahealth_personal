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
        let sql = 'SELECT *, DATE_FORMAT(`appointment_date`,"%d-%m-%Y") AS `appointment_date` from  m_appointment where f_facility_id = ' + facilityId
        return sql;
    }

    static insertAppointment() {
        let sql = 'INSERT INTO m_appointment SET ?';
        return sql;
    }

    static appointmentToSurvey() {
        let sql = 'SELECT a.f_facility_id, a.appointment_id,a.patient_fname,a.patient_lname,a.patient_email, f.facility_survey_token, d.facility_survey_campaign_id FROM m_appointment a, m_facility_settings f, m_department d WHERE a.appointment_survey_send_status = 1 AND a.f_facility_id = f.f_facility_id AND f.f_facility_id = d.f_facility_id AND a.departmentid = d.departmentid'
        return sql;
    }
}

module.exports = Appointment;