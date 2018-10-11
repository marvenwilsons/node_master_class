// primary file for the api

// dependencies
const http = require('http')

// the server should respond to all request with a string
const server = http.createServer((req,res) => {
    res.end('hello world\n')
})

// start the server, and have it listen on port 3000
server.listen(3000,(req,res)=> {
    console.log('The server is litening to port 3000 now')
})