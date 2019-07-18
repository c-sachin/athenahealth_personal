class PatientDailyQuery {
    static insertPatientDaily() {
        let sql = 'INSERT INTO patientdailyquery SET ?';
        return sql;
    }

    static insertPdqCriterion() {
        let sql = 'INSERT INTO pdq_criterion SET ?';
        return sql;
    }
    static getPatientScreeningList(flag, id) {
        let sql = 'SELECT m_facility_user_name,psq_name,psq_created_timestamp,psq_criterion_group.psqc_group_id, patientsearchquery.psq_id,patientsearchquery.psq_daily_query_id, patientsearchquery.baa_baa_id FROM m_facility_users JOIN patientsearchquery ON m_facility_users.m_facility_user_id = patientsearchquery.psq_user_id JOIN  psq_criterion_group ON psq_criterion_group.psqc_psq_id = patientsearchquery.psq_id JOIN psq_criterion  ON  psq_criterion.psqc_group_id = psq_criterion_group.psqc_group_id WHERE patientsearchquery.psq_id = ' + id;
        if (flag == 0) {
            // List
            sql = 'SELECT COUNT(psqc_criterion_id) AS paramCount,solar_query_reponse_patients_cnt,query_run_updated_at, m_facility_user_name,psq_name,psq_created_timestamp, patientsearchquery.psq_id FROM m_facility_users  JOIN patientsearchquery ON m_facility_users.m_facility_user_id = patientsearchquery.psq_user_id JOIN psq_criterion_group ON psq_criterion_group.psqc_psq_id = patientsearchquery.psq_id JOIN psq_criterion ON psq_criterion_group.psqc_group_id = psq_criterion.psqc_group_id where  patientsearchquery.is_deleted = 0 GROUP BY psq_criterion_group.psqc_psq_id';
        }
        return sql;
    }

    static getVariableValues(variableType) {
        // Admission
        var sql = 'SELECT admission_status_name AS parameter_name,CONCAT(admission_status_name,"|",admission_status_id) AS parameter_id,"value" AS return_type FROM admission_status';
        if (variableType == 1) {
            //lab component
            sql = 'SELECT CONCAT(lab_component_name,"|",lab_component_loinc) AS parameter_name,CONCAT(lab_component_name,"|",lab_component_loinc) AS parameter_id,"value" AS return_type FROM  lab_results_component';
        }
        if (variableType == 2) {
            //vital signs
            sql = 'SELECT CONCAT(vital_signs_name,"|",vital_signs_id) AS parameter_name,CONCAT(vital_signs_name,"|",vital_signs_id) AS parameter_id,"value" AS return_type FROM vital_signs';
        }
        if (variableType == 3) {
            //medication
            sql = 'SELECT concat(medication_name,"|",ifnull(medication_gpi_code,"")) AS parameter_name, concat(ifnull(medication_name,""),"|", ifnull(medication_gpi_code,"")) AS  parameter_id ,"value" AS return_type from medicationsmaster ORDER BY medication_id DESC LIMIT 30000';
        }
        if (variableType == 4) {
            //imaging
            sql = 'SELECT imaging_name AS parameter_name, CONCAT(imaging_name,"|",procedure_key) AS parameter_id,"value" AS return_type FROM imagingmaster';
        }
        if (variableType == 5) {
            //admissiom
            sql = 'SELECT admission_status_name AS parameter_name,CONCAT(admission_status_name,"|",admission_status_id) AS parameter_id,"value" AS return_type FROM admission_status';
        }
        if (variableType == 7) {
            //order result
            sql = 'SELECT CONCAT(order_name,"|",order_code) AS parameter_name,CONCAT(order_name,"|",order_code) AS parameter_id,"value" AS return_type FROM ordersmaster';
        }
        return sql;
    }

    static getVariableRange(pdqcVariableId) {
        /**
         * For variableType
         * 1 & 2: Lab component & vital signs
         * 3: Medication
         * 4: Imaging
         */
        var variableType = pdqcVariableId;
        if (pdqcVariableId == 1 || pdqcVariableId == 2) {
            variableType = 1;
        }
        var sql = 'SELECT variable_value_name AS parameter_name, variable_value_id AS parameter_id, "value" AS return_type FROM variable_values WHERE variable_type = ' + variableType;

        return sql
    }

    static getDailyQuery(id) {
        let sql = 'select patientdailyquery.*,m_facility_users.*,pdq_criterion.*  FROM pdq_criterion join patientdailyquery on pdq_criterion.pdqc_pdq_id=patientdailyquery.pdq_id join m_facility_users on m_facility_users.m_facility_user_id=patientdailyquery.pdq_user_id where `pdq_active` = 1 and patientdailyquery.pdq_id=' + id
        return sql;
    }

    static getPdqCriterion(id) {
        let sql = 'SELECT * from pdq_criterion where pdqc_pdq_id=' + id
        return sql;
    }

    static deletePdqCriterion(id) {
        let sql = 'delete pdq_criterion from  pdq_criterion join patientdailyquery  ON  pdq_criterion.pdqc_pdq_id = patientdailyquery.pdq_id  where patientdailyquery.pdq_id=' + id
        return sql
    }

    static updatePdq(flag, id) {
        let sql = 'update patientdailyquery SET is_deleted = 1 WHERE ?'; // delete update
        if (flag == 0) {
            sql = 'update patientdailyquery SET ? where pdq_id=' + id
        }
        return sql;
    }

    static getPatientData(id) {
        let sql = 'select psq_result_mrn,patient_details.patient_name,psq_result_psq_run_id,psq_daily_query_id from psq_result join psq_run on psq_result.psq_result_psq_run_id=psq_run.psq_id join patientsearchquery on patientsearchquery.psq_id =psq_run.psq_run_psq_id join patient_details on patient_details.patient_mrn = psq_result_mrn where psq_result_id=' + id
        return sql;
    }





}

module.exports = PatientDailyQuery;