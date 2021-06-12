const { Pool, Client } = require("pg")

const pool = new Pool({
    user: 'myapp',
    host: 'localhost',
    database: 'dykm',
    password: 'thepassword',
    port: 5432,
})

pool.query("SELECT firstname FROM users", (err, res)=> {
    console.log(err, res)
    pool.end()
})

function getData(obj) {
    console.log(obj)
}
exports.getData = getData