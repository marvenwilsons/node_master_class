// primary file for the api

// dependencies
const http = require('http')
const url = require('url')

// the server should respond to all request with a string
const server = http.createServer((req,res) => {
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true)

    // get the path from the url
    const path = parsedUrl.pathname
    const trimedPath = path.replace(/^\/+|\/+$/g,'')

    // send the response
    res.end('hello world\n')

    // log the request path
    console.log(`request received: ${trimedPath === '' ? 'home' : trimedPath}`)

})

// start the server, and have it listen on port 3000
server.listen(3000,(req,res)=> {
    console.log('The server is litening to port 3000 now')
})