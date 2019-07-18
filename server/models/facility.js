class Facility {
    /**
     * Get sql query for list of all facilities or a specific one with id.
     *
     * @param {number} flag 0 for facility with id or 1 for all facilities
     * @param {string} id facility id
     *
     * @returns {string} Sql query for list of all facilities or a specific one with id.
     */
    static getFacilityList(flag = 1, id = null) {
        // list of all facilities
        let sql = 'SELECT * FROM m_facility WHERE ?';
        if (flag == 0 && id != null) {
            sql = `SELECT * FROM m_facility where is_deleted = 0`;
        }
        return sql;
    }

    static getFacilityUpdate() {
        let sql = 'UPDATE m_facility left join m_facility_kit_access on m_facility.m_facility_id = m_facility_kit_access.f_facility_id left join m_facility_users on m_facility.m_facility_id = m_facility_users.f_facility_id SET m_facility.`is_deleted` = 1, m_facility_kit_access.`is_deleted` = 1, m_facility_users.`is_deleted` = 1 where ? '
        return sql;
    }

    static facilityAppIdExist(id, facilityId) {
        let sql = 'SELECT m_facility_app_id from m_facility where m_facility_app_id = "' + id + '" AND `m_facility_id` != ' + facilityId
        return sql;
    }

    static getFacilityAuth() {
        let sql = 'SELECT * FROM `m_facility` WHERE `m_facility_app_id` = ? '
        return sql;
    }

    static insertFacility() {
        let sql = 'INSERT INTO m_facility SET  ?';
        return sql;
    }

    static updateFacilityById(id) {
        let sql = 'UPDATE m_facility SET ? where m_facility_id = ' + id;
        return sql;
    }
}

module.exports = Facility;