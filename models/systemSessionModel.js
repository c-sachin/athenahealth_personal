class SystemSessionModel {

    /**
    * Get current session details from system_session by id
    *
    * @returns {string} SQL query
    */
    static getSystemSessionById() {
        var sql = "SELECT * FROM `system_session` WHERE `id` = ?";
        return sql;
    }

    /**
    * Get current session details from system_session by user id
    *
    * @returns {string} SQL query
    */
    static getSystemSessionByUserId() {
        var sql = "SELECT * FROM `system_session` WHERE `system_user_id` = ?";
        return sql;
    }

    /**
    * Insert query for system_session
    *
    * @returns {string} SQL query
    */
    static insertSystemSession() {
        var sql = "INSERT INTO system_session SET ?";
        return sql;
    }

    /**
    * Update system_session by id
    *
    * @param {number} id Current session id
    * @returns {string} SQL query
    */
    static updateSystemSessionById(id) {
        var sql = "UPDATE system_session SET ? where id = " + id;
        return sql;
    }

    static deleteSystemSession() {
        let sql = 'DELETE FROM system_session WHERE ?';
        return sql;
    }
}

module.exports = SystemSessionModel;