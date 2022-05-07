const mysql = require('mysql');

class MySql {
    constructor() {
        this.pool = null;
        this.mysql = mysql;
    }

    getConnection() {
        return new Promise(async (resolve, reject) => {
            let dbConfig = {
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD
            }
            
            if (!dbConfig.host || !dbConfig.database || !dbConfig.user || !dbConfig.password) {
                reject("Invalid DB Config " + JSON.stringify(dbConfig));
                return;
            }

            if (this.pool == null) {
                try {
                    this.pool = mysql.createPool({
                        //debug: true,
                        host: dbConfig.host,
                        database: dbConfig.database,
                        user: dbConfig.user,
                        password: dbConfig.password,
                        insecureAuth: true,
                        connectTimeout: dbConfig.connectTimeout,
                        timeout: 60000,
                        queueLimit: 20
                    });
                }
                catch(ex) {
                    reject(ex);
                }
            }

            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err.sqlMessage);
                    return;
                }

                const query = (sql, binding) => {
                    return new Promise((resolve, reject) => {
                        connection.query(sql, binding, (err, result) => {
                            if (err) reject(err);
                            resolve(result);
                        });
                    });
                };
                const release = () => {
                    return new Promise((resolve, reject) => {
                        if (err) reject(err);
                        resolve(connection.release());
                    });
                };
                resolve({ connection, query, release });
            });
        });
    }

    closeConnection(connection) {
        return new Promise(async (resolve, reject) => {
            try {
                this.pool.releaseConnection(connection);
                resolve();
            }
            catch (ex) {
                reject("Could not close connection: " + ex);
            }
        })
    }

    executeQuery(query, parameters) {
        return new Promise((resolve, reject) => {
            this.getConnection()
                .then(conn => {
                    conn.query(query, (err, results, fields) => {
                        this.closeConnection(conn);

                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(results);
                    });
                })
                .catch(err => {
                    reject(err);
                })
        });
    }

    cleanup() {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.pool != null) {
                    await this.pool.end();
                    this.pool = null;
                }

                resolve('Cleaned up mysql connections');
            }
            catch (ex) {
                reject('Failed to cleanup mysql connections ' + ex.stack ? ex.stack : ex);
            }
        })
    }
}

module.exports = new MySql();