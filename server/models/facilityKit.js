class FacilityKit {
    static getFacilityKit(flag, id) {
        let sql = 'SELECT * FROM m_facility_kit_access WHERE f_facility_id =' + id; //specific facility kit
        if (flag == 0) {
            // all facilities kit
            sql = 'SELECT * FROM m_facility_kit_access';
        }
        return sql;
    }

    static getFacilityKitUpdate(id) {
        let sql = 'UPDATE m_facility_kit_access SET ? where f_facility_id=' + id
        return sql;
    }

    static facilityKitDelete() {
        let sql = 'DELETE FROM m_facility_kit_access WHERE ?'
        return sql;
    }
    static checkFacilityKit(facilityId) {
        let sql = 'SELECT * from  m_facility_kit_access where f_facility_id = ' + facilityId
        return sql;
    }

    static insertFacilityKitAccess() {
        let sql = 'INSERT INTO m_facility_kit_access SET ?';
        return sql;
    }
}

module.exports = FacilityKit;