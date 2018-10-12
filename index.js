// primary file for the api

// dependencies
const http = require('http')
const url = require('url')
const stringDecoder = require('string_decoder').StringDecoder

// the server should respond to all request with a string
const server = http.createServer((req, res) => {
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
        let chosebHandler = typeof(router[trimedPath]) !== 'undefined' ? 
        router[trimedPath] : handlers.notFound

        // Construct the data object to send to the handler
        let data = {
            trimedPath: queryStringObject,
            method: method,
            header: headers,
            payload: buffer
        }

        // Route the request to the handler specified in the router
        chosebHandler(data,(statusCode,payload)=> {
            // Use the status code callde back by the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200

            // Use the payload callded back by the hanlder or default to empyt obj
            payload = typeof(payload) == 'object' ? payload : {}

            // Convert the payload to a string
            const payloadtString = JSON.stringify(payload)

            // return the response
            res.writeHead(statusCode)
            res.end(payloadtString)

            // log request path
            console.log('Returning this response', statusCode,payloadtString)
        })
        
    })

})

// start the server, and have it listen on port 3000
server.listen(3000, (req, res) => {
    console.log('The server is litening to port 3000 now')
})

// Define handlers
let handlers = {}

// sample handler
handlers.sample = (data,callback) => {
    // Callback a http status code, adn a payload object
    callback(406,{'name' : 'sample handler'})
}

// not found handle
handlers.notFound = (data,callback) => {
    callback(404)
}

// Define a request router
const router = {
    'sample': handlers.sample
}