const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    database: "blogs",
    user: "root",
    password: "9266640036"
});

module.exports = pool;