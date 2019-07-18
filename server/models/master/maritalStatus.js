class MaritalStatus {

    static getMaritalStatusList(flag, id) {
        let sql = `SELECT * FROM maritalstatus  WHERE ?`;
        if (flag == 0) {
            // all marital status
            sql = `SELECT * FROM maritalstatus where maritalStatus_active = 1`;
        }
        return sql;
    }
    static updateMaritalStatusById(id) {
        let sql = 'UPDATE maritalstatus SET ? where maritalStatus_id = ' + id;
        return sql;
    }
    static insertMaritalStatus() {
        let sql = 'INSERT INTO maritalstatus SET  ?';
        return sql;
    }
}

module.exports = MaritalStatus;