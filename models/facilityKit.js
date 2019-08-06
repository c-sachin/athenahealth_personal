class FacilityKit {
    static getFacilityKit(flag, id) {
        let sql = 'SELECT * FROM m_facility_settings WHERE f_facility_id =' + id; //specific facility kit
        if (flag == 0) {
            // all facilities kit
            sql = 'SELECT * FROM m_facility_settings where facility_is_deleted = 0';
        }
        return sql;
    }

    static getFacilityKitUpdate(id) {
        let sql = 'UPDATE m_facility_settings SET ? where f_facility_id=' + id
        return sql;
    }

    static facilityKitDelete() {
        let sql = 'DELETE FROM m_facility_settings WHERE ?'
        return sql;
    }
    static checkFacilityKit(facilityId) {
        let sql = 'SELECT * from  m_facility_settings where f_facility_id = ' + facilityId
        return sql;
    }

    static insertFacilityKitAccess() {
        let sql = 'INSERT INTO m_facility_settings SET ?';
        return sql;
    }
}

module.exports = FacilityKit;