// primary file for the api

// dependencies
const http = require('http')
const https = require('https')
const url = require('url')
const stringDecoder = require('string_decoder').StringDecoder
const config = require('./config')
const fs = require('fs')


// Instantiating the HTTP server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req,res)
})

// start the server, and have it listen on choosen configuration
httpServer.listen(config.httpPort, (req, res) => {
    console.log("The server is litening to port "+config.httpPort+" ")
})

// Instantiate the HTTPS server
const httpsServerOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsServerOptions,(req, res) => {
    unifiedServer(req,res)
})

// start the server, and have it listen on choosen configuration
httpsServer.listen(config.httpsPort, (req, res) => {
    console.log("The server is litening to port "+config.httpsPort+" ")
})


// All the server logic for both https serve
const unifiedServer = (req, res) => {
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true)

    // get the path from the url
    const path = parsedUrl.pathname
    const trimedPath = path.replace(/^\/+|\/+$/g, '')

    // get the query string as an object
    // url?key=value <- from client
    let queryStringObject = parsedUrl.query

    // Get the http Method
    const method = req.method.toLocaleLowerCase()

    // Get the headers as an object
    const headers = req.headers

    // Get payload, if any, POST request
    const decoder = new stringDecoder('utf-8')
    let buffer = ''
    req.on('data', (data) => {
        buffer += decoder.write(data)
    })
    req.on('end', () => {
        buffer += decoder.end()

        // choose the handler this request should go to,
        // if one is not found go to not found handler
        let chosenHandler = typeof(router[trimedPath]) !== 'undefined' ? 
        router[trimedPath] : handlers.notFound

        // Construct the data object to send to the handler
        let data = {
            trimedPath: queryStringObject,
            method: method,
            header: headers,
            payload: buffer
        }

        // Route the request to the handler specified in the router
        chosenHandler(data,(statusCode,payload)=> {
            // Use the status code callde back by the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200

            // Use the payload callded back by the hanlder or default to empyt obj
            payload = typeof(payload) == 'object' ? payload : {}

            // Convert the payload to a string
            const payloadtString = JSON.stringify(payload)

            // return the response
            // set wahat content type will of what the user will be receiving on the response
            res.setHeader('Content-Type','application/json')
            res.writeHead(statusCode)
            res.end(payloadtString)

            // log request path
            console.log('Returning this response', statusCode,payloadtString)
        })
        
    })
}

// Define handlers
let handlers = {}

// not found handle
handlers.notFound = (data,callback) => {
    callback(404)
}

// sample handler
handlers.ping = (data,callback) => {
    // Callback a http status code, adn a payload object
    callback(200)
}

// Define a request router
const router = {
    'ping': handlers.ping
}