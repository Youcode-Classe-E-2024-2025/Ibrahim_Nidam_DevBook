const mysql = require('mysql2');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : 'post',
    database: 'devbook_db'
});

db.connect(err => {
    if(err){
        console.error('failed : ', err.stack);
        return;
    }

    console.log('connected with database');
})

module.exports = db;