const mysql = require('mysql');

module.exports = () => {
    return mysql.createConnection({
        host: 'sql12.freesqldatabase.com',
        user: 'sql12298121',
        password: 'l2SM2xgdbw',
        database: 'sql12298121'
    });
}


/* module.exports = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sagradafamilia'
    });
} */