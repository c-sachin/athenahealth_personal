class FacilityUser {

    static getFacilityUserList(flag = 1, id = null) {
        let sql = 'SELECT * FROM m_appointment  WHERE ?'; // specific facility users
        if (flag == 0) {
            // all facilities users
            sql = 'SELECT * FROM m_appointment where is_deleted = 0 and f_facility_id = ' + id;
        }
        return sql;
    }

    static getFacilityUserUpdate(id) {
        let sql = 'UPDATE m_facility_users SET ? where m_facility_user_id=' + id
        return sql;
    }

    static facilityUserDelete() {
        let sql = 'UPDATE m_facility_users SET `is_deleted` = 1 WHERE ?'
        return sql;

    }
    static facilityUserIdExist(flag = 1, epicUserId, facilityId, userId) {
        // For edit user
        let sql = 'SELECT m_facility_epicuser_id FROM m_facility_users WHERE m_facility_epicuser_id = "' + epicUserId + '" and m_facility_user_id !=' + userId + " and f_facility_id =" + facilityId;
        if (flag == 0) {
            // For add user
            sql = 'SELECT m_facility_epicuser_id FROM m_facility_users WHERE m_facility_epicuser_id = "' + epicUserId + '" and f_facility_id =' + facilityId
        }
        return sql;
    }

    static facilityEpicUser() {
        let sql = 'SELECT * FROM `m_facility_users` WHERE `m_facility_epicuser_id` = ?'
        return sql;

    }

    /**
    * Update m_facility_users by m_facility_user_id
    *
    * @param {number} m_facility_user_id Facility User Id
    * @returns {string} SQL query for update
    */
    static updateFacilityUserByUserId(m_facility_user_id) {
        let sql = "UPDATE `m_facility_users` SET ? WHERE `m_facility_user_id` = " + m_facility_user_id;
        return sql;
    }

    static insertFacilityUser() {
        let sql = "INSERT INTO m_facility_users SET ?";
        return sql;
    }

}

module.exports = FacilityUser;