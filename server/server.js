const http = require("http")
const fs = require("fs")
const path = require("path")
const { Client } = require("pg")

const MIME = require("./config/mime")
const DB = require("./config/db.js")

const PORT = process.env.PORT || 3003
const host = "127.0.0.1"

const server = http.createServer((req, res) => {
    let requestPath = req.url
    while(path.dirname(requestPath) !== "/") {
        requestPath = path.dirname(requestPath)
    }

    if (requestPath === "/login") {
        if (req.method === "POST") {
            let data = ''
            req.on("data", (chunk) => {
                data += chunk
            })
            req.on('end', () => {
                let userData = JSON.parse(data)
                let query = {
                    name: 'auth-user',
                    text: 'SELECT password FROM users WHERE email = $1',
                    values: [userData.email]
                }
                
                const client = new Client(DB.conn)
            
                client.connect()
                client
                    .query(query)
                    .then(response => {
                        console.log("user : " + userData.password)
                        console.log("db : " + response.rows[0].password)
                        if (response.rows[0].password == userData.password) {
                            console.log("Auth succes")
                            client.end()
                            res.statusCode = 200
                        }
                        else {
                            console.log("Auth fail")
                            client.end()
                            res.statusCode = 401
                        }
                        res.end()
                    })
                    .catch(err => {
                        console.log(err)
                        client.end()
                        res.statusCode = 500
                        res.end()
                    })
            })
            req.on('error', (err) => {
                console.log(err)
                res.statusCode = 500
                res.end()
            })
        }
    }

    else if (requestPath === "/adduser") {
        if (req.method === "POST") {
            let infos = ''
            req.on("data", (chunk) => {
                infos += chunk
            })
            req.on('end', () => {
                console.log(infos)

                let userData = JSON.parse(infos)
                let query = {
                    name: 'add-user',
                    text: 'INSERT INTO users(pseudo, firstname, lastname, email, password, created_at) VALUES($1, $2, $3, $4, $5, $6)',
                    values: [userData.pseudo, userData.firstname, userData.lastname, userData.email, userData.password, userData.created_at]
                }

                const client = new Client(DB.conn)

            
                client.connect()

                client
                    .query(query)
                    .then(response => {
                        console.log(response)
                        client.end()
                        res.statusCode = 200
                    })
                    .catch(err => {
                        console.log(err)
                        client.end()
                        res.statusCode = 500
                    })
                    
                res.end()
            })
            req.on('error', (err) => {
                console.log(err)
                res.statusCode = 500
                res.end()
            })
        }
    }

    else {
        res.statusCode = 403
        res.setHeader("Content-Type", MIME.html)
        res.end("<h1>403, Access forbiden</h1>")
    }
    
})

server.listen(PORT, host, () => {
    console.log("Server running at " + PORT)
})