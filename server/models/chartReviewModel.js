class  ChartReviewModel {
    /**
     * Get sql query for patient details by patient mrn number.
     * 
     * @param {number} mrn Patient MRN Number.
     * 
     * Sql query for patient details by patient mrn number.
     */
	static patientSearch(mrn) {
		var sql = 'select * from patient_details where patient_mrn = ' + mrn;
		return sql;
	}

    /**
     * Get sql query for patient details by patient name.
     * 
     * @param {string} name Patient name
     * 
     * Sql query for patient details by patient name.
     */
	static patientSearchByName(name) {
		var sql = 'select * from patient_details where patient_name like "%' + name + '%"';
		return sql;
	}
}

module.exports = ChartReviewModel;
