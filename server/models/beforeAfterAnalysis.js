class BeforeAfterAnalysis {
    /**
     * Get sql query for list of all active before after analysis or a specific one with id.
     * 
     * @param {number} flag 1 for baa with id or 0 for all active baa
     * @param {string} id baa id
     * 
     * @returns {string} Sql query for list of all active before after analysis or a specific one with id.
     */
    static getBaaList(flag = 0, id = null) {
        // List of all BAA
        let sql = 'SELECT COUNT(baa_measure_baa_id) AS paramCount, baa.*, m_facility_users.* FROM baa_measure JOIN baa ON baa_measure.baa_measure_baa_id = baa.baa_id JOIN m_facility_users ON m_facility_users.m_facility_user_id = baa.baa_user_id WHERE `baa_active` = 1 GROUP BY baa.baa_id';
        if (flag == 1 && id != null) {
            sql = 'SELECT COUNT(baa_measure_baa_id) AS paramCount, baa.*, m_facility_users.* FROM baa_measure JOIN baa ON baa_measure.baa_measure_baa_id = baa.baa_id JOIN m_facility_users ON m_facility_users.m_facility_user_id = baa.baa_user_id WHERE `baa_active` = 1 AND baa.baa_id =' + id;
        }
        return sql;
    }

    /**
     * Get sql query to get measure details by id.
     * 
     * @param {number} id Measure Id
     * 
     * @returns {string} Sql query to get measure details by id.
     */
    static getMeasuredata(id) {
        let sql = 'SELECT * FROM baa_measure WHERE baa_measure_baa_id = ' + id
        return sql;
    }

    /**
     * Get sql query to get intervention data by intervention type.
     * 
     * @param {*} type Intervention type.
     * 
     * @returns {string} Sql query to get intervention data by intervention type.
     */
    static getDataOfintervation(type) {
        // For procedure
        let sql = 'SELECT CONCAT(order_name,"|",order_code) AS parameter_name,CONCAT(order_name,"|",order_code) AS parameter_id,"value" AS return_type FROM ordersmaster';
        if (type == 3) {
            // For medication
            sql = 'SELECT CONCAT(medication_name,"|",ifnull(medication_gpi_code,"")) AS parameter_name, CONCAT(ifnull(medication_name,""),"|", ifnull(medication_gpi_code,"")) AS  parameter_id ,"value" AS return_type FROM medicationsmaster ORDER BY medication_id DESC LIMIT 30000';
        }
        return sql;
    }

    /**
     * Get sql query to get measure data by measure type.
     *
     * @param {*} type Measure type.
     *
     * @returns {string} Sql query to get measure data by measure type.
     */
    static getMeasureTypeData(type = null) {
        // For admission data
        let sql = 'SELECT admission_status_name AS parameter_name,CONCAT(admission_status_name,"|",admission_status_id) AS parameter_id,"value" AS return_type FROM admission_status';
        if (type == 1) {
            // Get Lab Data
            sql = 'SELECT CONCAT(lab_component_name,"|",lab_component_loinc) AS parameter_name,CONCAT(lab_component_name,"|",lab_component_loinc) AS parameter_id,"value" AS return_type FROM  lab_results_component';
        }
        if (type == 3) {
            // Get Medication Data
            sql = 'SELECT CONCAT(medication_name,"|",ifnull(medication_gpi_code,"")) AS parameter_name, CONCAT(ifnull(medication_name,""),"|", ifnull(medication_gpi_code,"")) AS  parameter_id ,"value" AS return_type FROM medicationsmaster ORDER BY medication_id DESC LIMIT 30000';
        }
        return sql;
    }

    /**
     * Get sql query for patient details along with baa details, patient search query details.
     * 
     * @param {number} id patient run id
     * 
     * @returns {string} Sql query for patient details along with baa details, patient search query details.
     */
    static getPatientBaa(id) {
        let sql = 'SELECT psq_result_mrn, patient_details.patient_name as patient_name, psq_result_psq_run_id, psq_daily_query_id, patientsearchquery.baa_baa_id FROM psq_result JOIN  psq_run ON psq_result.psq_result_psq_run_id = psq_run.psq_id JOIN patientsearchquery ON patientsearchquery.psq_id = psq_run.psq_run_psq_id JOIN patient_details ON patient_details.patient_mrn = psq_result.psq_result_mrn WHERE psq_result_id = ?';
        return sql;
    }

    /**
     * Get sql query for baa by id.
     * 
     * @param {number} id baa id.
     * 
     * @returns {string}  Sql query for baa by id.
     */
    static baaExist(id) {
        let sql = 'SELECT b1.*, b2.* FROM baa as b1 JOIN baa_measure as b2 ON b1.baa_id = b2.baa_measure_baa_id WHERE b1.baa_active = 1 AND b1.baa_id = ' + id;
        return sql;

    }

    /**
     * Insert query for baa.
     * 
     * @returns {string} Insert query for baa.
     */
    static insertBaa() {
        let sql = "INSERT INTO baa SET ?";
        return sql;
    }

    /**
     * Update query for baa by id.
     * 
     * @param {number} baaId BAA id.
     * 
     * @returns {string} Update query for baa by id.
     */
    static updateBaaById(baaId) {
        let sql = "UPDATE baa SET ? WHERE baa_id = " + baaId;
        return sql;
    }

    /**
     * Insert query for baa measures.
     *
     * @returns {string} Insert query for baa measures.
     */
    static insertBaaMeasure() {
        let sql = "INSERT INTO baa_measure SET ?";
        return sql;
    }

    /**
     * Update query for baa measure by measure id.
     *
     * @param {number} baaId BAA measure id.
     *
     * @returns {string} Update query for baa measure by measure id.
     */
    static updateBaaMeasureById(baaMeasureId) {
        let sql = "UPDATE baa_measure SET ? WHERE baa_measure_id = " + baaMeasureId;
        return sql;
    }
}

module.exports = BeforeAfterAnalysis;