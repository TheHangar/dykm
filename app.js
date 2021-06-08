const http = require("http")
const fs = require("fs")
const path = require("path")

const MIME = require("./config/mime")

const port = 8080
const host = "127.0.0.1"

const server = http.createServer((req, res) => {
    let directory = req.url
    while(path.dirname(directory) !== "/") {
        directory = path.dirname(directory)
    }


    if (req.url === "/") {

        fs.readFile("./index.html", "utf8", (err, file) => {
            if (err) {
                console.log(err)
                res.statusCode = 503
                res.setHeader("Content-Type", MIME.html)
                res.end("<h1>503, Internal error</h1>")
            }
            else {
                res.statusCode = 200
                res.setHeader("Content-Type", MIME.html)
                res.end(file)
            }
        })

        
    }

    else if (directory === "/public") {

        let fileExt = path.extname(req.url).replace(".", "")
        let fileContent = ""

        const stream = fs.createReadStream(`./${req.url}`, (err) => {
            if (err) {
                console.log(err)
            }
        })
        stream.on("data", chunk => {
            fileContent += chunk
        })
        stream.on("end", () => {
            res.statusCode = 200
            res.setHeader("Content-Type", MIME[fileExt])
            res.end(fileContent)
        })

    }

    else {
        res.statusCode = 403
        res.setHeader("Content-Type", MIME.html)
        res.end("<h1>403, Access forbiden</h1>")
    }
    
})

server.listen(port, host, () => {
    console.log("Server running")
})