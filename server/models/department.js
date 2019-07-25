class Department {
    static facilityDepartment(facilityId) {
        let sql = 'SELECT * from  m_department where f_facility_id = ' + facilityId
        return sql;
    }

    static insertDepartment() {
        let sql = 'INSERT INTO m_department SET ?';
        return sql;
    }

    static updateDepartmentCompaignId(id,compaignId) {
        let sql = 'UPDATE m_department SET facility_survey_campaign_id ="'+compaignId+'" where department_id=' + id
        return sql;
    }
    static updateDepartmentStatus(id,status) {
        let sql = 'UPDATE m_department SET department_is_deleted ='+status+' where department_id=' + id
        return sql;
    }

    static deletefacilityDepartment(facilityId) {
        let sql = 'DELETE from  m_department where f_facility_id = ' + facilityId
        return sql;
    }

    static departmentCompaignId(facilityId,departmentId) {
        let sql = 'SELECT * from m_department d,m_facility_settings f where d.f_facility_id = ' + facilityId + ' AND d.departmentid = ' + departmentId + ' AND d.f_facility_id = f.f_facility_id';
        return sql;
    }

}

module.exports = Department;