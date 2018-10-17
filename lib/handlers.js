/*
 * Request handlers
 */

 // Dependencies

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

module.exports = handlers