class Login {

    static getUser(flag, id) {
        let sql = 'SELECT * FROM m_users  WHERE ?';
        return sql;
    }
    static updateUser(id) {
        let sql = 'update m_users set ? where user_id=' + id
        return sql;
    }
}

module.exports = Login;