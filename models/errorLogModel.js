class ErrorLogModel {

    /**
    * Insert into psq_error_log
    *
    * @returns {string} SQL query
    */
    static createErrorLogEntry() {
        var sql = "Insert into psq_error_log set ?";
        return sql;
    }
}

module.exports = ErrorLogModel;