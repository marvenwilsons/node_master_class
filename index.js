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

        // send the response
        res.end('hello world\n')

        // log the request path
        let r = {
            parsedUrl: parsedUrl,
            trimedPath: trimedPath,
            method: method,
            header: headers,
            payload: buffer
        }
        console.log(r)
    })

})

// start the server, and have it listen on port 3000
server.listen(3000, (req, res) => {
    console.log('The server is litening to port 3000 now')
})