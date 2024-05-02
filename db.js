const pg = require('pg');

const connection = new pg.Client({
    user: process.env.RDS_USERNAME,
    host: process.env.RDS_HOSTNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
    }
});

module.exports = connection;
