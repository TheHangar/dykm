const http = require("http")
const fs = require("fs")
const path = require("path")

const MIME = require("./config/mime")

const PORT = process.env.PORT || 3003
const host = "127.0.0.1"

const server = http.createServer((req, res) => {
    let requestPath = req.url
    while(path.dirname(requestPath) !== "/") {
        requestPath = path.dirname(requestPath)
    }

    if (requestPath === "/login") {
        if (req.method === "POST") {
            let infos = ''
            req.on("data", (chunk) => {
                infos += chunk
            })
            req.on('end', () => {
                console.log(infos)
                //verify mail & hash in db
                //if good > status code 200
                //if not > status code 401
                res.statusCode = 401
                res.end()
            })
            req.on('error', (err) => {
                console.log(err)
                res.statusCode = 500
                res.end()
            })
        }
    }

    if (requestPath === "/adduser") {
        if (req.method === "POST") {
            let infos = ''
            req.on("data", (chunk) => {
                infos += chunk
            })
            req.on('end', () => {
                console.log(infos)
                //create new row in db
                //if good > status code 200
                //if not > status code 401
                res.statusCode = 401
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