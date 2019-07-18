class PatientSearch {

    static getPatientScreeningList(flag, id) {
        let sql = 'SELECT patientsearchquery.*,psq_criterion.*,m_facility_user_name,psq_name,psq_created_timestamp,psq_criterion_group.psqc_group_id, patientsearchquery.psq_id,patientsearchquery.psq_daily_query_id, patientsearchquery.baa_baa_id FROM m_facility_users JOIN patientsearchquery ON m_facility_users.m_facility_user_id = patientsearchquery.psq_user_id JOIN  psq_criterion_group on psq_criterion_group.psqc_psq_id = patientsearchquery.psq_id JOIN psq_criterion  ON psq_criterion.psqc_group_id = psq_criterion_group.psqc_group_id WHERE patientsearchquery.psq_id = ' + id;
        if (flag == 0) {
            // List
            sql = 'SELECT COUNT(psqc_criterion_id) AS paramCount, solar_query_reponse_patients_cnt,query_run_updated_at, m_facility_user_name, psq_name, psq_created_timestamp, patientsearchquery.psq_id FROM m_facility_users JOIN patientsearchquery ON m_facility_users.m_facility_user_id = patientsearchquery.psq_user_id JOIN psq_criterion_group ON psq_criterion_group.psqc_psq_id = patientsearchquery.psq_id JOIN psq_criterion ON psq_criterion_group.psqc_group_id = psq_criterion.psqc_group_id WHERE  patientsearchquery.is_deleted != 1 GROUP BY psq_criterion_group.psqc_psq_id';
        }
        return sql;
    }

    static getParametersTableValues(parameterTable) {
        // Patient Demographics = 1
        var sql = 'SELECT demographicsName AS parameter_name, demographicsName AS parameter_id, "dropdown" AS return_type  FROM patientdemographics';
        if (parameterTable == 2) {
            // Orders
            sql = 'SELECT CONCAT(order_name,"|",order_code) AS parameter_name, CONCAT(order_name,"|",order_code) AS parameter_id,"value" AS return_type FROM ordersmaster';
        }
        if (parameterTable == 3) {
            // Lab components
            sql = 'SELECT CONCAT(lab_component_name) AS parameter_name,CONCAT(lab_component_name) AS parameter_id ,"value" AS return_type FROM lab_results_component';
        }
        if (parameterTable == 4) {
            // Diagnosis / Condition & Problems
            sql = 'SELECT CONCAT(diagnosis_name,"|",diagnosis_code) AS parameter_name, CONCAT(diagnosis_name,"|",diagnosis_code) AS parameter_id,"value" AS return_type FROM diagnosismaster';
        }
        if (parameterTable == 5) {
            // Medication
            sql = 'SELECT CONCAT(medication_name,"|",IFNULL(medication_gpi_code,"")) AS parameter_name, CONCAT(IFNULL(medication_name,""),"|", IFNULL(medication_gpi_code,"")) AS  parameter_id ,"value" AS return_type FROM medicationsmaster ORDER BY medication_id DESC LIMIT 10000';
        }
        return sql
    }

    static getSubTableValues(parameterSubTable) {
        // Age
        var sql = 'SELECT condition_name AS parameter_name,condition_id AS parameter_id FROM condition_statement';
        if (parameterSubTable == 'Race') {
            sql = 'SELECT race_name AS parameter_name, race_id AS parameter_id FROM racemaster';
        }
        if (parameterSubTable == 'Sex') {
            sql = 'SELECT gender_name AS parameter_name,gender_id AS parameter_id FROM gendermaster';
        }
        if (parameterSubTable == 'Marital Status') {
            sql = 'SELECT maritalStatus_name AS parameter_name,maritalStatus_id AS parameter_id FROM maritalstatus';
        }
        return sql
    }

    static updatePatientScreening(id) {
        let sql = '';
        sql = 'UPDATE patientsearchquery SET ? WHERE psq_id = ' + id
        return sql;
    }

    static patientScreeningDelete() {
        let sql = 'UPDATE patientsearchquery SET is_deleted = 1 WHERE ?'
        return sql;
    }

    static groupDetails(id) {
        let sql = 'SELECT psq_criterion_group.psqc_group_id,group_criteria_name,psq_criterion.* FROM  psq_criterion_group LEFT JOIN psq_criterion  ON  psq_criterion.psqc_group_id = psq_criterion_group.psqc_group_id WHERE  psq_criterion_group.psqc_group_id = ' + id
        return sql;
    }

    static getPsqRun(id) {
        let sql = 'SELECT * FROM `psq_run` WHERE `psq_run_psq_id` = ' + id + ' ORDER BY `psq_id` DESC LIMIT 1'
        return sql
    }

    static getPatientResult(id) {
        let sql = 'SELECT (psq_result_mrn),psq_result_id, patient_name AS psq_result_name, patient_age AS psq_result_age, patient_gender AS psq_result_sex, marital_status AS psq_result_marital_status,patient_race AS psq_result_race FROM psq_result JOIN psq_run ON psq_result.psq_result_psq_run_id = psq_run.psq_id join patient_details on patient_details.patient_mrn = psq_result.psq_result_mrn WHERE psq_run.psq_id = ' + id;
        return sql;
    }

    static deleteCriterion(id) {
        let sql = 'DELETE psq_criterion from  psq_criterion join psq_criterion_group  ON  psq_criterion.psqc_group_id = psq_criterion_group.psqc_group_id join  patientsearchquery on psq_criterion_group.psqc_psq_id = patientsearchquery.psq_id where patientsearchquery.psq_id=' + id
        return sql;
    }

    static getPdqList() {
        let sql = 'SELECT GROUP_CONCAT(variable_type_name) AS paramCount,patientdailyquery.*,m_facility_users.*  FROM pdq_criterion JOIN patientdailyquery ON pdq_criterion.pdqc_pdq_id = patientdailyquery.pdq_id JOIN m_facility_users ON m_facility_users.m_facility_user_id = patientdailyquery.pdq_user_id JOIN variable_type ON variable_type.variable_type_id =  pdq_criterion.pdqc_variable_id WHERE patientdailyquery.is_deleted != 1 AND `pdq_active` = 1 group by patientdailyquery.pdq_id'
        return sql;
    }

    static getBaaList() {
        let sql = 'SELECT COUNT(baa_measure_baa_id) AS paramCount, baa.*, m_facility_users.* FROM baa_measure JOIN baa ON baa_measure.baa_measure_baa_id = baa.baa_id JOIN m_facility_users ON m_facility_users.m_facility_user_id = baa.baa_user_id WHERE `baa_active` = 1 GROUP BY baa.baa_id'
        return sql;
    }

    static insertPsq() {
        let sql = 'INSERT INTO patientsearchquery SET ?';
        return sql;
    }

    static updatePsqById(id) {
        let sql = 'UPDATE patientsearchquery SET ? where psq_id=' + id;
        return sql;
    }

    static insertPsqCriterion() {
        let sql = 'INSERT INTO psq_criterion SET ?';
        return sql;
    }

    static insertPsqCriterionGroup() {
        let sql = 'INSERT INTO psq_criterion_group SET ?';
        return sql;
    }

    static insertPsqRun() {
        let sql = 'Insert into psq_run SET ?';
        return sql;
    }

    static insertPsqResult() {
        let sql = 'INSERT INTO psq_result (`psq_result_mrn`, `psq_result_name`, `psq_result_psq_run_id`) VALUES ?';
        return sql;
    }
}

module.exports = PatientSearch;