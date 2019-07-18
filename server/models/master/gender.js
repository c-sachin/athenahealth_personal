class Gender {
    static getGenderList(flag, id) {
        let sql = `SELECT * FROM gendermaster  WHERE ?`;
        if (flag == 0) {
            // all gender
            sql = `SELECT * FROM gendermaster where gender_active = 1`;
        }
        return sql;
    }
    static updateGenderById(id) {
        let sql = 'UPDATE gendermaster SET ? where gender_id = ' + id;
        return sql;
    }
    static insertGender() {
        let sql = 'INSERT INTO gendermaster SET  ?';
        return sql;
    }
}

module.exports = Gender;