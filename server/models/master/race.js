class Race {

    static getRaceList(flag, id) {
        let sql = `SELECT * FROM  racemaster  WHERE ?`;
        if (flag == 0) {
            // all race
            sql = `SELECT * FROM  racemaster where race_active = 1`;
        }
        return sql;
    }
    static updateRaceById(id) {
        let sql = 'UPDATE  racemaster SET ? where race_id = ' + id;
        return sql;
    }
    static insertRace() {
        let sql = 'INSERT INTO  racemaster SET  ?';
        return sql;
    }
}

module.exports = Race;