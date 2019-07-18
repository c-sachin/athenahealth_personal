class Imaging {

    static getImagingList(flag, id) {
        let sql = `SELECT * FROM imagingmaster  WHERE ?`;
        if (flag == 0) {
            // all imaging
            sql = `SELECT * FROM imagingmaster where imaging_active = 1`;
        }
        return sql;
    }
    static updateImagingById(id) {
        let sql = 'UPDATE imagingmaster SET ? where imaging_id = ' + id;
        return sql;
    }
    static insertImaging() {
        let sql = 'INSERT INTO imagingmaster SET  ?';
        return sql;
    }
}

module.exports = Imaging;