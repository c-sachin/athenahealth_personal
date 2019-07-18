class SearchDataModel {
    /**
    * Set SQL Query limit
    *
    * @param {number} limit No. of rows in limit
    * @returns {string} limit clause or empty
    */
    static setQueryLimit(limit = 0) {
        var resultLimit = '';
        if (limit > 0) {
            resultLimit = " LIMIT " + limit;
        }
        return resultLimit;
    }

    /**
    * Search Medication by name or generic name or rxnorm code or gpi code
    *
    * @param {string} key search key
    * @param {number} limit No. of rows in limit
    * @returns {string} SQL query
    */
    static searchMedication(key, limit = 0) {
        var resultLimit = this.setQueryLimit(limit);
        var sql = "SELECT `medication_id`, `medication_name` as `name`, `medication_generic_name`, `medication_rxnorm_code`, `medication_gpi_code` as `code`, `medication_active` FROM medicationsmaster WHERE medication_active = 1 AND (medication_name LIKE '%" + key + "%' OR medication_generic_name LIKE '%" + key + "%' OR medication_rxnorm_code LIKE '%" + key + "%' OR medication_gpi_code LIKE '%" + key + "%') " + resultLimit;
        return sql;
    }

    /**
    * Search Procedure by name or code
    *
    * @param {string} key search key
    * @param {number} limit No. of rows in limit
    * @returns {string} SQL query
    */
    static searchProcedure(key, limit = 0) {
        var resultLimit = this.setQueryLimit(limit);
        var sql = "SELECT `order_id`, `order_name` as `name`, `order_code_type`, `order_code` as `code`, `order_active` FROM `ordersmaster` WHERE `order_active` = 1 AND (`order_name` LIKE '%" + key + "%' OR `order_code` LIKE '%" + key + "%') " + resultLimit;
        return sql;
    }

    /**
    * Search Lab component by name or loinc code
    *
    * @param {string} key search key
    * @param {number} limit No. of rows in limit
    * @returns {string} SQL query
    */
    static searchLabComponent(key, limit = 0) {
        var resultLimit = this.setQueryLimit(limit);
        var sql = "SELECT `id`, `lab_component_name` as `name`, `lab_component_abbr`, `lab_component_loinc` as `code` FROM `lab_results_component` WHERE (`lab_component_name` LIKE '%" + key + "%' OR `lab_component_loinc` LIKE '%" + key + "%') " + resultLimit;
        return sql;
    }

    /**
    * Search vital signs by name
    *
    * @param {string} key search key
    * @param {number} limit No. of rows in limit
    * @returns {string} SQL query
    */
    static searchVitalSigns(key, limit = 0) {
        var resultLimit = this.setQueryLimit(limit);
        var sql = "SELECT `vital_signs_id` as `code`, `vital_signs_name` as `name`, `vital_signs_active` FROM `vital_signs` WHERE `vital_signs_name` LIKE '%" + key + "%' AND `vital_signs_active` = 1 " + resultLimit;
        return sql;
    }

    /**
    * Search imaging by name
    *
    * @param {string} key search key
    * @param {number} limit No. of rows in limit
    * @returns {string} SQL query
    */
    static searchImaging(key, limit = 0) {
        var resultLimit = this.setQueryLimit(limit);
        var sql = "SELECT `imaging_id`, `imaging_name` as `name`, `procedure_key`, '' as `code`, `imaging_active` FROM `imagingmaster` WHERE lower(`imaging_name`) LIKE lower('%" + key + "%') AND `imaging_active` = 1 " + resultLimit;
        return sql;
    }

    /**
    * Get admission status
    *
    * @param {number} limit No. of rows in limit
    * @returns {string} SQL query
    */
    static getAdmission(limit = 0) {
        var resultLimit = this.setQueryLimit(limit);
        var sql = "SELECT `admission_status_id`, `admission_status_name` as `name`, '' as `code`,  `admission_status_active` FROM `admission_status` WHERE 1 " + resultLimit;
        return sql;
    }

    /**
    * Search diagnosis by name
    *
    * @param {string} key search key
    * @param {number} limit No. of rows in limit
    * @returns {string} SQL query
    */
    static searchDiagnosis(key, limit = 0) {
        var resultLimit = this.setQueryLimit(limit);
        var sql = "SELECT `diagnosis_name` as `name`, `diagnosis_code` as `code` FROM `diagnosismaster` WHERE lower(`diagnosis_name`) LIKE lower('%" + key + "%') " + resultLimit;
        return sql;

    }

    /**
    * Search demographics by name
    *
    * @param {string} key search key
    * @param {number} limit No. of rows in limit
    * @returns {string} SQL query
    */
    static searchDemographics(key, limit = 0) {
        var resultLimit = this.setQueryLimit(limit);
        var sql = "SELECT `demographicsName` as `name`, '' as `code` FROM `patientdemographics` WHERE lower(`demographicsName`) LIKE lower('%" + key + "%') " + resultLimit;
        return sql;

    }
}

module.exports = SearchDataModel;