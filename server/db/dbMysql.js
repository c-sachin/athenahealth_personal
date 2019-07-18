require('dotenv').config();

/**
 * Create a mysql connection pool using mysql2 package.
 *
 * Use pool.getConnection() & conn.release() to get connection from pool manually (in case of transcation management). Otherwise it will automatically choose & release connection as required.
 * Use connection() to acquire connection from pool.
 * Use execute() or query() to automatically acquire & release connection after query execution
 *
 * @returns {Object} mysql connection pool object
 */
function createPool() {
    try {
        const mysql = require('mysql2');

        const config = {
            host: process.env.MYSQL_DB_HOST,
            user: process.env.MYSQL_DB_USER,
            password: process.env.MYSQL_DB_PASSWORD,
            database: process.env.MYSQL_DB_DATABASE,
            port: parseInt(process.env.MYSQL_DB_PORT),
            waitForConnections: process.env.MYSQL_WAIT_FOR_CON,
            connectionLimit: process.env.MYSQL_DB_MAX_CON,
            queueLimit: process.env.MYSQL_QUERY_LIMIT
        };

        const pool = mysql.createPool(config);

        const promisePool = pool.promise();

        return promisePool;
    } catch (error) {
        return console.log(`Could not connect - ${error}`);
    }
}

const pool = createPool();

module.exports = {
    /**
     * Manually acquire free connection from pool otherwise create a new connection.
     * use conn.release() to release connection after execution of query.
     */
    connection: async () => pool.getConnection(),
    /**
     * Execute mysql query. Same as mysql.execute().
     * It will automatically acquire free connection from pool 
     * otherwise create a new connection & release it after execution of query.
     */
    execute: (...params) => pool.execute(...params),
    /**
     * Execute mysql query. Same as mysql.query().
     * It will automatically acquire free connection from pool
     * otherwise create a new connection & release it after execution of query.
     */
    query: (...params) => pool.query(...params),
};