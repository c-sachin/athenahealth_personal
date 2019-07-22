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

    static insertAppointment() {
        let sql = 'INSERT INTO m_appointment SET ?';
        return sql;
    }
}

module.exports = Appointment;