const sql = require('mssql');

const config = {
    user: 'SA',
    password: 'parolaAiaPuternic4!',
    server: 'localhost',
    port:1433,
    database: 'MyVet',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

const poolPromise = new sql.ConnectionPool(config).connect().then(
    pool => {
                console.log('Connected to SQLServer');
                return pool;
            }
    ).catch(err => console.error('Error', err));

module.exports = {
    sql, poolPromise
};    