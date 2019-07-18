class Patient {

    static getPatientByPatientKey(Patient_key = null) {
        if (Patient_key == null || Patient_key == '') {
            return false;
        }
        let sql = `SELECT Patient.PatientKey as Patient_id, Patient.ProblemComboKey, Patient.PrimaryCareProviderKey, Patient.PatientRaceComboKey , Patient.PreliminaryCauseOfDeathDiagnosisKey, Patient.AddressKey, Patient.PatientEpicId, Patient.Name, Patient.PreferredName, Patient.FirstName, Patient.MiddleName, Patient.LastName, Patient.Ssn, Patient.EnterpriseId, Patient.PrimaryMrn, Patient.Sex, Patient.Ethnicity, Patient.FirstRace, Patient.BirthDate, DATEDIFF(YEAR, Patient.BirthDate, GETDATE()) AS Age, Patient.DeathDate, Patient.DeathInstant, Patient.DeathLocation, Patient.Status, Patient.Address, Patient.City, Patient.County, Patient.StateOrProvince, Patient.StateOrProvinceAbbreviation, Patient.Country, Patient.PostalCode, Patient.HomePhoneNumber, Patient.WorkPhoneNumber, Patient.EmailAddress, Patient.MaritalStatus, Patient.Religion, Patient.SmokingStatus FROM Caboodle_Nov18.Kit.PatientDim as Patient WHERE Patient.PatientKey = ` + Patient_key;
        return sql;
    }

    static getAllPatientSQL(offset_start = 1, offset_end = 25) {
        let sql = `SELECT * FROM ( SELECT /*TOP 10*/ ROW_NUMBER() OVER (ORDER BY Patient.PatientKey) AS rownumber, Patient.PatientKey as Patient_id, Patient.ProblemComboKey, Patient.PrimaryCareProviderKey, Patient.PatientRaceComboKey , Patient.PreliminaryCauseOfDeathDiagnosisKey, Patient.AddressKey, Patient.PatientEpicId, Patient.Name, Patient.PreferredName, Patient.FirstName, Patient.MiddleName, Patient.LastName, Patient.Ssn, Patient.EnterpriseId, Patient.PrimaryMrn, Patient.Sex, Patient.Ethnicity, Patient.FirstRace, Patient.BirthDate, DATEDIFF(YEAR, Patient.BirthDate, GETDATE()) AS Age, Patient.DeathDate, Patient.DeathInstant, Patient.DeathLocation, Patient.Status, Patient.Address, Patient.City, Patient.County, Patient.StateOrProvince, Patient.StateOrProvinceAbbreviation, Patient.Country, Patient.PostalCode, Patient.HomePhoneNumber, Patient.WorkPhoneNumber, Patient.EmailAddress, Patient.MaritalStatus, Patient.Religion, Patient.SmokingStatus FROM Caboodle_Nov18.Kit.PatientDim as Patient) AS Patients WHERE rownumber BETWEEN ` + offset_start + ` AND ` + offset_end + ` ORDER BY Patient_id ASC`;
        return sql;
    }

    static searchPatientQuery(sex, marital_status, first_race, age) {
        let sql = `SELECT * FROM ( SELECT /*TOP 10*/ ROW_NUMBER() OVER (ORDER BY Patient.PatientKey) AS rownumber, Patient.PatientKey as Patient_id, Patient.ProblemComboKey, Patient.PrimaryCareProviderKey, Patient.PatientRaceComboKey , Patient.PreliminaryCauseOfDeathDiagnosisKey, Patient.AddressKey, Patient.PatientEpicId, Patient.Name, Patient.PreferredName, Patient.FirstName, Patient.MiddleName, Patient.LastName, Patient.Ssn, Patient.EnterpriseId, Patient.PrimaryMrn, Patient.Sex, Patient.Ethnicity, Patient.FirstRace, Patient.BirthDate, DATEDIFF(YEAR, Patient.BirthDate, GETDATE()) AS Age, Patient.DeathDate, Patient.DeathInstant, Patient.DeathLocation, Patient.Status, Patient.Address, Patient.City, Patient.County, Patient.StateOrProvince, Patient.StateOrProvinceAbbreviation, Patient.Country, Patient.PostalCode, Patient.HomePhoneNumber, Patient.WorkPhoneNumber, Patient.EmailAddress, Patient.MaritalStatus, Patient.Religion, Patient.SmokingStatus FROM Caboodle_Nov18.Kit.PatientDim as Patient WHERE Patient.Sex = '` + sex + `' AND Patient.MaritalStatus = '` + marital_status + `' AND Patient.FirstRace = '` + first_race + `' /*AND -- Patient.PatientRaceComboKey IN (4,5) */AND DATEDIFF(YEAR, Patient.BirthDate, GETDATE()) > ` + age + ` ) AS Patients WHERE rownumber BETWEEN 1 AND 25 ORDER BY Patient_id ASC`;
        return sql;
    }
}

module.exports = Patient;