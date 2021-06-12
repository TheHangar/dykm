const { Client } = require("pg")

const client = new Client({
    user: 'myapp',
    host: 'localhost',
    database: 'dykm',
    password: 'thepassword',
    port: 5432,
})

/*client.query("SELECT firstname FROM users", (err, res)=> {
    console.table(res.rows)
})
*/

function checkUser(userData) {
    let isUser = false
    let query = {
        name: 'auth-user',
        text: 'SELECT password FROM users WHERE email = $1',
        values: [userData.email]
    }

    client.connect()

    client.query(query, (err, res) => {
        if (err) {
          console.log(err.stack)
          client.end()
        } 
        else {
            console.log("user : " + userData.password)
            console.log("db : " + res.rows[0].password)
            if (res.rows[0].password == userData.password) {
                console.log("Auth succes")
                client.end()
                isUser = true
            }
        }
      })

    return isUser
}

function addUser(userData) {

    let isAdd = false
    let query = {
        name: 'add-user',
        text: 'INSERT INTO users(pseudo, firstname, lastname, email, password, created_at) VALUES($1, $2, $3, $4, $5, $6)',
        values: [userData.pseudo, userData.firstname, userData.lastname, userData.email, userData.password, userData.created_at]
    }
    client.connect()
    client
        .query(query)
        .then(res => {
            
            isAdd = true
            client.end()
        })
        .catch(err => {
            console.log(err)
            client.end()
        })

}

exports.checkUser = checkUser
exports.addUser = addUser